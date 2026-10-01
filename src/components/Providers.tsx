"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { captureUtms } from "@/lib/track";

/** Scroll suave (Lenis), revelações no scroll e captura de UTMs. */
export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    captureUtms();
  }, []);

  useEffect(() => {
    // a jornada é um formulário com navegação fixa: rolagem nativa
    if (pathname.startsWith("/diagnostico")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    let raf = requestAnimationFrame(function loop(t) {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    });
    const onAnchor = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const target = document.querySelector(a.getAttribute("href")!);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target as HTMLElement, { offset: -20 });
      }
    };
    document.addEventListener("click", onAnchor);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onAnchor);
      lenis.destroy();
    };
  }, [pathname]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            io.unobserve(en.target);
          }
        }),
      { rootMargin: "0px 0px -12% 0px" },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return <>{children}</>;
}
