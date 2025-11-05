import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <CartDrawer />
      
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Our Story
            </h1>
            <p className="text-lg text-muted-foreground">
              Crafting luxury fragrances that tell your unique story
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-20">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground mb-4">
                At Essence, we believe that fragrance is more than just a scent—it's an expression of your personality, 
                your mood, and your story. Our mission is to provide you with carefully curated, luxury fragrances 
                that elevate every moment of your day.
              </p>
              <p className="text-muted-foreground">
                Each fragrance in our collection is selected for its exceptional quality, unique character, 
                and ability to create lasting impressions.
              </p>
            </div>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Image placeholder</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🌸</div>
              <h3 className="font-bold mb-2">Premium Quality</h3>
              <p className="text-sm text-muted-foreground">
                Only the finest ingredients and master craftsmanship
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="font-bold mb-2">Curated Selection</h3>
              <p className="text-sm text-muted-foreground">
                Handpicked fragrances from renowned perfumers
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">💝</div>
              <h3 className="font-bold mb-2">Customer First</h3>
              <p className="text-sm text-muted-foreground">
                Your satisfaction is our top priority
              </p>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Find Your Signature Scent?</h2>
            <p className="text-muted-foreground mb-8">
              Explore our collection and discover the fragrance that speaks to you
            </p>
            <Link to="/products">
              <Button size="lg">Shop Now</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
