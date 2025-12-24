import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, User, Menu, X, Search, Package, LogOut, Loader2, Settings, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { supabase } from "@/integrations/supabase/client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const { user, profile, signOut, loading } = useAuth();
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!data);
    };
    checkAdmin();
  }, [user]);

  const collections = [
    { name: "Floral Collection", href: "/category/floral", description: "Delicate and romantic scents" },
    { name: "Oriental Collection", href: "/category/oriental", description: "Rich and exotic aromas" },
    { name: "Woody Collection", href: "/category/woody", description: "Warm and earthy notes" },
    { name: "Fresh Collection", href: "/category/fresh", description: "Light and invigorating" },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

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
                    <div className="grid w-[400px] gap-3 p-4 bg-popover">
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
                  onFocus={() => navigate('/products')}
                />
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden md:flex relative"
              onClick={() => user ? navigate('/wishlist') : navigate('/auth')}
            >
              <Heart className="h-5 w-5" />
              {wishlistItems.length > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {wishlistItems.length}
                </Badge>
              )}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-popover">
                {user ? (
                  <>
                    <div className="px-2 py-2 text-sm">
                      <p className="font-medium">{profile?.full_name || 'Welcome!'}</p>
                      <p className="text-muted-foreground text-xs truncate">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/wishlist')} className="cursor-pointer gap-2">
                      <Heart className="h-4 w-4" />
                      My Wishlist
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/orders')} className="cursor-pointer gap-2">
                      <Package className="h-4 w-4" />
                      My Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer gap-2">
                      <Settings className="h-4 w-4" />
                      Account Settings
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer gap-2 text-primary">
                        <Shield className="h-4 w-4" />
                        Admin Dashboard
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer gap-2 text-destructive">
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => navigate('/auth')} className="cursor-pointer">
                      Sign In
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/auth')} className="cursor-pointer">
                      Create Account
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/contact')} className="cursor-pointer">
                      Help & Support
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {totalItems}
                </Badge>
              )}
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
              <Input 
                placeholder="Search fragrances..." 
                className="pl-8" 
                onFocus={() => {
                  setMobileMenuOpen(false);
                  navigate('/products');
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Link to="/products" className="block py-2 text-sm font-medium hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
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
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {collection.name}
                    </Link>
                  ))}
                </div>
              </div>
              <Link to="/about" className="block py-2 text-sm font-medium hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                Our Story
              </Link>
              <Link to="/blog" className="block py-2 text-sm font-medium hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                Fragrance Tips
              </Link>
              <Link to="/contact" className="block py-2 text-sm font-medium hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </Link>
              
              <div className="border-t pt-4 mt-4 space-y-2">
                {user ? (
                  <>
                    <div className="px-2 py-2">
                      <p className="font-medium text-sm">{profile?.full_name || 'Welcome!'}</p>
                      <p className="text-muted-foreground text-xs">{user.email}</p>
                    </div>
                    <Button variant="outline" className="w-full gap-2" onClick={() => { navigate('/wishlist'); setMobileMenuOpen(false); }}>
                      <Heart className="h-4 w-4" />
                      Wishlist ({wishlistItems.length})
                    </Button>
                    <Button variant="outline" className="w-full gap-2" onClick={() => { navigate('/orders'); setMobileMenuOpen(false); }}>
                      <Package className="h-4 w-4" />
                      My Orders
                    </Button>
                    <Button variant="outline" className="w-full gap-2" onClick={() => { navigate('/profile'); setMobileMenuOpen(false); }}>
                      <Settings className="h-4 w-4" />
                      Account Settings
                    </Button>
                    {isAdmin && (
                      <Button variant="outline" className="w-full gap-2 text-primary" onClick={() => { navigate('/admin'); setMobileMenuOpen(false); }}>
                        <Shield className="h-4 w-4" />
                        Admin Dashboard
                      </Button>
                    )}
                    <Button variant="outline" className="w-full gap-2 text-destructive" onClick={handleSignOut}>
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="w-full gap-2" onClick={() => { navigate('/wishlist'); setMobileMenuOpen(false); }}>
                      <Heart className="h-4 w-4" />
                      Wishlist
                    </Button>
                    <Button className="w-full gap-2" onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}>
                      <User className="h-4 w-4" />
                      Sign In / Register
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
