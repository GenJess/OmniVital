import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import logoMark from "@/assets/logo-mark.png";
import { Menu, X, User, LogIn } from "lucide-react";

const Navbar = () => {
  const { session, user, profile } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Products", href: "/#ritual", isRoute: false },
    { label: "Experience", href: "/#experience", isRoute: false },
    { label: "Science", href: "/#science", isRoute: false },
  ];

  const firstName = profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={logoMark}
              alt="OmniVital"
              className="w-9 h-9 rounded-xl group-hover:scale-105 transition-transform duration-300"
            />
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-foreground hidden sm:block">
              OmniVital
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative px-5 py-2 text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-primary group-hover:w-3/4 transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <Link
                to="/collective"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold tracking-[0.15em] uppercase transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, hsl(168,76%,42%), hsl(168,76%,36%))",
                  color: "white",
                  boxShadow: "0 4px 16px -4px hsla(168,76%,42%,0.35)",
                }}
              >
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[9px] font-black">
                  {firstName[0]?.toUpperCase()}
                </div>
                The Collective
              </Link>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-semibold tracking-[0.15em] uppercase transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, hsl(168,76%,42%), hsl(168,76%,36%))",
                  color: "white",
                  boxShadow: "0 4px 16px -4px hsla(168,76%,42%,0.35)",
                }}
              >
                <LogIn size={14} />
                Sign In / Join
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-foreground"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-background flex flex-col items-center justify-center"
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-5 right-6 text-foreground"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="text-2xl font-light tracking-[0.3em] uppercase text-foreground hover:text-primary transition-colors duration-300"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4"
              >
                {session ? (
                  <Link
                    to="/collective"
                    className="flex items-center gap-2 px-8 py-3 rounded-lg text-sm font-semibold tracking-[0.15em] uppercase"
                    style={{
                      background: "linear-gradient(135deg, hsl(168,76%,42%), hsl(168,76%,36%))",
                      color: "white",
                      boxShadow: "0 4px 20px -4px hsla(168,76%,42%,0.4)",
                    }}
                    onClick={() => setMobileOpen(false)}
                  >
                    Enter The Collective
                  </Link>
                ) : (
                  <Link
                    to="/auth"
                    className="flex items-center gap-2 px-8 py-3 rounded-lg text-sm font-semibold tracking-[0.15em] uppercase"
                    style={{
                      background: "linear-gradient(135deg, hsl(168,76%,42%), hsl(168,76%,36%))",
                      color: "white",
                      boxShadow: "0 4px 20px -4px hsla(168,76%,42%,0.4)",
                    }}
                    onClick={() => setMobileOpen(false)}
                  >
                    <LogIn size={16} />
                    Sign In / Join
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
