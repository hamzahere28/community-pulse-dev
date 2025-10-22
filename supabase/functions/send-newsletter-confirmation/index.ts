import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NewsletterEmailRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: NewsletterEmailRequest = await req.json();
    console.log("Sending newsletter confirmation to:", email);

    const emailResponse = await resend.emails.send({
      from: "Essence <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to Essence Fragrance Community! 🌸",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #d946a6, #e879b9); color: white; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #ffffff; padding: 40px 20px; border: 1px solid #e5e5e5; }
              .footer { background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; background: #d946a6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .benefits { background: #fdf2f8; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .benefit-item { margin: 10px 0; padding-left: 25px; position: relative; }
              .benefit-item:before { content: "✓"; position: absolute; left: 0; color: #d946a6; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 32px;">Welcome to Essence!</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px;">Your journey to finding the perfect scent begins here</p>
              </div>
              
              <div class="content">
                <h2 style="color: #d946a6;">Thank You for Subscribing! 🎉</h2>
                <p>We're thrilled to have you join our fragrance-loving community. You've taken the first step towards discovering scents that will become part of your signature style.</p>
                
                <div class="benefits">
                  <h3 style="color: #d946a6; margin-top: 0;">As a subscriber, you'll receive:</h3>
                  <div class="benefit-item">Exclusive early access to new fragrance launches</div>
                  <div class="benefit-item">Special subscriber-only discounts and promotions</div>
                  <div class="benefit-item">Expert tips on choosing and wearing fragrances</div>
                  <div class="benefit-item">Seasonal scent recommendations tailored to trends</div>
                  <div class="benefit-item">Behind-the-scenes looks at our curation process</div>
                </div>
                
                <p>Explore our collection and find your perfect match:</p>
                <div style="text-align: center;">
                  <a href="${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'lovable.app') || 'https://essence.lovable.app'}/products" class="button">Shop Now</a>
                </div>
                
                <p style="margin-top: 30px; font-style: italic; color: #666;">
                  "A perfume is like a piece of clothing, a message, a way of presenting oneself... a costume that differs according to the woman who wears it." - Paloma Picasso
                </p>
              </div>
              
              <div class="footer">
                <p><strong>Essence Fragrance Haven</strong></p>
                <p>Discover. Experience. Embrace.</p>
                <p style="margin-top: 15px;">
                  If you didn't subscribe to our newsletter, you can safely ignore this email.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-newsletter-confirmation function:", error);
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