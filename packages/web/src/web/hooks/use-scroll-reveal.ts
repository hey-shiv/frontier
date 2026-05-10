import { useEffect, useRef } from "react";

export function useScrollReveal(options = { threshold: 0.15 }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // We target immediate children of the container
    const children = Array.from(container.children) as HTMLElement[];
    
    // Set initial state
    children.forEach((child) => {
      child.style.opacity = "0";
      child.style.transform = "translateY(32px)";
      child.style.transition = "opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)";
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          children.forEach((child, index) => {
            setTimeout(() => {
              child.style.opacity = "1";
              child.style.transform = "translateY(0)";
            }, index * 80); // Stagger by 80ms
          });
          observer.unobserve(container);
        }
      });
    }, options);

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [options.threshold]);

  return containerRef;
}
