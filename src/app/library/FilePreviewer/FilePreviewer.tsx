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

const isURL = (maybeUrl: string) =>
  maybeUrl.startsWith('http') || maybeUrl.startsWith('https');

const isBase64 = (maybeBase64: string) => maybeBase64.includes('base64');

const isValidFile = (file: File) =>
  previewerFileTypes.some((type) => type === file.type);

const RECEIPT_PREVIEW_DEFAULT_STATE = {
  src: '',
  isPDF: false,
};

const usePDFUrlPreviewer = (src: string) => {
  const [pdfContent, setPDFContent] = useState<null | string>(null);

  useEffect(() => {
    const getPDFContent = async () => {
      try {
        const response = await fetch(src);
        const blob = await response.blob();
        const pdfBlob = new Blob([blob], { type: 'application/pdf' });
        const base64 = await fileToBase64(pdfBlob);

        setPDFContent(base64);
      } catch (e) {
        console.log(e);
      }
    };

    if (src) {
      if (isURL(src)) {
        getPDFContent();
      }

      if (isBase64(src)) {
        setPDFContent(src);
      }
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

const PDFPreviewer = ({ src }: { src: string }) => {
  const pdfContent = usePDFUrlPreviewer(src);

  return (
    <div className={styles['file-preview-frame']}>
      {!pdfContent ? (
        <div className={styles['file-preview-skeleton']}>
          <span>🖼️</span>
        </div>
      ) : (
        <object
          className={styles['pdf-preview']}
          type='application/pdf'
          data={pdfContent}
        />
      )}
    </div>
  );
};

export const FilePreviewer = ({
  previewerState,
}: {
  previewerState: { src: string; isPDF?: boolean };
}) => {
  const { src } = previewerState;

  const isPDF = previewerState.isPDF || src.includes('pdf');

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

  return <PDFPreviewer src={src} />;
};
