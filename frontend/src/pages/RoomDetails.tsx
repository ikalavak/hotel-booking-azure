import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Maximize, Check, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { mockApi, type Room } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState("1");

  useEffect(() => {
    mockApi.getRoom(id!).then((data) => {
      setRoom(data || null);
      setLoading(false);
    });
  }, [id]);

  const handleBook = () => {
    if (!checkIn || !checkOut) {
      toast({ title: "Please select dates", description: "Check-in and check-out dates are required.", variant: "destructive" });
      return;
    }
    toast({ title: "Booking Confirmed! 🎉", description: `Your stay at ${room?.name} has been booked.` });
  };

  if (loading) {
    return (
      <div className="pt-24 pb-16 container mx-auto px-4">
        <Skeleton className="h-96 w-full rounded-xl mb-8" />
        <Skeleton className="h-10 w-1/2 mb-4" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="pt-24 pb-16 container mx-auto px-4 text-center">
        <h1 className="font-display text-3xl text-foreground mb-4">Room Not Found</h1>
        <Button onClick={() => navigate("/rooms")} className="font-body">Browse Rooms</Button>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Image Gallery */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-10">
          <div className="rounded-xl overflow-hidden mb-4 aspect-[16/7]">
            <img src={room.images[selectedImage]} alt={room.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {room.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={cn(
                  "rounded-lg overflow-hidden w-24 h-16 flex-shrink-0 border-2 transition-all",
                  selectedImage === i ? "border-accent" : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <span className="font-body text-xs uppercase tracking-wider text-accent font-semibold">{room.type}</span>
            <h1 className="font-display text-4xl font-bold text-foreground mt-2 mb-4">{room.name}</h1>
            <div className="flex items-center gap-6 text-muted-foreground text-sm font-body mb-6">
              <span className="flex items-center gap-1"><Users className="h-4 w-4" /> Up to {room.maxGuests} guests</span>
              <span className="flex items-center gap-1"><Maximize className="h-4 w-4" /> {room.size}m²</span>
            </div>
            <p className="font-body text-muted-foreground leading-relaxed mb-8">{room.description}</p>

            <h3 className="font-display text-xl font-semibold text-foreground mb-4">Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
              {room.amenities.map((a) => (
                <div key={a} className="flex items-center gap-2 font-body text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-accent flex-shrink-0" />
                  {a}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-card rounded-xl shadow-luxury p-6 sticky top-24">
              <div className="mb-6">
                <span className="font-display text-3xl font-bold text-foreground">${room.price}</span>
                <span className="font-body text-sm text-muted-foreground ml-1">/ night</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Check-in</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start font-body", !checkIn && "text-muted-foreground")}>
                        <CalendarDays className="mr-2 h-4 w-4" />
                        {checkIn ? format(checkIn, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} initialFocus className="p-3 pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Check-out</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start font-body", !checkOut && "text-muted-foreground")}>
                        <CalendarDays className="mr-2 h-4 w-4" />
                        {checkOut ? format(checkOut, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} initialFocus className="p-3 pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Guests</label>
                  <Input type="number" min="1" max={room.maxGuests} value={guests} onChange={(e) => setGuests(e.target.value)} className="font-body" />
                </div>
              </div>

              <Button
                size="lg"
                className="w-full mt-6 bg-accent text-accent-foreground hover:bg-accent/90 font-body"
                onClick={handleBook}
                disabled={!room.available}
              >
                {room.available ? "Book Now" : "Not Available"}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
