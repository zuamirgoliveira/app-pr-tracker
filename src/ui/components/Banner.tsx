interface BannerProps {
  src: string;
  alt: string;
  className?: string;
}

export function Banner({ src, alt, className = "page-banner" }: BannerProps) {
  return (
    <div className="banner-container">
      <img 
        src={src} 
        alt={alt} 
        className={className}
      />
    </div>
  );
}
