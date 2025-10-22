import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";

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
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Featured Collection</h2>
          <p className="text-muted-foreground text-lg">Our most loved fragrances</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
              <Link to={`/product/${product.id}`}>
                <div className="relative overflow-hidden aspect-square">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4">{product.category}</Badge>
                </div>
              </Link>
              
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
                <Button size="sm" className="gap-2">
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