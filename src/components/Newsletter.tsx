import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save to database
      const { error: dbError } = await supabase
        .from("newsletter_subscribers")
        .insert([{ email }]);

      if (dbError) {
        if (dbError.code === "23505") {
          toast.error("You're already subscribed!");
          setLoading(false);
          return;
        }
        throw dbError;
      }

      // Send confirmation email
      const { error: emailError } = await supabase.functions.invoke(
        "send-newsletter-confirmation",
        { body: { email } }
      );

      if (emailError) {
        console.error("Email error:", emailError);
        // Don't fail the whole operation if email fails
        toast.success("Subscribed! (Email confirmation pending)");
      } else {
        toast.success("Successfully subscribed! Check your email for confirmation.");
      }

      setEmail("");
    } catch (error: any) {
      console.error("Subscription error:", error);
      toast.error("Failed to subscribe. Please try again.");
    }

    setLoading(false);
  };

  return (
    <section className="py-16 bg-gradient-to-r from-primary to-accent">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center text-primary-foreground">
          <Mail className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Join Our Fragrance Community</h2>
          <p className="mb-8 text-primary-foreground/90">
            Subscribe to get special offers, new arrivals, and expert fragrance tips delivered to your inbox
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/60"
            />
            <Button 
              type="submit" 
              disabled={loading}
              variant="secondary"
              className="whitespace-nowrap"
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;