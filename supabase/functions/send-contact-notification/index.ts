import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message }: ContactEmailRequest = await req.json();
    console.log("Sending contact notification for:", email);

    // Send confirmation to customer
    const customerEmail = await resend.emails.send({
      from: "Essence Support <onboarding@resend.dev>",
      to: [email],
      subject: "We received your message - Essence Fragrances",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #d946a6, #e879b9); color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #ffffff; padding: 30px 20px; border: 1px solid #e5e5e5; }
              .message-box { background: #fdf2f8; padding: 20px; border-left: 4px solid #d946a6; margin: 20px 0; border-radius: 4px; }
              .footer { background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 28px;">Thank You for Contacting Us!</h1>
              </div>
              
              <div class="content">
                <p>Dear ${name},</p>
                <p>We've received your message and our team will get back to you within 24-48 hours. We appreciate you taking the time to reach out to us.</p>
                
                <div class="message-box">
                  <h3 style="margin-top: 0; color: #d946a6;">Your Message:</h3>
                  <p><strong>Subject:</strong> ${subject}</p>
                  <p><strong>Message:</strong><br>${message}</p>
                </div>
                
                <p>In the meantime, feel free to explore our latest fragrance collections or read our blog for expert tips on choosing and wearing perfumes.</p>
                
                <p style="margin-top: 30px;">Best regards,<br><strong>The Essence Team</strong></p>
              </div>
              
              <div class="footer">
                <p><strong>Essence Fragrance Haven</strong></p>
                <p>Questions? Reply to this email or visit our FAQ page</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    // Send notification to admin (using the same email for demo, replace with actual admin email)
    const adminEmail = await resend.emails.send({
      from: "Essence Notifications <onboarding@resend.dev>",
      to: ["onboarding@resend.dev"], // Replace with actual admin email
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
              .header { background: #d946a6; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
              .content { background: white; padding: 30px; border: 1px solid #e5e5e5; }
              .info-row { padding: 10px 0; border-bottom: 1px solid #f0f0f0; }
              .label { font-weight: bold; color: #d946a6; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2 style="margin: 0;">New Contact Form Submission</h2>
              </div>
              
              <div class="content">
                <div class="info-row">
                  <span class="label">Name:</span> ${name}
                </div>
                <div class="info-row">
                  <span class="label">Email:</span> ${email}
                </div>
                <div class="info-row">
                  <span class="label">Subject:</span> ${subject}
                </div>
                <div class="info-row">
                  <span class="label">Message:</span><br>
                  <p style="margin: 10px 0; padding: 15px; background: #fdf2f8; border-radius: 4px;">${message}</p>
                </div>
                <div class="info-row">
                  <span class="label">Received:</span> ${new Date().toLocaleString()}
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Emails sent successfully:", { customerEmail, adminEmail });

    return new Response(JSON.stringify({ success: true, customerEmail, adminEmail }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);