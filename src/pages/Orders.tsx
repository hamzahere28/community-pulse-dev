import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Loader2, Clock, CheckCircle, Truck, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Order {
  id: string;
  status: string;
  total_amount: number;
  shipping_address: string;
  phone: string;
  created_at: string;
}

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
}

const statusConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  pending: { icon: Clock, color: "bg-yellow-500/10 text-yellow-600", label: "Pending" },
  confirmed: { icon: CheckCircle, color: "bg-blue-500/10 text-blue-600", label: "Confirmed" },
  shipped: { icon: Truck, color: "bg-purple-500/10 text-purple-600", label: "Shipped" },
  delivered: { icon: CheckCircle, color: "bg-green-500/10 text-green-600", label: "Delivered" },
  cancelled: { icon: XCircle, color: "bg-red-500/10 text-red-600", label: "Cancelled" },
};

const Orders = () => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (ordersError) {
        console.error("Error fetching orders:", ordersError);
        setLoading(false);
        return;
      }

      setOrders(ordersData || []);

      // Fetch order items for each order
      const itemsMap: Record<string, OrderItem[]> = {};
      for (const order of ordersData || []) {
        const { data: items } = await supabase
          .from("order_items")
          .select("*")
          .eq("order_id", order.id);
        
        itemsMap[order.id] = items || [];
      }
      setOrderItems(itemsMap);
      setLoading(false);
    };

    fetchOrders();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Package className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground">
              Your order history will appear here after your first purchase
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = status.icon;
              
              return (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="bg-secondary/30">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Order placed on {format(new Date(order.created_at), "PPP")}
                        </p>
                        <CardTitle className="text-lg mt-1">
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </CardTitle>
                      </div>
                      <Badge variant="secondary" className={`${status.color} gap-1.5`}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {status.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {orderItems[order.id]?.map((item) => (
                        <div key={item.id} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{item.product_name}</p>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-medium">PKR {(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                      
                      <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between items-center font-bold text-lg">
                          <span>Total</span>
                          <span className="text-primary">PKR {order.total_amount.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        <p><strong>Shipping to:</strong> {order.shipping_address}</p>
                        <p><strong>Phone:</strong> {order.phone}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
