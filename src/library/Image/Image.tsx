'use client';

import { useState, CSSProperties } from 'react';
import NextImage from 'next/image';

type ImageProps = {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  width?: number | `${number}`;
  height?: number | `${number}`;
  fill?: boolean;
  style?: CSSProperties;
};

export const Image = (props: ImageProps) => {
  const { src, fallbackSrc, alt, className, width, height, fill, style } =
    props;
  const [imageSrc, setImageSrc] = useState(src);

  return (
    <NextImage
      fill={fill}
      src={imageSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      style={style}
      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
      onError={() => {
        if (fallbackSrc) {
          setImageSrc(fallbackSrc);
        }
      }}
    />
  );
};
