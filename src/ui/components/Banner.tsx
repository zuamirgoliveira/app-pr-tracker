import { cn } from "../../lib/utils";

interface BannerProps {
  src: string;
  alt: string;
  className?: string;
}

export function Banner({ src, alt, className }: BannerProps) {
  return (
    <div className="mb-8 flex items-center justify-center w-full">
      <img
        src={src}
        alt={alt}
        className={cn(
          "w-full max-w-4xl h-auto rounded-2xl border-2 border-blue-600/30 shadow-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:border-blue-600/50 object-contain",
          className
        )}
      />
    </div>
  );
}