'use client';

import { useState } from 'react';
import classNames from 'classnames';

import {
  useFilesPreviewer,
  FilesPreviewer,
  previewerFileTypes,
} from '../../FilePreviewers';
import formStyles from '../Form.module.css';

import styles from './FilesInput.module.css';

export const useFilesInput = () => {
  const [errorText, setErrorText] = useState('');

  const filePreviewer = useFilesPreviewer();

  const handleFilesDrop = async (ev: React.DragEvent<HTMLFieldSetElement>) => {
    setErrorText('');

    return filePreviewer.handleFilesDrop(ev);
  };

  const handleInputChange = (ev: React.FormEvent<HTMLInputElement>) => {
    setErrorText('');

    return filePreviewer.handleInputChange(ev);
  };

  return {
    ...filePreviewer,
    setErrorText,
    validity: {
      customError: errorText,
      valid: Boolean(errorText),
    },
    handleFilesDrop,
    handleInputChange,
  };
};

type FileInputProps = {
  filesInputState: ReturnType<typeof useFilesInput>;
  title: string;
};

export const FilesInput = ({ filesInputState, title }: FileInputProps) => {
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  const {
    handleFilesDrop,
    handleInputChange,
    filesMetadata,
    removeFileMetadata,
    validity,
  } = filesInputState;

  return (
    <fieldset
      className={classNames(formStyles['form-inputs'], styles['drop-target'], {
        [styles['active-drop-target']]: isDraggedOver,
        [styles['has-error']]: validity.valid,
      })}
      onDrop={handleFilesDrop}
      onDragOver={(ev) => {
        ev.preventDefault();

        if (!isDraggedOver) {
          setIsDraggedOver(true);
        }
      }}
      onDragLeave={() => {
        if (isDraggedOver) {
          setIsDraggedOver(false);
        }
      }}
    >
      <legend>{title}</legend>
      {!filesMetadata.length && (
        <input
          type='file'
          name='file'
          placeholder='Квитанція у JPG/JPEG, PNG або PDF'
          onChange={handleInputChange}
          accept={previewerFileTypes.join(', ')}
          multiple
        />
      )}
      {validity.customError && (
        <small className={styles['error-text']}>{validity.customError}</small>
      )}
      {!filesMetadata.length ? (
        <div className={styles['drop-target-overlay']}>📥 Файли сюди</div>
      ) : (
        <FilesPreviewer
          filesMetadata={filesMetadata}
          removeFileMetadata={removeFileMetadata}
        />
      )}
    </fieldset>
  );
};
