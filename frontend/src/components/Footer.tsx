import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground py-16">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h3 className="font-display text-2xl font-bold mb-4">
            Aurum<span className="text-gold">.</span>
          </h3>
          <p className="font-body text-sm text-primary-foreground/70 leading-relaxed">
            Where timeless elegance meets modern luxury. Experience the extraordinary.
          </p>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider mb-4">Explore</h4>
          <div className="flex flex-col gap-2">
            <Link to="/rooms" className="font-body text-sm text-primary-foreground/70 hover:text-gold transition-colors">Our Rooms</Link>
            <Link to="/" className="font-body text-sm text-primary-foreground/70 hover:text-gold transition-colors">Dining</Link>
            <Link to="/" className="font-body text-sm text-primary-foreground/70 hover:text-gold transition-colors">Spa & Wellness</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider mb-4">Contact</h4>
          <div className="flex flex-col gap-2 font-body text-sm text-primary-foreground/70">
            <span>+1 (555) 123-4567</span>
            <span>reservations@aurum.com</span>
            <span>123 Luxury Lane, Beverly Hills</span>
          </div>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider mb-4">Follow Us</h4>
          <div className="flex gap-4 font-body text-sm text-primary-foreground/70">
            <span className="hover:text-gold cursor-pointer transition-colors">Instagram</span>
            <span className="hover:text-gold cursor-pointer transition-colors">Facebook</span>
            <span className="hover:text-gold cursor-pointer transition-colors">Twitter</span>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center">
        <p className="font-body text-xs text-primary-foreground/50">© 2026 Aurum Hotels. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
