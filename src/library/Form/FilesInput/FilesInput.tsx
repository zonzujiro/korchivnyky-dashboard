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
  multiple?: boolean;
};

export const FilesInput = ({
  filesInputState,
  title,
  multiple,
}: FileInputProps) => {
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  const { value, validity, inputRef, setValue } = filesInputState;

  const handleFileList = async (files: Array<File>) => {
    if (!files?.length) {
      return;
    }

    const onlyValidFiles = files.filter(isValidFile);

    if (!onlyValidFiles.length) {
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

    const nextValue = [...value, ...filesMetadata];

    const unique = nextValue.filter((maybeUnique, index) => {
      return (
        nextValue.findLastIndex(
          (file) => file.fileName === maybeUnique.fileName
        ) === index
      );
    });

    setValue(unique);
  };

  const handleFilesDrop = async (ev: React.DragEvent<HTMLFieldSetElement>) => {
    ev.preventDefault();
    setIsDraggedOver(false);

    if (!ev.dataTransfer.files.length) {
      return;
    }

    const files = [...ev.dataTransfer.files];

    if (!multiple) {
      return handleFileList([files[0]]);
    }

    return handleFileList(files);
  };

  const handleInputChange = (ev: React.FormEvent<HTMLInputElement>) => {
    ev.preventDefault();

    if (!ev.currentTarget.files?.length) {
      return;
    }

    return handleFileList([...ev.currentTarget.files]);
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
        setIsDraggedOver(true);
      }}
      onDragLeave={() => setIsDraggedOver(false)}
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
          multiple={multiple}
        />
      )}
      {validity.customError && (
        <small className={styles['error-text']}>{validity.customError}</small>
      )}
      {!value.length || isDraggedOver ? (
        <div className={styles['drop-target-overlay']}>
          {multiple ? <span>📥 Файли сюди</span> : <span>📥 Файл сюди</span>}
          <small>pdf, png, jpg/jpeg</small>
        </div>
      ) : (
        <FilesPreviewer
          filesMetadata={value}
          removeFile={removeFileMetadata}
          multiple={multiple}
        />
      )}
    </fieldset>
  );
};
