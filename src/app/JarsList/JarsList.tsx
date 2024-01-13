'use client';

import React, { useState, useRef, useContext, useEffect } from 'react';
import Image from 'next/image';
import classNames from 'classnames';

import type { Jar } from '../types';

import styles from './JarsList.module.css';
import { AppContext, AppState } from '../dal/StateProvider';
import { postJar } from '../dal/api';
import { jars } from '../dal/mocks';
import { CURATORS_IDS, CURATORS_NAMES } from '../constants';
import { toCurrency } from '../utils';

type JarItemProps = {
  jar: Jar;
  isSelected: boolean;
  onClick(): void;
};

const CuratorsDropdown = ({
  onChange,
}: {
  onChange?: (value: string) => void;
}) => {
  return (
    <select
      id='curator-input'
      name='curator'
      onChange={(ev) => onChange?.(ev.target.value)}
    >
      <option value=''>Жодного</option>
      <option value={CURATORS_IDS.gryshenko}>{CURATORS_NAMES.gryshenko}</option>
      <option value={CURATORS_IDS.petrynyak}>{CURATORS_NAMES.petrynyak}</option>
      <option value={CURATORS_IDS.tytarenko}>{CURATORS_NAMES.tytarenko}</option>
      <option value={CURATORS_IDS.babenko}>{CURATORS_NAMES.babenko}</option>
      <option value={CURATORS_IDS.voloshenko}>
        {CURATORS_NAMES.voloshenko}
      </option>
      <option value={CURATORS_IDS.makogon}>{CURATORS_NAMES.makogon}</option>
    </select>
  );
};

const AddJarPopup = ({ addJar }: { addJar: AppState['addJar'] }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  const openDialog = () => {
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    formRef.current?.reset();
    setErrorText('');
    dialogRef.current?.close();
  };

  const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    const { url, owner, curator } = (ev.target as HTMLFormElement)
      .elements as unknown as {
      url: HTMLInputElement;
      owner: HTMLInputElement;
      curator: HTMLSelectElement;
    };

    const existingJar = jars.find((jar) => {
      return jar.url === url.value || jar.owner_name === owner.value;
    });

    if (existingJar) {
      setErrorText(`Така банка вже є у ${existingJar.owner_name}`);
      setIsLoading(false);
      return;
    }

    const maybeWithCurator = curator.value
      ? { parentJarId: Number(curator.value) }
      : {};

    const response = await postJar({
      url: url.value,
      ownerName: owner.value,
      ...maybeWithCurator,
    });

    addJar(response);

    setIsLoading(false);
    closeDialog();
  };

  return (
    <>
      <li
        className={classNames(styles.item, styles['add-jar'])}
        onClick={openDialog}
      >
        + Додати банку
      </li>
      <dialog ref={dialogRef} className={styles['add-jar-dialog']}>
        <div className={styles['add-jar-inputs-wrapper']}>
          {isLoading && (
            <div className={styles['loader']}>
              <h4>Праця робиться...</h4>
            </div>
          )}
          <form className={styles['add-jar-inputs']} onSubmit={handleSubmit}>
            <h3>Давай додамо баночку!</h3>
            <label htmlFor='owner-input'>Як звуть власника банки?</label>
            <input
              name='owner'
              id='owner-input'
              placeholder='Джейсон Стетхем'
              type='text'
              required
              maxLength={30}
            />
            <label htmlFor='url-input'>Посилання на банку</label>
            <input
              id='url-input'
              name='url'
              placeholder='url'
              type='url'
              required
              pattern='https://send.monobank.ua/jar/.*'
              className={styles['jar-url-input']}
            />
            <label htmlFor='curator-input'>Обери куратора</label>
            <CuratorsDropdown />
            <button type='submit'>Створити банку</button>
            <button onClick={closeDialog}>Закрити</button>
            {errorText && (
              <span className={styles['form-error']}>⚠️ {errorText}</span>
            )}
          </form>
        </div>
      </dialog>
    </>
  );
};

const JarItem = ({ jar, isSelected, onClick }: JarItemProps) => {
  const { url, goal, accumulated, owner_name } = jar;

  const logoSrc = '/images/jar-logo.jpg';

  return (
    <li
      className={classNames(styles.item, {
        [styles.selected]: isSelected,
      })}
      onClick={onClick}
    >
      <div className={styles['item-column']}>
        <Image
          src={logoSrc}
          alt='jar logo'
          className={styles.logo}
          width={50}
          height={50}
        />
      </div>
      <div className={styles['item-column']}>
        <h3>{owner_name}</h3>
        {/* <a className={styles['jar-link']} href={url}>
          Посилання на банку
        </a> */}
        <span>Зібрано: {toCurrency(accumulated)}</span>
        {goal && <span>Мета: {toCurrency(goal)}</span>}
      </div>
    </li>
  );
};

export const JarsList = () => {
  const { selectedJars, toggleJarSelection, jars, addJar } =
    useContext(AppContext);
  const [isAllVisible, setIsAllVisible] = useState(jars.length < 10);
  const [selectedCurator, setSelectedCurator] = useState('');

  const byCurator = selectedCurator
    ? jars.filter((jar) => `${jar.parent_jar_id}` === selectedCurator)
    : jars;

  const toRender =
    !selectedCurator && isAllVisible ? byCurator : byCurator.slice(0, 10);

  return (
    <>
      <div className={styles.controls}>
        <h3>
          Загалом банок: {jars.length} | Обрано: {selectedJars.length}
        </h3>
        <div className={styles['curators-filter']}>
          <span>Фільтр по куратору</span>
          <CuratorsDropdown onChange={setSelectedCurator} />
        </div>
        {jars.length > 10 && (
          <span
            className={styles['jars-visibility-toggle']}
            onClick={() => setIsAllVisible(!isAllVisible)}
          >
            {!isAllVisible ? 'Є приховані' : 'Всі банки відображено'}
          </span>
        )}
      </div>
      <ol className={styles['jars-list']}>
        <AddJarPopup addJar={addJar} />
        {toRender.map((item) => (
          <JarItem
            key={item.id}
            jar={item}
            isSelected={selectedJars.includes(item.id)}
            onClick={() => toggleJarSelection(item.id)}
          />
        ))}
      </ol>
    </>
  );
};
