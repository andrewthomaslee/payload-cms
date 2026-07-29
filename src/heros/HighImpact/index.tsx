"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useHeaderTheme } from "@/providers/HeaderTheme";

export const HighImpactHero = () => {
  const { setHeaderTheme } = useHeaderTheme();

  useEffect(() => {
    setHeaderTheme("dark");
  }, [setHeaderTheme]);

  return (
    <section className="relative test h-screen min-h-[850px] overflow-hidden">
      {/* Background */}
      <img
        src="/images/hero.jpg"
        alt="Hero"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-screen-2xl items-center px-8">
        <div className="maintwrap">
          <h1 className="wethink  text-white leading-tight">
            we think{" "}
            <span className="relative inline-block">
              inside
              <span className="absolute left-0  h-1 w-full hunderl"></span>
            </span>{" "}
            the box
          </h1>

          <p className="mt-6 mb-10 soyou text-white">so you don't have to</p>

          <Link
            href="/workwithus"
            className="inline-flex border-2 border-lime-400 px-10 py-5 herobtn uppercase tracking-wide text-lime-400 transition hover:bg-lime-400 hover:text-black"
          >
            GET A QUOTE
          </Link>
        </div>
      </div>
    </section>
  );
};
