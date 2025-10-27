import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

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

const FeaturedProducts = () => {
  const { addItem, setIsCartOpen } = useCart();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as Product[];
    },
  });

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
      price: product.price,
      image: product.image,
      category: product.category,
    });
    setIsCartOpen(true);
  };

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Collection</h2>
            <p className="text-muted-foreground text-lg">Our most loved fragrances</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full mt-2" />
                  <Skeleton className="h-4 w-full mt-1" />
                </CardHeader>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Featured Collection</h2>
          <p className="text-muted-foreground text-lg">Our most loved fragrances</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products?.map((product) => (
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
                <span className="text-2xl font-bold text-primary">${product.price}</span>
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

        <div className="text-center mt-12">
          <Link to="/products">
            <Button size="lg" variant="outline">View All Products</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;