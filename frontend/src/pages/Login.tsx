import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/authContext";
import { loginUser } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
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
    if (!email.trim()) e.email = "Email required";
    if (!password) e.password = "Password required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await loginUser(email, password);

      localStorage.setItem("token", data.token);

      login({
        id: data.user.id,
        name: data.user.full_name,
        email: data.user.email,
        role: "guest"
      });

      toast({ title: "Login successful 🎉" });

      navigate("/dashboard");
    } catch (err: any) {
      toast({
        title: err.message || "Login failed",
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
            <h1 className="font-display text-3xl font-bold">Login</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
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
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center mt-6 text-sm">
            Don’t have an account? <Link to="/register" className="text-accent">Register</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;