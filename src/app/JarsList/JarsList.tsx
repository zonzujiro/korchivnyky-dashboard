'use client';

import React, { useState, useRef, useContext } from 'react';
import classNames from 'classnames';

import { Image, Dialog, Button } from '../library';
import type { Jar } from '../types';
import { AppContext, AppState, postJar } from '../dal';
import { CURATORS, CURATORS_IDS, CURATORS_NAMES } from '../constants';
import { toCurrency } from '../utils';

import styles from './JarsList.module.css';

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
      <option value=''>Всі</option>
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

const AddJarPopup = ({
  addJar,
  jars,
}: {
  addJar: AppState['addJar'];
  jars: Array<Jar>;
}) => {
  const formRef = useRef<HTMLFormElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  const resetForm = () => {
    formRef.current?.reset();
    setErrorText('');
  };

  const handleSubmit = async (
    ev: React.FormEvent<HTMLFormElement>,
    closeDialog: () => void
  ) => {
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

    setIsLoading(false);
    addJar(response);
    resetForm();
    closeDialog();
  };

  return (
    <Dialog
      title='Давай додамо баночку!'
      prepareClosing={resetForm}
      renderButton={({ openDialog }) => (
        <li
          className={classNames(styles.item, styles['add-jar'])}
          onClick={openDialog}
        >
          ➕ Додати банку
        </li>
      )}
      renderContent={({ closeDialog }) => (
        <div className={styles['add-jar-inputs-wrapper']}>
          {isLoading && (
            <div className={styles['loader']}>
              <h4>Праця робиться...</h4>
            </div>
          )}
          <form
            ref={formRef}
            className={styles['add-jar-inputs']}
            onSubmit={(ev) => handleSubmit(ev, closeDialog)}
          >
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
            />
            <label htmlFor='curator-input'>Обери куратора</label>
            <CuratorsDropdown />
            <Button type='submit'>💾 Створити банку</Button>

            {errorText && (
              <span className={styles['form-error']}>⚠️ {errorText}</span>
            )}
          </form>
        </div>
      )}
    />
  );
};

const JarItem = ({ jar, isSelected, onClick }: JarItemProps) => {
  const {
    url,
    goal,
    accumulated,
    owner_name,
    parent_jar_id,
    is_finished,
    logo,
  } = jar;

  const copyJarLink = (ev: React.MouseEvent<HTMLSpanElement>) => {
    ev.stopPropagation();
    navigator.clipboard.writeText(url);
  };

  return (
    <li
      className={classNames(styles.item, {
        [styles.selected]: isSelected,
      })}
      onClick={onClick}
    >
      <div className={styles['item-column']}>
        <Image
          src={logo ? logo : '/images/jar-logo.jpg'}
          fallbackSrc='/images/jar-logo.jpg'
          alt='jar logo'
          className={styles.logo}
          width={50}
          height={50}
        />
        <div className={styles['jar-settings']}>
          <span className={styles.icon} onClick={copyJarLink}>
            🔗
          </span>
          {/* <span className={styles.icon}>🔧</span> */}
        </div>
      </div>
      <div className={classNames(styles['item-column'], styles['jar-info'])}>
        <h3>
          {owner_name} {is_finished ? <span>🔒</span> : null}
        </h3>
        <span>
          Куратор: {parent_jar_id ? CURATORS[parent_jar_id] : 'Немає'}
        </span>
        <div className={styles['item-column']}>
          <span>Зібрано: {toCurrency(accumulated)}</span>
          <span>Мета: {goal ? toCurrency(goal) : 'Немає'}</span>
        </div>
      </div>
    </li>
  );
};

export const JarsList = () => {
  const { selectedJars, toggleJarSelection, jars, addJar, resetJarSelection } =
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
        <span>
          Загалом банок: {jars.length} | Закрили збір:{' '}
          {jars.filter((jar) => jar.is_finished).length} | Обрано:{' '}
          {selectedJars.length}
        </span>
        <div className={styles['curators-filter']}>
          <span>Фільтр по куратору</span>
          <CuratorsDropdown onChange={setSelectedCurator} />
        </div>
        <Button disabled={!selectedJars.length} onClick={resetJarSelection}>
          Відмінити вибір
        </Button>
        {jars.length > 10 && (
          <Button onClick={() => setIsAllVisible(!isAllVisible)}>
            {!isAllVisible ? 'Є приховані' : '👀 Всі банки відображено'}
          </Button>
        )}
      </div>
      <ol className={styles['jars-list']}>
        <AddJarPopup addJar={addJar} jars={jars} />
        {toRender.map((item) => {
          return (
            <JarItem
              key={item.id}
              jar={item}
              isSelected={Boolean(
                selectedJars.find((selectedJar) => selectedJar.id === item.id)
              )}
              onClick={() => toggleJarSelection(item)}
            />
          );
        })}
      </ol>
    </>
  );
};
