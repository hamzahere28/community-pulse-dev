import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, User, Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const collections = [
    { name: "Floral Collection", href: "/category/floral", description: "Delicate and romantic scents" },
    { name: "Oriental Collection", href: "/category/oriental", description: "Rich and exotic aromas" },
    { name: "Woody Collection", href: "/category/woody", description: "Warm and earthy notes" },
    { name: "Fresh Collection", href: "/category/fresh", description: "Light and invigorating" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Essence
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Collections</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-4">
                      {collections.map((collection) => (
                        <Link
                          key={collection.name}
                          to={collection.href}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">{collection.name}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {collection.description}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            <Link to="/products" className="text-sm font-medium hover:text-primary transition-colors">
              All Products
            </Link>
            <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">
              Our Story
            </Link>
            <Link to="/blog" className="text-sm font-medium hover:text-primary transition-colors">
              Fragrance Tips
            </Link>
            <Link to="/contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </Link>
          </div>

          {/* Search and Icons */}
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search fragrances..."
                  className="pl-8 w-[200px]"
                />
              </div>
            </div>
            
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Heart className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <User className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t">
            <div className="relative mb-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search fragrances..." className="pl-8" />
            </div>
            
            <div className="space-y-2">
              <Link to="/products" className="block py-2 text-sm font-medium hover:text-primary">
                All Products
              </Link>
              <div className="py-2">
                <p className="text-sm font-medium mb-2">Collections</p>
                <div className="pl-4 space-y-2">
                  {collections.map((collection) => (
                    <Link
                      key={collection.name}
                      to={collection.href}
                      className="block py-1 text-sm text-muted-foreground hover:text-primary"
                    >
                      {collection.name}
                    </Link>
                  ))}
                </div>
              </div>
              <Link to="/about" className="block py-2 text-sm font-medium hover:text-primary">
                Our Story
              </Link>
              <Link to="/blog" className="block py-2 text-sm font-medium hover:text-primary">
                Fragrance Tips
              </Link>
              <Link to="/contact" className="block py-2 text-sm font-medium hover:text-primary">
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;