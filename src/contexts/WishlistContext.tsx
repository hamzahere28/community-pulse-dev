import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface WishlistItem {
  id: string;
  product_id: string;
  created_at: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  top_notes: string;
  heart_notes: string;
  base_notes: string;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  wishlistProducts: Product[];
  loading: boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchWishlist = async () => {
    if (!user) {
      setWishlistItems([]);
      setWishlistProducts([]);
      return;
    }

    setLoading(true);
    const { data: items, error } = await supabase
      .from("wishlist")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching wishlist:", error);
      setLoading(false);
      return;
    }

    setWishlistItems(items || []);

    if (items && items.length > 0) {
      const productIds = items.map((item) => item.product_id);
      const { data: products } = await supabase
        .from("products")
        .select("*")
        .in("id", productIds);

      setWishlistProducts(products || []);
    } else {
      setWishlistProducts([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const addToWishlist = async (productId: string) => {
    if (!user) {
      toast.error("Please sign in to add items to your wishlist");
      return;
    }

    const { error } = await supabase
      .from("wishlist")
      .insert({ user_id: user.id, product_id: productId });

    if (error) {
      if (error.code === "23505") {
        toast.info("This item is already in your wishlist");
      } else {
        toast.error("Failed to add to wishlist");
      }
      return;
    }

    toast.success("Added to wishlist!");
    fetchWishlist();
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId);

    if (error) {
      toast.error("Failed to remove from wishlist");
      return;
    }

    toast.success("Removed from wishlist");
    fetchWishlist();
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some((item) => item.product_id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistProducts,
        loading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
