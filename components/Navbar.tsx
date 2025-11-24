"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

type NavItem = { text: string; path: string };

const navItems: NavItem[] = [
  { text: "Home", path: "/" },
  { text: "Products", path: "/products" },
  { text: "Services", path: "/services" },
  { text: "Projects", path: "/projects" },
  { text: "Contact Us", path: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => setOpen(false), [pathname]);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 2);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (p: string) =>
    pathname === p || pathname.startsWith(p + "/");

  // Shared link classes
  const linkBase = [
    "relative inline-flex items-center",
    "h-12 md:h-14 px-4 md:px-5",
    "text-sm md:text-lg font-normal leading-none",
    "text-white hover:text-gray-300",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
    "tracking-wide",
    // underline (left → right)
    "after:content-[''] after:absolute after:left-0 after:-bottom-1",
    "after:h-0.5 after:w-full after:bg-white",
    "after:origin-left after:scale-x-0 hover:after:scale-x-100",
    "after:transition-transform after:duration-300",
    "motion-reduce:after:transition-none",
  ].join(" ");

  return (
    <nav
      className={[
        "fixed top-0 left-0 right-0 z-50 border-b border-gray-800",
        "bg-black/90 backdrop-blur",
        scrolled ? "shadow-sm" : "shadow-none",
        "transition-shadow motion-reduce:transition-none",
      ].join(" ")}
      aria-label="Main"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Brand with Logo */}
          <Link
            href="/"
            className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <Image
              src="/logo.png"
              alt="Giya Enjoy Living Logo"
              width={80}
              height={80}
              className="h-16 w-auto object-contain"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-3">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  aria-current={active ? "page" : undefined}
                  className={[linkBase, active ? "after:scale-x-100 text-gray-300" : ""].join(" ")}
                  style={{ fontFamily: 'var(--font-satisfy)' }}
                >
                  {item.text}
                </Link>
              );
            })}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors"
            aria-label="Toggle navigation menu"
            aria-controls="mobile-menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-5 w-6">
              <span className={["absolute left-0 top-0 h-0.5 w-6 bg-current transition-transform duration-300", open ? "translate-y-2.5 rotate-45" : ""].join(" ")} />
              <span className={["absolute left-0 top-2.5 h-0.5 w-6 bg-current transition-opacity duration-300", open ? "opacity-0" : "opacity-100"].join(" ")} />
              <span className={["absolute left-0 bottom-0 h-0.5 w-6 bg-current transition-transform duration-300", open ? "-translate-y-2.5 -rotate-45" : ""].join(" ")} />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div
        id="mobile-menu"
        className={[
          "md:hidden overflow-hidden border-t border-gray-800 bg-black/90 backdrop-blur",
          open ? "max-h-96" : "max-h-0",
          "transition-[max-height] duration-300 ease-in-out motion-reduce:transition-none",
        ].join(" ")}
      >
        <div className="px-4 py-2">
          <nav className="flex flex-col">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  aria-current={active ? "page" : undefined}
                  className={[linkBase, "h-12", active ? "after:scale-x-100 text-gray-300" : ""].join(" ")}
                  style={{ fontFamily: 'var(--font-satisfy)' }}
                  onClick={() => setOpen(false)}
                >
                  {item.text}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </nav>
  );
}
