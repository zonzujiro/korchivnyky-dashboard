import { useState } from 'react';

import { fileToBase64 } from '@/toolbox';

import {
  FilePreviewer,
  defaultState as filePreviewerDefaultState,
} from '../FilePreviewer';
import { isValidFile } from '../FilePreviewers.utils';

import styles from './FilesPreviewer.module.css';

const defaultState: Array<
  typeof filePreviewerDefaultState & {
    fileName: string;
  }
> = [];

export const useFilesPreviewer = () => {
  const [filesMetadata, setFilesMetadata] = useState(defaultState);

  const resetPreviewer = () => {
    setFilesMetadata(defaultState);
  };

  const removeFileMetadata = (fileName: string) => {
    const update = filesMetadata.filter(
      (metadata) => metadata.fileName !== fileName
    );

    setFilesMetadata(update);
  };

  const handleFileList = async (fileList: FileList) => {
    const files = [...fileList];

    if (!files?.length) {
      return;
    }

    const withoutDuplicates = files.filter((maybeUnique, index) => {
      return (
        files.findLastIndex((file) => file.name === maybeUnique.name) === index
      );
    });

    const onlyValidFiles = withoutDuplicates.filter(isValidFile);

    if (!onlyValidFiles.length) {
      resetPreviewer();
      return;
    }

    const filesMetadata = await Promise.all(
      onlyValidFiles.map(async (file) => {
        const base64 = await fileToBase64(file);

        return {
          src: base64,
          isPDF: file.type.includes('pdf'),
          fileName: file.name,
        };
      })
    );

    setFilesMetadata(filesMetadata);
  };

  const handleFilesDrop = async (ev: React.DragEvent<HTMLFieldSetElement>) => {
    ev.preventDefault();

    if (!ev.dataTransfer.files.length) {
      return;
    }

    return handleFileList(ev.dataTransfer.files);
  };

  const handleInputChange = (ev: React.FormEvent<HTMLInputElement>) => {
    ev.preventDefault();

    if (!ev.currentTarget.files?.length) {
      return;
    }

    return handleFileList(ev.currentTarget.files);
  };

  return {
    filesMetadata,
    handleFilesDrop,
    resetPreviewer,
    handleInputChange,
    removeFileMetadata,
  };
};

type FilesPreviewerProp = Pick<
  ReturnType<typeof useFilesPreviewer>,
  'filesMetadata' | 'removeFileMetadata'
>;

export const FilesPreviewer = (props: FilesPreviewerProp) => {
  const { filesMetadata, removeFileMetadata } = props;

  return (
    <div className={styles['files-previewer-wrapper']}>
      <div className={styles['files-previewer-list']}>
        {filesMetadata.map((metadata) => (
          <div
            key={metadata.fileName}
            className={styles['file-previewer-wrapper']}
          >
            <div className={styles['item-header']}>
              <span className={styles['filename']}>{metadata.fileName}</span>
              <span
                className={styles['delete-button']}
                title='Видалити файл'
                onClick={() => removeFileMetadata(metadata.fileName)}
              >
                ❌
              </span>
            </div>
            <FilePreviewer previewerState={metadata} />
          </div>
        ))}
      </div>
    </div>
  );
};
