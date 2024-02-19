'use client';

import React, { useState, useContext } from 'react';
import classNames from 'classnames';

import { Image, Button, TooltipComponent } from '@/app/library';
import type { Jar } from '@/app/types';
import { JarsPageContext } from '@/app/dal';
import { toCurrency } from '@/app/toolbox';

import styles from './JarsList.module.css';
import { CuratorsDropdown } from './CuratorsDropdown';
import { AddJarDialog } from './AddJarDialog/AddJarDialog';

type JarItemProps = {
  jar: Jar;
  isSelected: boolean;
  onClick(): void;
};

const JarItem = ({ jar, isSelected, onClick }: JarItemProps) => {
  const { url, goal, accumulated, ownerName, isFinished, logo, color } = jar;

  const [copyClicked, setCopyClicked] = useState(false);

  const handleClickCopy = (ev: React.MouseEvent<HTMLSpanElement>) => {
    ev.stopPropagation();
    const timeout = setTimeout(() => {
      navigator.clipboard.writeText(url);
      setCopyClicked((current) => !current);
    }, 300);
    setCopyClicked((current) => !current);
    return () => clearTimeout(timeout);
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
          <span
            className={
              copyClicked ? styles['copy-icon-clicked'] : styles['copy-icon']
            }
            onClick={handleClickCopy}
            title='Скопіювати посилання на банку'
          >
            <TooltipComponent />
          </span>
        </div>
      </div>
      <div className={classNames(styles['item-column'], styles['jar-info'])}>
        <h3 style={{ color: color }}>
          {ownerName} {isFinished ? <span>🔒</span> : null}
        </h3>
        <div className={styles['item-column']}>
          <span>Зібрано: {toCurrency(accumulated)}</span>
          <span>Мета: {goal ? toCurrency(goal) : 'Немає'}</span>
        </div>
      </div>
    </li>
  );
};

export const JarsList = ({ fundraisingId }: { fundraisingId: string }) => {
  const { selectedJars, toggleJarSelection, jars, addJar, resetJarSelection } =
    useContext(JarsPageContext);

  const [isAllVisible, setIsAllVisible] = useState(jars.length < 10);
  const [selectedCurator, setSelectedCurator] = useState('');

  const byCurator = selectedCurator
    ? jars.filter((jar) => `${jar.userId}` === selectedCurator)
    : jars;

  const toRender =
    !selectedCurator && isAllVisible ? byCurator : byCurator.slice(0, 10);

  return (
    <>
      <div className={styles.controls}>
        <div className={styles['jars-info']}>
          <span>Загалом банок: {jars.length}</span>
          <span>
            Закрили збір: {jars.filter((jar) => jar.isFinished).length}
          </span>
          <span>
            Досягнули мети:{' '}
            {
              jars.filter(
                (jar) => jar.goal !== null && jar.goal <= jar.accumulated
              ).length
            }
          </span>
        </div>
        <div className={styles['curators-filter']}>
          <span>Куратор</span>
          <CuratorsDropdown onChange={setSelectedCurator} />
        </div>
        <div className={styles['jars-buttons']}>
          <Button disabled={!selectedJars.length} onClick={resetJarSelection}>
            Відмінити вибір
          </Button>
          {jars.length > 10 && (
            <Button onClick={() => setIsAllVisible(!isAllVisible)}>
              {!isAllVisible
                ? 'Показати всі банки 👀'
                : 'Приховати частину банок 🫣'}
            </Button>
          )}
        </div>
      </div>
      <ol className={styles['jars-list']}>
        <AddJarDialog
          buttonClassName={styles.item}
          addJar={addJar}
          jars={jars}
          fundraisingId={fundraisingId}
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
