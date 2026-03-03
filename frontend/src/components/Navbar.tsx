import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/authContext";
import { Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/rooms", label: "Rooms" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="font-display text-2xl font-bold text-foreground tracking-tight">
          Aurum<span className="text-gold">.</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`font-body text-sm font-medium transition-colors hover:text-accent ${
                isActive(l.to) ? "text-accent" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
          {user && (
            <>
              <Link
                to="/dashboard"
                className={`font-body text-sm font-medium transition-colors hover:text-accent ${
                  isActive("/dashboard") ? "text-accent" : "text-muted-foreground"
                }`}
              >
                My Bookings
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`font-body text-sm font-medium transition-colors hover:text-accent ${
                    isActive("/admin") ? "text-accent" : "text-muted-foreground"
                  }`}
                >
                  Admin
                </Link>
              )}
            </>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-body text-muted-foreground">
                <User className="inline h-4 w-4 mr-1" />
                {user.name}
              </span>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="font-body">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="font-body bg-accent text-accent-foreground hover:bg-accent/90">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card border-b border-border overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className="font-body text-sm py-2 text-foreground hover:text-accent transition-colors"
                >
                  {l.label}
                </Link>
              ))}
              {user && (
                <>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="font-body text-sm py-2 text-foreground hover:text-accent transition-colors">
                    My Bookings
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setMobileOpen(false)} className="font-body text-sm py-2 text-foreground hover:text-accent transition-colors">
                      Admin
                    </Link>
                  )}
                </>
              )}
              <div className="border-t border-border pt-3 mt-2 flex flex-col gap-2">
                {user ? (
                  <Button variant="ghost" size="sm" onClick={() => { logout(); setMobileOpen(false); }}>
                    <LogOut className="h-4 w-4 mr-2" /> Sign Out
                  </Button>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full font-body">Sign In</Button>
                    </Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)}>
                      <Button size="sm" className="w-full font-body bg-accent text-accent-foreground hover:bg-accent/90">Register</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
