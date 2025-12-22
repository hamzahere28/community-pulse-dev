import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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

const Category = () => {
  const { category } = useParams();
  const { addItem, setIsCartOpen } = useCart();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryName = category?.charAt(0).toUpperCase() + category?.slice(1) || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .ilike('category', categoryName)
          .order('created_at', { ascending: true });

        if (error) throw error;
        
        setProducts(data || []);
      } catch (error: any) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error loading products",
          description: "Please try refreshing the page",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName, toast]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: parseFloat(String(product.price)),
      image: product.image,
      category: product.category,
    });
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <CartDrawer />
      
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Link to="/products" className="inline-flex items-center gap-2 text-sm mb-8 hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Back to All Products
          </Link>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{categoryName} Collection</h1>
            <p className="text-muted-foreground text-lg">
              Explore our {categoryName.toLowerCase()} fragrances
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found in this category.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <Card key={product.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
                  <div className="relative overflow-hidden aspect-square">
                    <Link to={`/product/${product.id}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                      />
                    </Link>
                    <Badge className="absolute top-4 left-4 shadow-lg">{product.category}</Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm hover:bg-background"
                      onClick={() => toggleFavorite(product.id)}
                    >
                      <Heart className={`h-4 w-4 ${favorites.has(product.id) ? 'fill-primary text-primary' : ''}`} />
                    </Button>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-xl">{product.name}</CardTitle>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p><span className="font-medium">Top:</span> {product.top_notes}</p>
                      <p><span className="font-medium">Heart:</span> {product.heart_notes}</p>
                      <p><span className="font-medium">Base:</span> {product.base_notes}</p>
                    </div>
                  </CardHeader>
                  
                  <CardFooter className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">PKR {product.price.toLocaleString()}</span>
                    <Button 
                      size="sm" 
                      className="gap-2"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Category;
