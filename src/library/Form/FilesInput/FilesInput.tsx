'use client';

import { useRef, useState } from 'react';
import classNames from 'classnames';

import {
  FilesPreviewer,
  previewerFileTypes,
  defaultState as filePreviewerDefaultState,
  isValidFile,
} from '../../FilePreviewers';

import formStyles from '../Form.module.css';

import styles from './FilesInput.module.css';
import { fileToBase64 } from '@/toolbox';

const defaultState: Array<
  typeof filePreviewerDefaultState & {
    fileName: string;
  }
> = [];

export const useFilesInput = () => {
  const [errorText, setErrorText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState(defaultState);

  const reset = () => {
    setValue(defaultState);

    if (inputRef.current?.value) {
      inputRef.current.value = '';
    }
  };

  return {
    setErrorText,
    validity: {
      customError: errorText,
      valid: Boolean(errorText),
    },
    inputRef,
    setValue,
    value,
    reset,
  };
};

type FileInputProps = {
  filesInputState: ReturnType<typeof useFilesInput>;
  title: string;
};

export const FilesInput = ({ filesInputState, title }: FileInputProps) => {
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  const { value, validity, inputRef, reset, setValue } = filesInputState;

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
      reset();
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

    setValue(filesMetadata);
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

  const removeFileMetadata = (fileName: string) => {
    const update = value.filter((metadata) => metadata.fileName !== fileName);

    setValue(update);
  };

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
      {!value.length && (
        <input
          ref={inputRef}
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
      {!value.length ? (
        <div className={styles['drop-target-overlay']}>
          <span>📥 Файли сюди</span>
          <small>pdf, png, jpg/jpeg</small>
        </div>
      ) : (
        <FilesPreviewer filesMetadata={value} removeFile={removeFileMetadata} />
      )}
    </fieldset>
  );
};
