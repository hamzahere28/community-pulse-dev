import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

const products = [
  {
    id: 1,
    name: "Noir Elegance",
    category: "Oriental",
    price: 120,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&h=500&fit=crop",
    notes: {
      top: "Bergamot, Black Pepper",
      heart: "Jasmine, Leather",
      base: "Vanilla, Amber",
    },
  },
  {
    id: 2,
    name: "Citrus Bloom",
    category: "Fresh",
    price: 95,
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&h=500&fit=crop",
    notes: {
      top: "Lemon, Grapefruit",
      heart: "Neroli, Green Tea",
      base: "Cedar, Musk",
    },
  },
  {
    id: 3,
    name: "Velvet Rose",
    category: "Floral",
    price: 110,
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=500&h=500&fit=crop",
    notes: {
      top: "Rose, Peony",
      heart: "Violet, Peach",
      base: "Sandalwood, Vanilla",
    },
  },
  {
    id: 4,
    name: "Amber Woods",
    category: "Woody",
    price: 135,
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500&h=500&fit=crop",
    notes: {
      top: "Cardamom, Pink Pepper",
      heart: "Amber, Patchouli",
      base: "Cedarwood, Vetiver",
    },
  },
];

const FeaturedProducts = () => {
  const { addItem, setIsCartOpen } = useCart();
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const toggleFavorite = (id: number) => {
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

  const handleAddToCart = (product: typeof products[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
    setIsCartOpen(true);
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Featured Collection</h2>
          <p className="text-muted-foreground text-lg">Our most loved fragrances</p>
        </div>

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
                  <p><span className="font-medium">Top:</span> {product.notes.top}</p>
                  <p><span className="font-medium">Heart:</span> {product.notes.heart}</p>
                  <p><span className="font-medium">Base:</span> {product.notes.base}</p>
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