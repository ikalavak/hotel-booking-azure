import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, CalendarDays, Users, Star, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RoomCard from "@/components/RoomCard";
import { rooms } from "@/lib/mockData";
import heroImg from "@/assets/hero-hotel.jpg";

const features = [
  { icon: Star, title: "5-Star Service", desc: "Award-winning hospitality and personalized attention." },
  { icon: Shield, title: "Best Price Guarantee", desc: "Book directly for the lowest available rates." },
  { icon: Clock, title: "24/7 Concierge", desc: "Our concierge team is always at your service." },
];

const Index = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const featured = rooms.filter((r) => r.available).slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Aurum Hotel" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />
        </div>
        <div className="relative container mx-auto px-4 py-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <p className="font-body text-sm uppercase tracking-[0.3em] text-gold-light mb-4">
              Luxury Redefined
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-card mb-6 leading-[1.1]">
              Experience <br />Timeless <span className="text-gold">Elegance</span>
            </h1>
            <p className="font-body text-lg text-card/80 mb-8 max-w-lg">
              Discover a world of refined luxury, where every detail is crafted to create unforgettable memories.
            </p>
            <div className="flex gap-3">
              <Link to="/rooms">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-body text-sm px-8">
                  Explore Rooms
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="font-body text-sm px-8 border-card/30 text-card hover:bg-card/10">
                Virtual Tour
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="relative -mt-12 z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-card rounded-xl shadow-luxury p-6 md:p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="font-body text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wider">Location</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Where to?"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10 font-body"
                  />
                </div>
              </div>
              <div>
                <label className="font-body text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wider">Check-in</label>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="date" className="pl-10 font-body" />
                </div>
              </div>
              <div>
                <label className="font-body text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wider">Check-out</label>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="date" className="pl-10 font-body" />
                </div>
              </div>
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-body w-full"
                onClick={() => navigate("/rooms")}
              >
                <Search className="h-4 w-4 mr-2" /> Search Rooms
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="text-center p-8"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 text-accent mb-5">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">{f.title}</h3>
                <p className="font-body text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-24 bg-secondary/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="font-body text-sm uppercase tracking-[0.2em] text-accent mb-3">Accommodations</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">Featured Rooms</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featured.map((room, i) => (
              <RoomCard key={room.id} room={room} index={i} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/rooms">
              <Button variant="outline" size="lg" className="font-body">
                View All Rooms
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 gradient-hero text-center">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Ready for an Unforgettable Stay?
            </h2>
            <p className="font-body text-lg text-primary-foreground/70 mb-8 max-w-xl mx-auto">
              Book your luxury escape today and let us create memories that last a lifetime.
            </p>
            <Link to="/rooms">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-body px-10">
                Book Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
