'use client';

import { useState } from 'react';
import NextImage from 'next/image';

type ImageProps = {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  width?: number | `${number}`;
  height?: number | `${number}`;
  fill?: boolean;
};

export const Image = (props: ImageProps) => {
  const { src, fallbackSrc, alt, className, width, height, fill } = props;
  const [imageSrc, setImageSrc] = useState(src);

  return (
    <NextImage
      fill={fill}
      src={imageSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      onError={() => {
        if (fallbackSrc) {
          setImageSrc(fallbackSrc);
        }
      }}
    />
  );
};
