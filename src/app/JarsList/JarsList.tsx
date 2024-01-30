'use client';

import React, { useState, useContext } from 'react';
import classNames from 'classnames';

import { Image, Button } from '../library';
import type { Jar } from '../types';
import { AppContext } from '../dal';
import { CURATORS } from '../constants';
import { toCurrency } from '../utils';

import styles from './JarsList.module.css';
import { CuratorsDropdown } from './CuratorsDropdown';
import { AddJarDialog } from './AddJarDialog/AddJarDialog';
import { AddExpenseDialog } from './AddExpenseDialog/AddExpenseDialog';

type JarItemProps = {
  jar: Jar;
  isSelected: boolean;
  onClick(): void;
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
          <AddExpenseDialog jarId={jar.id} />
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
        <AddJarDialog
          buttonClassName={styles.item}
          addJar={addJar}
          jars={jars}
        />
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
