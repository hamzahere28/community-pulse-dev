import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, ArrowLeft } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  top_notes: string;
  heart_notes: string;
  base_notes: string;
}

const ProductDetail = () => {
  const { id } = useParams();
  const { addItem, setIsCartOpen } = useCart();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        setProduct(data);
      } catch (error: any) {
        console.error('Error fetching product:', error);
        toast({
          title: "Error loading product",
          description: "Please try again",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, toast]);

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: parseFloat(String(product.price)),
        image: product.image,
        category: product.category,
      });
      setIsCartOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <CartDrawer />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <CartDrawer />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <Link to="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <CartDrawer />
      
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Link to="/products" className="inline-flex items-center gap-2 text-sm mb-8 hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <img
                src={product.image}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            </div>

            <div>
              <Badge className="mb-4">{product.category}</Badge>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <p className="text-3xl font-bold text-primary mb-8">${product.price}</p>

              <div className="space-y-4 mb-8">
                <div>
                  <h3 className="font-semibold mb-2">Top Notes</h3>
                  <p className="text-muted-foreground">{product.top_notes}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Heart Notes</h3>
                  <p className="text-muted-foreground">{product.heart_notes}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Base Notes</h3>
                  <p className="text-muted-foreground">{product.base_notes}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  size="lg" 
                  className="flex-1 gap-2"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-primary text-primary' : ''}`} />
                </Button>
              </div>

              <div className="mt-8 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Product Details</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Premium quality fragrance</li>
                  <li>• Long-lasting scent</li>
                  <li>• Comes in elegant packaging</li>
                  <li>• Perfect for gifting</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
