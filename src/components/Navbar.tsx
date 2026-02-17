import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoMark from "@/assets/logo-mark.png";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const firstName = profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    setMobileOpen(false);
  };

  const navLinks = [
    { label: "Shop", href: "#ritual" },
    { label: "Science", href: "#science" },
    { label: "Community", href: "#community" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled ? "glass shadow-lg shadow-background/50" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="group flex items-center gap-3">
            <img src={logoMark} alt="OmniaVital" className="w-9 h-9 rounded-lg object-cover" />
            <span className="text-lg font-bold tracking-[0.15em] uppercase text-foreground">
              OmniaVital
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

            {user ? (
              <div className="flex items-center gap-3 ml-2">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2.5 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all duration-200"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[10px] font-bold text-accent-foreground">
                    {firstName[0]?.toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold tracking-[0.15em] uppercase text-foreground">
                    Dashboard
                  </span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="ml-2 px-5 py-2 text-xs font-semibold tracking-[0.2em] uppercase text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-all duration-200"
              >
                Account
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-foreground p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/98 backdrop-blur-xl flex flex-col items-center justify-center"
          >
            <button
              className="absolute top-6 right-6 text-foreground p-2 rounded-lg hover:bg-secondary transition-colors"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
            <img src={logoMark} alt="OmniaVital" className="w-16 h-16 rounded-xl mb-10" />
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
              {user ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: navLinks.length * 0.08 }}
                  >
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="text-2xl font-light tracking-[0.3em] uppercase text-primary transition-colors duration-300"
                    >
                      Dashboard
                    </Link>
                  </motion.div>
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (navLinks.length + 1) * 0.08 }}
                    onClick={handleSignOut}
                    className="text-lg font-light tracking-[0.3em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
                  >
                    Sign Out
                  </motion.button>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navLinks.length * 0.08 }}
                >
                  <Link
                    to="/auth"
                    onClick={() => setMobileOpen(false)}
                    className="text-2xl font-light tracking-[0.3em] uppercase text-primary transition-colors duration-300"
                  >
                    Account
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
