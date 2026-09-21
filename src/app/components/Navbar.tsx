import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "./Button";
import { ThemeToggle } from "./ThemeToggle";
import { useProducts, useSolutions } from "../../lib/hooks";
// @ts-ignore
import logo from "../../../public/logo.png";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { data: products } = useProducts();
  const { data: solutions } = useSolutions();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveMobileDropdown(null);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    {
      name: "Services",
      path: "/products",
      dropdown: products && products.length > 0
        ? Array.from(new Set(products.map(p => p.category).filter(Boolean))).map(category => ({
          name: category,
          path: `/products?category=${encodeURIComponent(category)}`
        }))
        : [
          { name: "Restroom Cubicles", path: "/products?category=Restroom%20Cubicles" },
          { name: "Shower Cubicles", path: "/products?category=Shower%20Cubicles" },
          { name: "Exterior Cladding", path: "/products?category=Exterior%20Cladding" },
          { name: "Locker System", path: "/products?category=Locker%20System" },
          { name: "Custom Hardware", path: "/products?category=Custom%20Hardware" },
          { name: "Others", path: "/products?category=Others" }
        ],
    },
    {
      name: "Solutions",
      path: "/solutions",
      dropdown: solutions && solutions.length > 0
        ? Array.from(new Set(solutions.map(s => s.title).filter(Boolean))).map(title => ({
          name: title,
          path: `/solutions?industry=${encodeURIComponent(title)}`
        }))
        : [
          { name: "Corporates", path: "/solutions?industry=Corporates" },
          { name: "Malls", path: "/solutions?industry=Malls" },
          { name: "Airports", path: "/solutions?industry=Airports" },
          { name: "Metro and railways", path: "/solutions?industry=Metro%20and%20railways" },
          { name: "Hospitals", path: "/solutions?industry=Hospitals" },
          { name: "Schools & Colleges", path: "/solutions?industry=Schools%20%26%20Colleges" },
          { name: "Others", path: "/solutions?industry=Others" }
        ],
    },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
  ];

  const toggleMobileDropdown = (name: string) => {
    setActiveMobileDropdown((prev) => (prev === name ? null : name));
  };

  const isHome = location.pathname === "/";
  const isSolid = isScrolled || isMobileMenuOpen || !isHome;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isSolid
          ? "bg-white/95 dark:bg-[#030213]/95 backdrop-blur-lg shadow-lg border-b border-transparent dark:border-white/10"
          : "bg-transparent border-b border-transparent"
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 flex-shrink-0"
          >
            <img
              src={logo}
              alt="Pacific Products & Solutions"
              className="h-12 sm:h-16 w-auto object-contain rounded-full"
            />
            <span className="text-base sm:text-lg font-bold tracking-tight leading-tight text-[#7FB706]">
              Pacific Restroom<br className="hidden sm:block" /><span className="sm:hidden"> </span>Cubicle
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {menuItems.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.dropdown && setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={item.path}
                  className={`flex items-center space-x-1 py-2 text-sm xl:text-base transition-colors ${location.pathname === item.path ||
                      location.pathname.startsWith(item.path + "/")
                      ? "text-[#7FB706]"
                      : isSolid
                        ? "text-[#030213] dark:text-gray-300 hover:text-[#7FB706] dark:hover:text-[#7FB706]"
                        : "text-white hover:text-[#7FB706]"
                    }`}
                >
                  <span>{item.name}</span>
                  {item.dropdown && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === item.name ? "rotate-180" : ""
                        }`}
                    />
                  )}
                </Link>

                {/* Desktop Dropdown */}
                <AnimatePresence>
                  {item.dropdown && activeDropdown === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-60 bg-white dark:bg-[#0a0a1a] rounded-xl shadow-xl border border-gray-100 dark:border-white/10 py-2 z-50"
                    >
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.path}
                          className={`block px-4 py-2.5 text-sm transition-colors hover:bg-[#E9FDBF] dark:hover:bg-[#7FB706]/20 ${location.pathname === subItem.path
                              ? "text-[#7FB706] bg-[#E9FDBF] dark:bg-[#7FB706]/20"
                              : "text-[#030213] dark:text-gray-300"
                            }`}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* CTA Button & Theme Toggle – desktop */}
          <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
            <ThemeToggle />
            <Button onClick={() => navigate("/contact")}>
              Get Quote
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="w-6 h-6 text-[#030213] dark:text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className={`w-6 h-6 ${isSolid ? "text-[#030213] dark:text-white" : "text-white"}`} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden bg-white dark:bg-[#030213] border-t border-gray-200 dark:border-white/10 overflow-hidden"
          >
            <div
              className="overflow-y-auto"
              style={{ maxHeight: "calc(100vh - 4rem)" }}
            >
              <div className="py-3 px-4 space-y-1">
                {menuItems.map((item) => (
                  <div key={item.name}>
                    {item.dropdown ? (
                      <>
                        {/* Parent item with toggle */}
                        <button
                          onClick={() => toggleMobileDropdown(item.name)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors ${activeMobileDropdown === item.name
                              ? "bg-[#E9FDBF] text-[#7FB706] dark:bg-[#7FB706]/20"
                              : "hover:bg-gray-50 text-[#030213] dark:text-gray-300 dark:hover:bg-white/5"
                            }`}
                        >
                          <span>{item.name}</span>
                          <motion.div
                            animate={{
                              rotate: activeMobileDropdown === item.name ? 180 : 0,
                            }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="w-5 h-5" />
                          </motion.div>
                        </button>

                        {/* Accordion sub-items */}
                        <AnimatePresence>
                          {activeMobileDropdown === item.name && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="mt-1 ml-4 pl-4 border-l-2 border-[#7FB706]/30 space-y-1 pb-2">
                                {item.dropdown.map((subItem) => (
                                  <Link
                                    key={subItem.name}
                                    to={subItem.path}
                                    onClick={() => {
                                      setIsMobileMenuOpen(false);
                                      setActiveMobileDropdown(null);
                                    }}
                                    className={`block px-3 py-2.5 rounded-lg text-sm transition-colors ${location.pathname === subItem.path
                                        ? "text-[#7FB706] bg-[#E9FDBF] dark:bg-[#7FB706]/20 font-medium"
                                        : "text-gray-600 dark:text-gray-400 hover:bg-[#E9FDBF] dark:hover:bg-[#7FB706]/10 hover:text-[#7FB706]"
                                      }`}
                                  >
                                    {subItem.name}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${location.pathname === item.path
                            ? "bg-[#E9FDBF] text-[#7FB706] dark:bg-[#7FB706]/20"
                            : "hover:bg-gray-50 text-[#030213] dark:text-gray-300 dark:hover:bg-white/5"
                          }`}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}

                {/* Theme Toggle inside mobile menu */}
                <div className="pt-2 px-2 pb-2 flex justify-end">
                  <ThemeToggle />
                </div>

                {/* CTA inside mobile menu */}
                <div className="pt-3 pb-2">
                  <Button
                    className="w-full"
                    onClick={() => {
                      navigate("/contact"); // Updated to use navigate
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Get Quote
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}