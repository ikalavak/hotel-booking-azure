import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Room } from "@/lib/mockData";

interface RoomCardProps {
  room: Room;
  index?: number;
}

const typeLabel: Record<string, string> = {
  standard: "Standard",
  deluxe: "Deluxe",
  suite: "Suite",
  penthouse: "Penthouse",
};

const RoomCard = ({ room, index = 0 }: RoomCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="group bg-card rounded-lg overflow-hidden shadow-card hover:shadow-luxury transition-shadow duration-500"
  >
    <div className="relative overflow-hidden aspect-[4/3]">
      <img
        src={room.images[0]}
        alt={room.name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute top-4 left-4">
        <span className="bg-accent text-accent-foreground text-xs font-body font-semibold uppercase tracking-wider px-3 py-1 rounded-full">
          {typeLabel[room.type]}
        </span>
      </div>
      {!room.available && (
        <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center">
          <span className="bg-card text-foreground font-body font-semibold px-4 py-2 rounded-lg">Sold Out</span>
        </div>
      )}
    </div>
    <div className="p-6">
      <h3 className="font-display text-xl font-semibold text-foreground mb-2">{room.name}</h3>
      <p className="font-body text-sm text-muted-foreground mb-4 line-clamp-2">{room.shortDescription}</p>
      <div className="flex items-center gap-4 text-muted-foreground text-xs font-body mb-4">
        <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {room.maxGuests} Guests</span>
        <span className="flex items-center gap-1"><Maximize className="h-3.5 w-3.5" /> {room.size}m²</span>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <span className="font-display text-2xl font-bold text-foreground">${room.price}</span>
          <span className="font-body text-xs text-muted-foreground ml-1">/ night</span>
        </div>
        <Link to={`/rooms/${room.id}`}>
          <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 font-body">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  </motion.div>
);

export default RoomCard;
