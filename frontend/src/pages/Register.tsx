import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/authContext";
import { registerUser } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Invalid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Min 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await registerUser(name, email, password);

      login({
        id: data.user.id,
        name: data.user.full_name,
        email: data.user.email,
        role: "guest"
      });

      toast({
        title: "Account created! 🎉",
        description: "Welcome to Aurum Hotels."
      });

      navigate("/dashboard");
    } catch (err: any) {
      toast({
        title: err.message || "Registration failed",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md mx-4">
        <div className="bg-card rounded-xl shadow-luxury p-8">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold">Create Account</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" />
              {errors.name && <p className="text-destructive text-xs">{errors.name}</p>}
            </div>

            <div>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
              {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}
            </div>

            <div className="relative">
              <Input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="pr-10"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              {errors.password && <p className="text-destructive text-xs">{errors.password}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center mt-6 text-sm">
            Already have an account? <Link to="/login" className="text-accent">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;