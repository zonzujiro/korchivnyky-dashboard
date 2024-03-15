import { FilePreviewer, useFilePreviewer } from '../FilePreviewer';

import styles from './FilesPreviewer.module.css';
type FilesPreviewerProp = {
  removeFile: (fileName: string) => void;
  filesMetadata: Array<
    ReturnType<typeof useFilePreviewer>['previewerState'] & { fileName: string }
  >;
  multiple?: boolean;
};

type PreviewerProps = {
  removeFile: FilesPreviewerProp['removeFile'];
  metadata: FilesPreviewerProp['filesMetadata'][number];
};

const Previewer = ({ metadata, removeFile }: PreviewerProps) => (
  <div key={metadata.fileName} className={styles['file-previewer-wrapper']}>
    <div className={styles['item-header']}>
      <span className={styles['filename']}>{metadata.fileName}</span>
      <span
        className={styles['delete-button']}
        title='Видалити файл'
        onClick={() => removeFile(metadata.fileName)}
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
              key={metadata.fileName}
              metadata={metadata}
              removeFile={() => removeFile(metadata.fileName)}
            />
          ))}
        {!multiple && filesMetadata[0] && (
          <Previewer
            metadata={filesMetadata[0]}
            removeFile={() => removeFile(filesMetadata[0].fileName)}
          />
        )}
      </div>
    </div>
  );
};
