import { FilePreviewer, useFilePreviewer } from '../FilePreviewer';

import styles from './FilesPreviewer.module.css';

type FilesPreviewerProp = {
  removeFile: (fileName: string) => void;
  filesMetadata: Array<
    ReturnType<typeof useFilePreviewer>['previewerState'] & { fileName: string }
  >;
};

export const FilesPreviewer = (props: FilesPreviewerProp) => {
  const { filesMetadata, removeFile } = props;

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
                onClick={() => removeFile(metadata.fileName)}
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
