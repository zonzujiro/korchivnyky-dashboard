'use client';

import { FilePreviewer } from '../FilePreviewer';

import styles from './FilesPreviewer.module.css';

type FilesPreviewerProp = {
  removeFile: (fileName: string) => void;
  filesMetadata: Array<{ name: string; src: string }>;
  multiple?: boolean;
};

type PreviewerProps = {
  removeFile: FilesPreviewerProp['removeFile'];
  metadata: FilesPreviewerProp['filesMetadata'][number];
};

const Previewer = ({ metadata, removeFile }: PreviewerProps) => (
  <div key={metadata.name} className={styles['file-previewer-wrapper']}>
    <div className={styles['item-header']}>
      <span className={styles['filename']}>{metadata.name}</span>
      <span
        className={styles['delete-button']}
        title='Видалити файл'
        onClick={() => removeFile(metadata.name)}
      >
        ❌
      </span>
    </div>
    <FilePreviewer previewerState={metadata} />
  </div>
);

export const FilesPreviewer = (props: FilesPreviewerProp) => {
  const { filesMetadata, removeFile, multiple } = props;

  return (
    <div className={styles['files-previewer-wrapper']}>
      <div className={styles['files-previewer-list']}>
        {multiple && (
          <span className={styles['counter']}>
            Обрано файлів: {filesMetadata.length}
          </span>
        )}
        {multiple &&
          filesMetadata.map((metadata) => (
            <Previewer
              key={metadata.name}
              metadata={metadata}
              removeFile={() => removeFile(metadata.name)}
            />
          ))}
        {!multiple && filesMetadata[0] && (
          <Previewer
            metadata={filesMetadata[0]}
            removeFile={() => removeFile(filesMetadata[0].name)}
          />
        )}
      </div>
    </div>
  );
};
