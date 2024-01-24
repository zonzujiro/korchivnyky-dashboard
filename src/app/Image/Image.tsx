import { useState } from 'react';
import NextImage from 'next/image';

type ImageProps = {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
};

export const Image = (props: ImageProps) => {
  const { src, fallbackSrc, alt, className, width, height } = props;
  const [imageSrc, setImageSrc] = useState(src);

  return (
    <NextImage
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
