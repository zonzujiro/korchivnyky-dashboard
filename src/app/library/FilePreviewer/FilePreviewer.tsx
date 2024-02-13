'use client';

import { useEffect, useState } from 'react';

import { fileToBase64 } from '@/app/toolbox';

import { ImagePreview } from './ImagePreview/ImagePreview';
import styles from './FilePreviewer.module.css';

export const previewerFileTypes = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'application/pdf',
];

const isURL = (src: string) =>
  src.startsWith('http') || src.startsWith('https');

const isValidFile = (file: File) =>
  previewerFileTypes.some((type) => type === file.type);

const RECEIPT_PREVIEW_DEFAULT_STATE = {
  src: '',
  isPDF: false,
};

//TODO: finish when Dmytro will make CORS
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const usePDFUrlPreviewer = (src: string) => {
  const [pdfContent, setPDFContent] = useState(src);

  useEffect(() => {
    const getPDFContent = async () => {
      const response = await fetch(src);
      const blob = await response.blob();

      const base64 = await fileToBase64(blob);

      console.log({ base64 });

      setPDFContent(base64);
    };

    if (src && isURL(src)) {
      getPDFContent();
    }
  }, [src]);

  return pdfContent;
};

export const useFilePreviewer = () => {
  const [previewerState, setFileContent] = useState(
    RECEIPT_PREVIEW_DEFAULT_STATE
  );

  const resetPreviewer = () => {
    setFileContent(RECEIPT_PREVIEW_DEFAULT_STATE);
  };

  const handleInputChange = async (ev: React.FormEvent<HTMLInputElement>) => {
    const { files } = ev.currentTarget;

    if (!files) {
      return;
    }

    const [file] = files;

    if (!isValidFile(file)) {
      resetPreviewer();
      return;
    }

    const base64 = await fileToBase64(file);

    setFileContent({ src: base64, isPDF: file.type.includes('pdf') });
  };

  return { previewerState, handleInputChange, resetPreviewer };
};

export const FilePreviewer = ({
  previewerState,
}: {
  previewerState: ReturnType<typeof useFilePreviewer>['previewerState'];
}) => {
  const { isPDF, src } = previewerState;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const pdfContent = usePDFUrlPreviewer(src);

  if (!src) {
    return (
      <div className={styles['file-preview-skeleton']}>
        <span>🖼️</span>
      </div>
    );
  }

  if (!isPDF) {
    return (
      <div className={styles['file-preview-frame']}>
        <ImagePreview src={src} />
      </div>
    );
  }

  if (isURL(src)) {
    <div className={styles['file-preview-skeleton']}>
      <span>🖼️</span>
    </div>;
  }

  return (
    <div className={styles['file-preview-frame']}>
      <object
        className={styles['pdf-preview']}
        type='application/pdf'
        data={src}
      />
    </div>
  );
};
