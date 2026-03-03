import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DollarSign, BedDouble, CalendarCheck, TrendingUp, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { mockApi, type Room, type Booking } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

const statCards = [
  { label: "Total Bookings", value: "127", icon: CalendarCheck, change: "+12%" },
  { label: "Revenue", value: "$48,250", icon: DollarSign, change: "+8.3%" },
  { label: "Active Rooms", value: "5", icon: BedDouble, change: "0%" },
  { label: "Occupancy Rate", value: "84%", icon: TrendingUp, change: "+5%" },
];

const AdminDashboard = () => {
  const { toast } = useToast();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([mockApi.getRooms(), mockApi.getBookings()]).then(([r, b]) => {
      setRooms(r);
      setBookings(b);
      setLoading(false);
    });
  }, []);

  const handleDeleteRoom = (id: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== id));
    toast({ title: "Room Deleted", description: "Room has been removed." });
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="font-display text-4xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="font-body text-muted-foreground mt-2">Manage your hotel operations</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl shadow-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-body text-xs uppercase tracking-wider text-muted-foreground">{s.label}</span>
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <s.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="font-display text-3xl font-bold text-foreground">{s.value}</div>
              <span className="font-body text-xs text-emerald-600 mt-1">{s.change} this month</span>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="rooms" className="space-y-6">
          <TabsList className="font-body">
            <TabsTrigger value="rooms">Manage Rooms</TabsTrigger>
            <TabsTrigger value="bookings">All Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="rooms">
            {loading ? (
              <Skeleton className="h-64 w-full rounded-xl" />
            ) : (
              <div className="bg-card rounded-xl shadow-card overflow-hidden">
                <div className="p-6 flex items-center justify-between border-b border-border">
                  <h3 className="font-display text-lg font-semibold text-foreground">Rooms</h3>
                  <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 font-body">+ Add Room</Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-body">Name</TableHead>
                      <TableHead className="font-body">Type</TableHead>
                      <TableHead className="font-body">Price</TableHead>
                      <TableHead className="font-body">Status</TableHead>
                      <TableHead className="font-body text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rooms.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-body font-medium">{r.name}</TableCell>
                        <TableCell className="font-body capitalize">{r.type}</TableCell>
                        <TableCell className="font-body">${r.price}</TableCell>
                        <TableCell>
                          <Badge variant={r.available ? "default" : "secondary"} className="font-body text-xs">
                            {r.available ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm"><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDeleteRoom(r.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="bookings">
            {loading ? (
              <Skeleton className="h-64 w-full rounded-xl" />
            ) : (
              <div className="bg-card rounded-xl shadow-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-body">Booking ID</TableHead>
                      <TableHead className="font-body">Room</TableHead>
                      <TableHead className="font-body">Dates</TableHead>
                      <TableHead className="font-body">Guests</TableHead>
                      <TableHead className="font-body">Total</TableHead>
                      <TableHead className="font-body">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell className="font-body font-mono text-xs">{b.id}</TableCell>
                        <TableCell className="font-body">{b.roomName}</TableCell>
                        <TableCell className="font-body text-sm">{b.checkIn} → {b.checkOut}</TableCell>
                        <TableCell className="font-body">{b.guests}</TableCell>
                        <TableCell className="font-body font-semibold">${b.totalPrice}</TableCell>
                        <TableCell>
                          <Badge
                            className={`font-body text-xs capitalize border-0 ${
                              b.status === "confirmed" ? "bg-emerald-100 text-emerald-800" :
                              b.status === "pending" ? "bg-amber-100 text-amber-800" :
                              "bg-red-100 text-red-800"
                            }`}
                          >
                            {b.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
