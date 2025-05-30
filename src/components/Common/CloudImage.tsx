"use client";

import { CldImage, CldImageProps } from "next-cloudinary";
import React from "react";

export interface CloudImageProps
  extends Omit<CldImageProps, "width" | "height"> {
  src: string;
  alt: string;
  /** Aspect‑ratio string, e.g. "16/9". Defaults to square */
  ratio?: `${number}/${number}`;
  /** Extra Tailwind classes for the wrapper */
  className?: string;
  /**
   * HTML "sizes" attribute.
   * Defaults → mobile 100 vw, tablet 50 vw, desktop 33 vw
   * Override when you *know* the rendered width of the image.
   */
  sizes?: string;
}

export const CloudImage: React.FC<CloudImageProps> = ({
  src,
  alt,
  className = "",
  ratio = "1/1",
  sizes = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw",
  ...restProps
}) => {
  return (
    <div
      className={`relative w-full overflow-hidden ${
        ratio === "1/1" ? "aspect-square" : ""
      } ${className}`}
      style={ratio !== "1/1" ? { aspectRatio: ratio } : undefined}
    >
      <CldImage
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover"
        {...restProps}
      />
    </div>
  );
};
