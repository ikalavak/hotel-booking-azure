import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Users, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { mockApi, type Booking } from "@/lib/mockData";
import { useAuth } from "@/lib/authContext";
import { useToast } from "@/hooks/use-toast";

const statusColors: Record<string, string> = {
  confirmed: "bg-emerald-100 text-emerald-800",
  pending: "bg-amber-100 text-amber-800",
  cancelled: "bg-red-100 text-red-800",
};

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockApi.getBookings().then((data) => {
      setBookings(data);
      setLoading(false);
    });
  }, []);

  const handleCancel = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "cancelled" as const } : b))
    );
    toast({ title: "Booking Cancelled", description: "Your booking has been cancelled." });
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="font-display text-4xl font-bold text-foreground">My Bookings</h1>
          <p className="font-body text-muted-foreground mt-2">Welcome back, {user?.name || "Guest"}</p>
        </motion.div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-body text-muted-foreground">No bookings yet. Start exploring our rooms!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl shadow-card p-6 flex flex-col md:flex-row md:items-center gap-4"
              >
                <div className="flex-1">
                  <h3 className="font-display text-lg font-semibold text-foreground">{b.roomName}</h3>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm font-body text-muted-foreground">
                    <span className="flex items-center gap-1"><CalendarDays className="h-4 w-4" /> {b.checkIn} → {b.checkOut}</span>
                    <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {b.guests} guest{b.guests > 1 ? "s" : ""}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-display text-xl font-bold text-foreground">${b.totalPrice}</span>
                  <Badge className={`${statusColors[b.status]} font-body text-xs capitalize border-0`}>
                    {b.status}
                  </Badge>
                  {b.status !== "cancelled" && (
                    <Button variant="ghost" size="sm" onClick={() => handleCancel(b.id)} className="text-destructive hover:text-destructive font-body">
                      <XCircle className="h-4 w-4 mr-1" /> Cancel
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
