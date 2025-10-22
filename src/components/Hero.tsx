import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: "var(--gradient-hero)",
        }}
      />
      
      <div className="container mx-auto px-4 z-10 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 animate-fade-in">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Luxury Fragrances Curated for You</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-fade-in">
          Discover Your Signature Scent
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
          Explore our curated collection of luxury fragrances crafted to elevate your everyday moments. 
          Each scent tells a story, find yours today.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
          <Link to="/products">
            <Button size="lg" className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow">
              Shop Now
            </Button>
          </Link>
          <Link to="/about">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Learn More
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
          {[
            { icon: "✨", title: "Premium Quality", desc: "Authentic luxury fragrances" },
            { icon: "🚚", title: "Free Shipping", desc: "On orders over $100" },
            { icon: "🔒", title: "Secure Payment", desc: "100% secure transactions" },
            { icon: "❤️", title: "Customer Love", desc: "Rated 4.9/5 by customers" },
          ].map((feature, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl mb-2">{feature.icon}</div>
              <h3 className="font-semibold mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;