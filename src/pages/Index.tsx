import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import CategoryShowcase from "@/components/CategoryShowcase";
import FragranceRecommender from "@/components/FragranceRecommender";
import ReviewSection from "@/components/ReviewSection";
import Newsletter from "@/components/Newsletter";
import CartDrawer from "@/components/CartDrawer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <CartDrawer />
      <Hero />
      <FeaturedProducts />
      <CategoryShowcase />
      <FragranceRecommender />
      <ReviewSection />
      <Newsletter />
      
      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Essence
              </h3>
              <p className="text-sm text-muted-foreground">
                Premium luxury fragrances crafted to perfection
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/products" className="hover:text-primary">All Products</a></li>
                <li><a href="/category/floral" className="hover:text-primary">Floral</a></li>
                <li><a href="/category/oriental" className="hover:text-primary">Oriental</a></li>
                <li><a href="/category/woody" className="hover:text-primary">Woody</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/contact" className="hover:text-primary">Contact Us</a></li>
                <li><a href="/faq" className="hover:text-primary">FAQ</a></li>
                <li><a href="/shipping" className="hover:text-primary">Shipping Info</a></li>
                <li><a href="/returns" className="hover:text-primary">Returns</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/about" className="hover:text-primary">About Us</a></li>
                <li><a href="/blog" className="hover:text-primary">Blog</a></li>
                <li><a href="/careers" className="hover:text-primary">Careers</a></li>
                <li><a href="/privacy" className="hover:text-primary">Privacy Policy</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Our Stores</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">Main Store</span>
                  <p>Clifton, Karachi</p>
                </li>
                <li>
                  <span className="font-medium text-foreground">North Nazimabad</span>
                  <p>Block H, North Nazimabad, Karachi</p>
                </li>
                <li>
                  <span className="font-medium text-foreground">Tariq Road</span>
                  <p>Tariq Road, Karachi</p>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Essence. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;