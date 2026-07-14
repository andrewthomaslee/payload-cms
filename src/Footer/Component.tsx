import { getCachedGlobal } from "@/utilities/getGlobals";
import Link from "next/link";
import React from "react";
import { CMSLink } from "@/components/Link";
import { Logo } from "@/components/Logo/Logo";

export async function Footer() {
  const footerData = await getCachedGlobal("footer", 1)();

  const navItems = footerData?.navItems || [];

  return (
    <footer className="mt-auto bg-black text-white">
      <div className="mx-auto flex max-w-[1800px] flex-col justify-between gap-12 px-10 py-16 md:flex-row">
        {/* Logo */}
        <div>
          <Link href="/">
            <Logo className="FooterLogo" />
          </Link>
        </div>

        {/* Footer Navigation */}
        <div className="flex flex-col items-end gap-4 fnavp">
          <nav className="flex flex-wrap items-center gap-3 text-sm">
            {navItems.map(({ link }, i) => (
              <React.Fragment key={i}>
                <CMSLink className="text-white hover:text-lime-400" {...link} />
                {i < navItems.length - 1 && (
                  <span className="text-gray-500">|</span>
                )}
              </React.Fragment>
            ))}
          </nav>

          <div className="text-sm text-gray-400">
            {footerData?.copyrightText}
          </div>
        </div>
      </div>
    </footer>
  );
}
