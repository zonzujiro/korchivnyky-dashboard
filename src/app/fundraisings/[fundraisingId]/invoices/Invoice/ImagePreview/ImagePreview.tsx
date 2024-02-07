import { Image } from '@/app/library';

import styles from './ImagePreview.module.css';

export const ImagePreview = ({ src }: { src: string }) => {
  return (
    <Image
      className={styles['image-preview']}
      src={src}
      alt='Receipt preview'
      fill={true}
    />
  );
};
