import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ShoppingCart, Heart, Search, SlidersHorizontal, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const Products = () => {
  const { addItem, setIsCartOpen } = useCart();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [selectedNote, setSelectedNote] = useState<string>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = ["all", "Men", "Women", "Unisex", "Floral", "Oriental", "Woody", "Fresh"];
  
  const fragranceNotes = useMemo(() => {
    const notes = new Set<string>();
    products.forEach(p => {
      p.top_notes.split(", ").forEach(n => notes.add(n.trim()));
      p.heart_notes.split(", ").forEach(n => notes.add(n.trim()));
      p.base_notes.split(", ").forEach(n => notes.add(n.trim()));
    });
    return ["all", ...Array.from(notes).sort()];
  }, [products]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
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
  }, [toast]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search filter
      const matchesSearch = searchQuery === "" || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.top_notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.heart_notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.base_notes.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory = selectedCategory === "all" || 
        product.category.toLowerCase() === selectedCategory.toLowerCase();

      // Price filter
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

      // Note filter
      const matchesNote = selectedNote === "all" ||
        product.top_notes.toLowerCase().includes(selectedNote.toLowerCase()) ||
        product.heart_notes.toLowerCase().includes(selectedNote.toLowerCase()) ||
        product.base_notes.toLowerCase().includes(selectedNote.toLowerCase());

      return matchesSearch && matchesCategory && matchesPrice && matchesNote;
    });
  }, [products, searchQuery, selectedCategory, priceRange, selectedNote]);

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

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setPriceRange([0, 50000]);
    setSelectedNote("all");
  };

  const hasActiveFilters = searchQuery !== "" || selectedCategory !== "all" || 
    priceRange[0] !== 0 || priceRange[1] !== 50000 || selectedNote !== "all";

  return (
    <div className="min-h-screen">
      <Navbar />
      <CartDrawer />
      
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">All Products</h1>
            <p className="text-muted-foreground text-lg">Discover our complete collection of luxury fragrances</p>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search fragrances by name or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {hasActiveFilters && (
                      <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                        !
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filter Products</SheetTitle>
                    <SheetDescription>
                      Refine your search with these filters
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="space-y-6 mt-6">
                    {/* Price Range */}
                    <div className="space-y-4">
                      <Label>Price Range (PKR)</Label>
                      <Slider
                        value={priceRange}
                        onValueChange={(value) => setPriceRange(value as [number, number])}
                        max={50000}
                        min={0}
                        step={500}
                        className="mt-2"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>PKR {priceRange[0].toLocaleString()}</span>
                        <span>PKR {priceRange[1].toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Fragrance Notes */}
                    <div className="space-y-2">
                      <Label>Fragrance Notes</Label>
                      <Select value={selectedNote} onValueChange={setSelectedNote}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a note" />
                        </SelectTrigger>
                        <SelectContent>
                          {fragranceNotes.map((note) => (
                            <SelectItem key={note} value={note}>
                              {note === "all" ? "All Notes" : note}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Clear Filters */}
                    {hasActiveFilters && (
                      <Button variant="outline" onClick={clearFilters} className="w-full gap-2">
                        <X className="h-4 w-4" />
                        Clear All Filters
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              {hasActiveFilters && (
                <Button variant="ghost" size="icon" onClick={clearFilters}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6 text-sm text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No products match your filters</p>
              <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
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

export default Products;
