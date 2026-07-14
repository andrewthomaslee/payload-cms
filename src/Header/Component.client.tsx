"use client";

import { useHeaderTheme } from "@/providers/HeaderTheme";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

import type { Header } from "@/payload-types";

import { Logo } from "@/components/Logo/Logo";
import { HeaderNav } from "./Nav";
import { CMSLink } from "@/components/Link";
import { Container } from "@/components/ui/Container";
import { Instagram, Facebook, Mail, Menu, X, ChevronDown } from "lucide-react";

interface HeaderClientProps {
  data: Header;
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [theme, setTheme] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const { headerTheme, setHeaderTheme } = useHeaderTheme();
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "/home";

  useEffect(() => {
    setHeaderTheme(null);
  }, [pathname, setHeaderTheme]);

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) {
      setTheme(headerTheme);
    }
  }, [headerTheme, theme]);

  // Close the mobile menu whenever the route changes
  useEffect(() => {
    setMobileOpen(false);
    setExpanded(null);
  }, [pathname]);

  const navItems = data?.navItems || [];

  return (
    <>
      <header
        className={`w-full z-50 ${isHome ? "absolute top-0 left-0" : "relative"}`}
        {...(theme ? { "data-theme": theme } : {})}
      >
        <Container className="max-w-none header-wraper">
          <div className="flex h-24 items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <Logo />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:block NavItems">
              <HeaderNav data={data} />
            </div>

            {/* Desktop Right Side */}
            <div className="hidden lg:flex items-center gap-5">
              <Link href="https://www.instagram.com/brilliantfulfillment/">
                <Instagram
                  className={`h-5 w-5 ${isHome ? "text-white" : "text-black"}`}
                />
              </Link>

              <Link href="https://www.facebook.com/BrilliantFulfillment">
                <Facebook
                  className={`h-5 w-5 ${isHome ? "text-white" : "text-black"}`}
                />
              </Link>

              <Link href="mailto:sales@brilliantfulfillment.com">
                <Mail
                  className={`h-5 w-5 ${isHome ? "text-white" : "text-black"}`}
                />
              </Link>

              <a
                href="/workwithus"
                className={`block-btn-medium ${isHome ? "btn-green" : "btn-blue"}`}
              >
                GET A QUOTE
              </a>
            </div>

            {/* Mobile Burger */}
            <button
              className="lg:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="h-8 w-8 text-white" />
              ) : (
                <Menu
                  className={`h-8 w-8 ${isHome ? "text-white" : "text-black"}`}
                />
              )}
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[999] overflow-y-auto bg-black lg:hidden mobile-hwap">
          <div className="flex h-24 items-center justify-between px-6">
            <Logo />

            <button aria-label="Close menu" onClick={() => setMobileOpen(false)}>
              <X className="h-8 w-8 text-white mobilex" />
            </button>
          </div>

          <div className="flex flex-col items-center gap-8 pt-16 mobile-nav text-2xl">
            {/* Nav items with sub-menu accordion */}
            <ul className="flex flex-col items-center gap-6">
              {navItems.map(({ link, subItems }, index) => {
                const hasChildren =
                  Array.isArray(subItems) && subItems.length > 0;

                return (
                  <li key={index} className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <CMSLink
                        {...link}
                        appearance="link"
                        className="text-2xl text-white"
                      />

                      {hasChildren && (
                        <button
                          type="button"
                          aria-label="Toggle sub-menu"
                          aria-expanded={expanded === index}
                          onClick={() =>
                            setExpanded(expanded === index ? null : index)
                          }
                          className="p-1 text-white"
                        >
                          <ChevronDown
                            className={`h-6 w-6 transition-transform ${expanded === index ? "rotate-180" : ""}`}
                          />
                        </button>
                      )}
                    </div>

                    {hasChildren && expanded === index && (
                      <ul className="mt-3 flex flex-col items-center gap-2">
                        {subItems.map((sub, subIndex) => (
                          <li key={subIndex}>
                            <CMSLink
                              {...sub.link}
                              appearance="link"
                              className="text-xl theme-blue"
                            />
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="mobile-navf mt-auto flex flex-col gap-8">
              <div className="flex justify-center items-center gap-5">
                <Link href="https://www.instagram.com/brilliantfulfillment/">
                  <Instagram className="text-white" />
                </Link>

                <Link href="https://www.facebook.com/BrilliantFulfillment">
                  <Facebook className="text-white" />
                </Link>

                <Link href="mailto:sales@brilliantfulfillment.com">
                  <Mail className="text-white" />
                </Link>
              </div>
              <a href="/workwithus" className="btn-blue">
                GET A QUOTE
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
