import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "./Button";
import { ThemeToggle } from "./ThemeToggle";
import { useProducts } from "../../lib/hooks";
import type { Product } from "../../lib/database.types";
// @ts-ignore
import logo from "../../../public/logo.png";

function toCategorySlug(category: string | undefined) {
  if (!category) return "";
  const cat = category.toLowerCase().trim();
  if (cat.includes("cubicle") && !cat.includes("kid")) return "restroom-cubicles";
  if (cat.includes("locker")) return "lockers";
  if (cat.includes("urinal") || cat.includes("partition")) return "urinal-partitions";
  if (cat.includes("kid")) return "kids-toilet";
  return cat.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

interface DropdownModelItem {
  name: string;
  subtitle?: string;
  path: string;
}

interface NavItem {
  name: string;
  path?: string;
  categorySlug?: string;
  viewAllPath?: string;
  dropdown?: DropdownModelItem[];
  dropdownColumns?: 1 | 2;
  align?: "left" | "center" | "right";
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState<string | null>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { data: allProducts } = useProducts();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close desktop and mobile menus on route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveMobileDropdown(null);
    setActiveDropdown(null);
  }, [location.pathname, location.search]);

  // Click outside listener to close open desktop dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        navContainerRef.current &&
        !navContainerRef.current.contains(e.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  // Only show listed model data from database, strictly removing all dummy/demo products
  const listedProducts = (allProducts || []).filter(
    (p) =>
      p.published !== false &&
      !p.id?.startsWith("prod-") &&
      !p.id?.startsWith("demo-")
  );

  // Categorize real listed products for dropdowns
  const cubicleProducts = listedProducts.filter(
    (p) =>
      (p.category || "").toLowerCase().includes("cubicle") &&
      !(p.category || "").toLowerCase().includes("kid")
  );
  const lockerProducts = listedProducts.filter((p) =>
    (p.category || "").toLowerCase().includes("locker")
  );
  const urinalProducts = listedProducts.filter(
    (p) =>
      (p.category || "").toLowerCase().includes("urinal") ||
      (p.category || "").toLowerCase().includes("partition")
  );
  const kidsProducts = listedProducts.filter((p) =>
    (p.category || "").toLowerCase().includes("kid")
  );

  const getProductPath = (p: Product) => {
    const catSlug = toCategorySlug(p.category);
    return catSlug ? `/products/${catSlug}/${p.slug}` : `/products/${p.slug}`;
  };

  const navItems: NavItem[] = [
    {
      name: "Cubicles",
      categorySlug: "restroom-cubicles",
      viewAllPath: "/products?category=Restroom%20Cubicles",
      dropdownColumns: 2,
      align: "left",
      dropdown: cubicleProducts.map((p) => ({
        name: p.title
          .replace(/ Restroom Cubicle( System)?/i, "")
          .replace(/ Restroom Cubicle/i, "")
          .replace(/ Cubicle System/i, "")
          .trim(),
        subtitle: p.subtitle,
        path: getProductPath(p),
      })),
    },
    {
      name: "Lockers",
      categorySlug: "lockers",
      viewAllPath: "/products?category=Lockers",
      dropdownColumns: 2,
      align: "center",
      dropdown: lockerProducts.map((p) => ({
        name: p.title
          .replace(/ Compact Laminate Locker/i, " Locker")
          .replace(/ Locker System/i, " Locker")
          .trim(),
        subtitle: p.subtitle,
        path: getProductPath(p),
      })),
    },
    {
      name: "Urinal Partitions",
      categorySlug: "urinal-partitions",
      viewAllPath: "/products?category=Urinal%20Partitions",
      dropdownColumns: 1,
      align: "center",
      dropdown: urinalProducts.map((p) => ({
        name: p.title
          .replace(/Urinal Partition /i, "")
          .replace(/Urinal Modesty Screen Partition/i, "Modesty Screen")
          .trim(),
        subtitle: p.subtitle,
        path: getProductPath(p),
      })),
    },
    {
      name: "Kids Toilet",
      categorySlug: "kids-toilet",
      viewAllPath: "/products?category=Kids%20Toilet",
      dropdownColumns: 1,
      align: "right",
      dropdown: kidsProducts.map((p) => ({
        name: p.title
          .replace(/ Kids Toilet Cubicle/i, "")
          .replace(/ Kids Restroom Cubicle/i, "")
          .replace(/ Kids Cubicle/i, "")
          .trim(),
        subtitle: p.subtitle,
        path: getProductPath(p),
      })),
    },
  ];

  const toggleMobileDropdown = (name: string) => {
    setActiveMobileDropdown((prev) => (prev === name ? null : name));
  };

  const isHome = location.pathname === "/";
  const isSolid = isScrolled || isMobileMenuOpen || !isHome;

  const isItemActive = (item: NavItem) => {
    if (item.path) {
      return location.pathname === item.path;
    }
    if (item.categorySlug && location.pathname.includes(`/products/${item.categorySlug}`)) {
      return true;
    }
    if (item.viewAllPath && (location.pathname + location.search) === item.viewAllPath) {
      return true;
    }
    return false;
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isSolid
          ? "bg-white/95 dark:bg-[#030213]/95 backdrop-blur-lg shadow-lg border-b border-transparent dark:border-white/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <img
              src={logo}
              alt="Pacific Products & Solutions"
              className="h-12 sm:h-16 w-auto object-contain rounded-full"
            />
            <span className="text-base sm:text-lg font-bold tracking-tight leading-tight text-[#7FB706]">
              Pacific Restroom<br className="hidden sm:block" />
              <span className="sm:hidden"> </span>Cubicle
            </span>
          </Link>

          {/* Desktop Menu */}
          <div
            ref={navContainerRef}
            className="hidden lg:flex items-center space-x-4 xl:space-x-7"
          >
            {navItems.map((item) => {
              const active = isItemActive(item);
              const isOpen = activeDropdown === item.name;

              return (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.dropdown && setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {item.dropdown ? (
                    <button
                      type="button"
                      onClick={() =>
                        setActiveDropdown((prev) => (prev === item.name ? null : item.name))
                      }
                      className={`flex items-center space-x-1 py-2 text-xs xl:text-sm font-semibold transition-colors cursor-pointer ${
                        active || isOpen
                          ? "text-[#7FB706]"
                          : isSolid
                            ? "text-[#030213] dark:text-gray-200 hover:text-[#7FB706] dark:hover:text-[#7FB706]"
                            : "text-white hover:text-[#7FB706]"
                      }`}
                    >
                      <span>{item.name}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-[#7FB706]" : ""
                        }`}
                      />
                    </button>
                  ) : (
                    <Link
                      to={item.path || "/"}
                      className={`flex items-center space-x-1 py-2 text-xs xl:text-sm font-semibold transition-colors ${
                        active
                          ? "text-[#7FB706]"
                          : isSolid
                            ? "text-[#030213] dark:text-gray-200 hover:text-[#7FB706] dark:hover:text-[#7FB706]"
                            : "text-white hover:text-[#7FB706]"
                      }`}
                    >
                      <span>{item.name}</span>
                    </Link>
                  )}

                  {/* Desktop Dropdown Panel */}
                  <AnimatePresence>
                    {item.dropdown && isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className={`absolute top-full mt-2 bg-white dark:bg-[#0a0a1a] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 p-2 z-50 ${
                          item.dropdownColumns === 2
                            ? "w-[480px] xl:w-[520px]"
                            : "w-[320px] xl:w-[350px]"
                        } ${
                          item.align === "left"
                            ? "left-0"
                            : item.align === "right"
                              ? "right-0"
                              : "left-1/2 -translate-x-1/2"
                        }`}
                      >
                        {/* Dropdown Header */}
                        <div className="flex items-center justify-between px-3 py-2 mb-1 border-b border-gray-100 dark:border-white/5">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                            {item.name} Models
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E9FDBF] dark:bg-[#7FB706]/20 text-[#7FB706]">
                            {item.dropdown.length} Available
                          </span>
                        </div>

                        {/* Model List */}
                        {item.dropdown && item.dropdown.length > 0 ? (
                          <div
                            className={`max-h-[62vh] overflow-y-auto ${
                              item.dropdownColumns === 2
                                ? "grid grid-cols-2 gap-1"
                                : "space-y-1"
                            }`}
                          >
                            {item.dropdown.map((subItem) => {
                              const isCurrentProduct = location.pathname === subItem.path;
                              return (
                                <Link
                                  key={subItem.name + subItem.path}
                                  to={subItem.path}
                                  onClick={() => setActiveDropdown(null)}
                                  className={`group flex flex-col p-2.5 rounded-xl transition-all ${
                                    isCurrentProduct
                                      ? "bg-[#E9FDBF] dark:bg-[#7FB706]/25 text-[#7FB706]"
                                      : "hover:bg-[#E9FDBF]/60 dark:hover:bg-[#7FB706]/15 text-[#030213] dark:text-gray-200"
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="font-semibold text-xs xl:text-sm group-hover:text-[#7FB706] transition-colors line-clamp-1">
                                      {subItem.name}
                                    </span>
                                    <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 text-[#7FB706] transition-all flex-shrink-0" />
                                  </div>
                                  {subItem.subtitle && (
                                    <span className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5 leading-tight">
                                      {subItem.subtitle}
                                    </span>
                                  )}
                                </Link>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="py-6 px-4 text-center">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              No {item.name} models listed yet.
                            </p>
                          </div>
                        )}

                        {/* Dropdown Footer CTA */}
                        {item.viewAllPath && (
                          <div className="pt-2 mt-1 border-t border-gray-100 dark:border-white/5">
                            <Link
                              to={item.viewAllPath}
                              onClick={() => setActiveDropdown(null)}
                              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[#7FB706] hover:bg-[#E9FDBF] dark:hover:bg-[#7FB706]/20 transition-colors"
                            >
                              <span>Explore All {item.name} Models</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* CTA Button & Theme Toggle – desktop */}
          <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
            <ThemeToggle />
            <Button onClick={() => navigate("/contact")}>Get Quote</Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors flex-shrink-0"
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
                  <Menu
                    className={`w-6 h-6 ${
                      isSolid ? "text-[#030213] dark:text-white" : "text-white"
                    }`}
                  />
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
                {navItems.map((item) => (
                  <div key={item.name}>
                    {item.dropdown ? (
                      <>
                        {/* Parent item with toggle */}
                        <button
                          type="button"
                          onClick={() => toggleMobileDropdown(item.name)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                            activeMobileDropdown === item.name
                              ? "bg-[#E9FDBF] text-[#7FB706] dark:bg-[#7FB706]/20"
                              : "hover:bg-gray-50 text-[#030213] dark:text-gray-300 dark:hover:bg-white/5"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{item.name}</span>
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                              {item.dropdown.length}
                            </span>
                          </div>
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
                                {item.dropdown && item.dropdown.length > 0 ? (
                                  item.dropdown.map((subItem) => (
                                    <Link
                                      key={subItem.name + subItem.path}
                                      to={subItem.path}
                                      onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        setActiveMobileDropdown(null);
                                      }}
                                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                                        location.pathname === subItem.path
                                          ? "text-[#7FB706] bg-[#E9FDBF] dark:bg-[#7FB706]/20 font-medium"
                                          : "text-gray-600 dark:text-gray-400 hover:bg-[#E9FDBF] dark:hover:bg-[#7FB706]/10 hover:text-[#7FB706]"
                                      }`}
                                    >
                                      <div className="font-medium">{subItem.name}</div>
                                      {subItem.subtitle && (
                                        <div className="text-xs text-gray-400 dark:text-gray-500 line-clamp-1">
                                          {subItem.subtitle}
                                        </div>
                                      )}
                                    </Link>
                                  ))
                                ) : (
                                  <div className="px-3 py-2 text-xs text-gray-400 italic">
                                    No {item.name} models listed yet.
                                  </div>
                                )}
                                {item.viewAllPath && (
                                  <Link
                                    to={item.viewAllPath}
                                    onClick={() => {
                                      setIsMobileMenuOpen(false);
                                      setActiveMobileDropdown(null);
                                    }}
                                    className="block px-3 py-2 text-xs font-semibold text-[#7FB706] hover:underline"
                                  >
                                    View All {item.name} Models →
                                  </Link>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        to={item.path || "/"}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                          location.pathname === item.path
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
                      navigate("/contact");
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