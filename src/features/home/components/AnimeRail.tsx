"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimeRailProps {
  title: string;
  children: React.ReactNode;
  small?: boolean;
}

export default function AnimeRail({ title, children, small = false }: AnimeRailProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true 
  });
  const [prevBtnDisabled, setPrevBtnDisabled] = React.useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = React.useState(true);

  const scrollPrev = React.useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = React.useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = React.useCallback((emblaApi: any) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="py-6">
      <div className="flex items-center justify-between px-4 md:px-8 mb-4">
        <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground">
          {title}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={scrollPrev}
            disabled={prevBtnDisabled}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50 text-foreground transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollNext}
            disabled={nextBtnDisabled}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50 text-foreground transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="overflow-hidden px-4 md:px-8" ref={emblaRef}>
        <div className="flex -ml-4 py-4">
          {React.Children.map(children, (child) => (
            <div className={cn(
              "flex-none pl-4",
              small 
                ? "w-[85%] sm:w-[45%] md:w-[35%] lg:w-[25%] xl:w-[20%] 2xl:w-[16%]" 
                : "w-[45%] sm:w-[35%] md:w-[25%] lg:w-[20%] xl:w-[16%] 2xl:w-[12%]"
            )}>
              {child}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
