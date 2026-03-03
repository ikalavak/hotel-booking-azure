import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import RoomCard from "@/components/RoomCard";
import { mockApi, type Room } from "@/lib/mockData";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const roomTypes = ["all", "standard", "deluxe", "suite", "penthouse"];

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 1000]);

  useEffect(() => {
    mockApi.getRooms().then((data) => {
      setRooms(data);
      setLoading(false);
    });
  }, []);

  const filtered = rooms.filter((r) => {
    if (typeFilter !== "all" && r.type !== typeFilter) return false;
    if (r.price < priceRange[0] || r.price > priceRange[1]) return false;
    return true;
  });

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <p className="font-body text-sm uppercase tracking-[0.2em] text-accent mb-3">Accommodations</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">Our Rooms & Suites</h1>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl shadow-card p-6 mb-10 flex flex-col md:flex-row gap-6 items-start md:items-end"
        >
          <div className="w-full md:w-48">
            <label className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Room Type</label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="font-body">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roomTypes.map((t) => (
                  <SelectItem key={t} value={t} className="font-body capitalize">{t === "all" ? "All Types" : t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-72">
            <label className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
              Price Range: ${priceRange[0]} – ${priceRange[1]}
            </label>
            <Slider
              min={0}
              max={1000}
              step={50}
              value={priceRange}
              onValueChange={setPriceRange}
              className="mt-3"
            />
          </div>
          <p className="font-body text-sm text-muted-foreground md:ml-auto">
            {filtered.length} room{filtered.length !== 1 ? "s" : ""} found
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg overflow-hidden">
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-body text-muted-foreground">No rooms match your filters. Try adjusting your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((room, i) => (
              <RoomCard key={room.id} room={room} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rooms;
