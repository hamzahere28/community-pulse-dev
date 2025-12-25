import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  product_name: string;
  quantity: number;
  price: number;
}

interface OrderConfirmationRequest {
  email: string;
  customerName: string;
  orderId: string;
  orderItems: OrderItem[];
  totalAmount: number;
  shippingAddress: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, customerName, orderId, orderItems, totalAmount, shippingAddress }: OrderConfirmationRequest = await req.json();

    console.log("Sending order confirmation to:", email);
    console.log("Order ID:", orderId);

    const itemsHtml = orderItems.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.product_name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">PKR ${(item.price * item.quantity).toLocaleString()}</td>
      </tr>
    `).join('');

    const emailResponse = await resend.emails.send({
      from: "Fragrance Store <onboarding@resend.dev>",
      to: [email],
      subject: `Order Confirmation #${orderId.slice(0, 8)}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: #ffffff; padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 600;">Thank You for Your Order!</h1>
              <p style="margin: 10px 0 0; opacity: 0.9;">Order #${orderId.slice(0, 8)}</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 30px;">
              <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                Hi ${customerName},
              </p>
              <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                We're excited to confirm your order has been received and is being processed. Here's a summary of your purchase:
              </p>
              
              <!-- Order Items -->
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <thead>
                  <tr style="background-color: #f3f4f6;">
                    <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151;">Product</th>
                    <th style="padding: 12px; text-align: center; font-weight: 600; color: #374151;">Qty</th>
                    <th style="padding: 12px; text-align: right; font-weight: 600; color: #374151;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="2" style="padding: 16px 12px; font-weight: 700; font-size: 18px; color: #1a1a2e;">Total</td>
                    <td style="padding: 16px 12px; text-align: right; font-weight: 700; font-size: 18px; color: #1a1a2e;">PKR ${totalAmount.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
              
              <!-- Shipping Address -->
              <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="margin: 0 0 10px; color: #374151; font-size: 14px; font-weight: 600; text-transform: uppercase;">Shipping Address</h3>
                <p style="margin: 0; color: #6b7280; line-height: 1.6;">${shippingAddress}</p>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
                You'll receive another email when your order ships. If you have any questions, feel free to reply to this email.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f3f4f6; padding: 20px 30px; text-align: center;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                Thank you for shopping with us!
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending order confirmation:", error);
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