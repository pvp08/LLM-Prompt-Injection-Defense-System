import { useState } from "react";
import { Shield, Lock, UserPlus, LogIn, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authApi } from "@/lib/api";
import { toast } from "sonner";

export default function LoginPage({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      return toast.error("Fill in all fields");
    }
    setLoading(true);
    try {
      const res = await authApi.login(loginForm);
      onLogin(res.data.user, res.data.token);
      toast.success("Access granted");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!registerForm.username || !registerForm.email || !registerForm.password) {
      return toast.error("Fill in all fields");
    }
    setLoading(true);
    try {
      const res = await authApi.register(registerForm);
      onLogin(res.data.user, res.data.token);
      toast.success("Account created");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden"
      data-testid="login-page"
    >
      {/* Background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1669054626218-f0b57b8ec632?crop=entropy&cs=srgb&fm=jpg&q=85)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.3)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-sm bg-[#0A0A0A] border border-[#00FF99]/30 mb-4 glow-green">
            <Shield className="w-8 h-8 text-[#00FF99]" />
          </div>
          <h1
            className="text-2xl sm:text-3xl font-mono font-bold text-[#E0E0E0] tracking-tight"
            data-testid="login-title"
          >
            PROMPT DEFENSE
          </h1>
          <p className="text-sm text-[#888] mt-2 font-mono tracking-wider uppercase">
            Injection Detection System
          </p>
        </div>

        <div className="bg-[#0A0A0A] border border-[#333] rounded-sm p-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#050505] border border-[#333] rounded-sm mb-6">
              <TabsTrigger
                value="login"
                className="font-mono text-xs uppercase tracking-wider rounded-sm data-[state=active]:bg-[#121212] data-[state=active]:text-[#00FF99]"
                data-testid="login-tab"
              >
                <LogIn className="w-3.5 h-3.5 mr-2" />
                Login
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="font-mono text-xs uppercase tracking-wider rounded-sm data-[state=active]:bg-[#121212] data-[state=active]:text-[#00FF99]"
                data-testid="register-tab"
              >
                <UserPlus className="w-3.5 h-3.5 mr-2" />
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-mono uppercase tracking-widest text-[#888]">
                    Email
                  </Label>
                  <Input
                    type="email"
                    placeholder="agent@defense.sys"
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, email: e.target.value })
                    }
                    className="bg-[#050505] border-[#333] focus:border-[#00FF99] font-mono text-sm rounded-sm h-10 text-[#E0E0E0] placeholder:text-[#555]"
                    data-testid="login-email-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-mono uppercase tracking-widest text-[#888]">
                    Password
                  </Label>
                  <Input
                    type="password"
                    placeholder="********"
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, password: e.target.value })
                    }
                    className="bg-[#050505] border-[#333] focus:border-[#00FF99] font-mono text-sm rounded-sm h-10 text-[#E0E0E0] placeholder:text-[#555]"
                    data-testid="login-password-input"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-sm bg-[#00FF99] text-black font-mono uppercase tracking-wider text-xs h-10 hover:bg-[#00FF99]/90 transition-all duration-200"
                  data-testid="login-submit-btn"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 mr-2" />
                      Authenticate
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-mono uppercase tracking-widest text-[#888]">
                    Username
                  </Label>
                  <Input
                    type="text"
                    placeholder="agent_007"
                    value={registerForm.username}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        username: e.target.value,
                      })
                    }
                    className="bg-[#050505] border-[#333] focus:border-[#00FF99] font-mono text-sm rounded-sm h-10 text-[#E0E0E0] placeholder:text-[#555]"
                    data-testid="register-username-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-mono uppercase tracking-widest text-[#888]">
                    Email
                  </Label>
                  <Input
                    type="email"
                    placeholder="agent@defense.sys"
                    value={registerForm.email}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        email: e.target.value,
                      })
                    }
                    className="bg-[#050505] border-[#333] focus:border-[#00FF99] font-mono text-sm rounded-sm h-10 text-[#E0E0E0] placeholder:text-[#555]"
                    data-testid="register-email-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-mono uppercase tracking-widest text-[#888]">
                    Password
                  </Label>
                  <Input
                    type="password"
                    placeholder="********"
                    value={registerForm.password}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        password: e.target.value,
                      })
                    }
                    className="bg-[#050505] border-[#333] focus:border-[#00FF99] font-mono text-sm rounded-sm h-10 text-[#E0E0E0] placeholder:text-[#555]"
                    data-testid="register-password-input"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-sm bg-[#00FF99] text-black font-mono uppercase tracking-wider text-xs h-10 hover:bg-[#00FF99]/90 transition-all duration-200"
                  data-testid="register-submit-btn"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5 mr-2" />
                      Create Account
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        <p className="text-center text-xs text-[#555] font-mono mt-6 tracking-wider">
          DEFENSE SYSTEM v1.0 // ALL LAYERS ACTIVE
        </p>
      </div>
    </div>
  );
}
