'use client';

import { useEffect, useState } from 'react';

import { fileToBase64 } from '@/toolbox';

import { ImagePreview } from './ImagePreview/ImagePreview';
import styles from './FilePreviewers.module.css';
import { isValidFile, isURL } from './FilePreviewers.utils';

export const defaultState = {
  src: '',
  isPDF: false,
};

const getIsPDF = (src: string) => {
  if (isURL(src)) {
    return src.includes('.pdf');
  }

  return src.includes('data:application/pdf');
};

const isBase64 = (maybeBase64: string) => maybeBase64.includes('base64');

export const useFilePreviewer = () => {
  const [previewerState, setFileContent] = useState(defaultState);

  const resetPreviewer = () => {
    setFileContent(defaultState);
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

export const usePDFUrlPreviewer = (src: string) => {
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
  const isPDF = previewerState.isPDF ?? getIsPDF(src);

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

  return <PDFPreviewer src={src} />;
};
