'use client';

import React, { useState, useContext } from 'react';
import classNames from 'classnames';

import {
  Image,
  Button,
  TooltipComponent,
  CuratorsDropdown,
  JarsInfo,
  SelectedJarsInfo,
} from '@/library';
import type { Jar } from '@/types';
import { JarsPageContext } from '@/dal';
import { toCurrency } from '@/toolbox';

import styles from './JarsList.module.css';
import { AddJarDialog } from './AddJarDialog/AddJarDialog';
import { TransferBetweenJarsDialog } from './TransferBetweenJarsDialog/TransferBetweenJarsDialog';

type JarItemProps = {
  jar: Jar;
  isSelected: boolean;
  onClick(): void;
  fundraisingId: string;
};

<<<<<<< HEAD
const JarItem = ({ jar, isSelected, onClick, fundraisingId }: JarItemProps) => {
  const { url, goal, debit, ownerName, isFinished, logo, color } = jar;
=======
const JarProgress = ({ jar }: { jar: Jar }) => {
  const percentageOfGoal = `${Math.round(
    (100 * (jar.accumulated || jar.debit)) / (jar.goal || 30000)
  )}%`;

  return (
    <div className={styles['jar-progress']}>
      <div className={styles['jar-progress-background']} />
      <div className={styles['jar-progress-container']}>
        <div className={styles['jar-progress-clip']}>
          <div
            className={styles['jar-progress-bar']}
            style={{ width: percentageOfGoal }}
          />
        </div>
      </div>
      <div className={styles['jar-progress-text']}>
        <div className={styles['jar-progress-balance']}>{toCurrency(0)}</div>
        <div className={styles['jar-progress-name']}>
          {toCurrency(jar.accumulated || jar.debit)}, {percentageOfGoal}
        </div>
        <div className={styles['jar-progress-goal']}>
          {toCurrency(jar.goal || 30000)}
        </div>
      </div>
    </div>
  );
};

const JarItem = ({ jar, isSelected, onClick }: JarItemProps) => {
  const { url, goal, debit, ownerName, isFinished, logo, color, jarName } = jar;
>>>>>>> f50744a (changing jar item design)

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
      <div className={classNames(styles['item-column'], styles['jar-avatar'])}>
        <Image
          src={logo ? logo : '/images/jar-logo.jpg'}
          fallbackSrc='/images/jar-logo.jpg'
          alt='jar logo'
          className={styles.logo}
          style={{ border: `2px solid ${color}` }}
          width={69}
          height={69}
        />
        {/* <div className={styles['jar-settings']}>
          <span
            className={
              copyClicked ? styles['copy-icon-clicked'] : styles['copy-icon']
            }
            onClick={handleClickCopy}
            title='Скопіювати посилання на банку'
          >
            <TooltipComponent />
          </span>
          <span>
            <AddJarDialog
              jar={jar}
              fundraisingId={fundraisingId}
              renderButton={(openDialog) => (
                <Button onClick={openDialog}>Редагувати банку</Button>
              )}
            />
          </span>
        </div>
      </div>
      <div className={classNames(styles['item-column'], styles['jar-info'])}>
        <div className={styles['jar-title']}>{jarName}</div>
        <JarProgress jar={jar} />
        {/* <h3>
          {ownerName} {isFinished ? <span>🔓</span> : null}
        </h3>
        <div className={styles['item-column']}>
          <span>Зібрано: {toCurrency(jar.accumulated || debit)}</span>
          <span>{goal ? `Мета: ${toCurrency(goal)}` : 'Мета: Немає'}</span>
        </div> */}
      </div>
    </li>
  );
};

export const JarsList = ({ fundraisingId }: { fundraisingId: string }) => {
  const {
    selectedJars,
    toggleJarSelection,
    jars,
    resetJarSelection,
    expenses,
  } = useContext(JarsPageContext);

  const [isAllVisible, setIsAllVisible] = useState(jars.length < 10);
  const [selectedCurator, setSelectedCurator] = useState('all');

  const byCurator =
    selectedCurator !== 'all'
      ? jars.filter((jar) => `${jar.userId}` === selectedCurator)
      : jars;

  const toRender =
    selectedCurator === 'all' && isAllVisible
      ? byCurator
      : byCurator.slice(0, 10);

  return (
    <>
      <div className={styles.controls}>
        <div className={styles['curators-filter']}>
          <span>Куратор</span>
          <CuratorsDropdown onChange={setSelectedCurator} />
        </div>
        <div className={styles['jars-filters']}>
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
      <div className={styles['jars-main-content']}>
        <ul className={styles['jars-list']}>
          {toRender.map((item) => {
            return (
              <JarItem
                key={item.id}
                jar={item}
                isSelected={Boolean(
                  selectedJars.find((selectedJar) => selectedJar.id === item.id)
                )}
                onClick={() => toggleJarSelection(item)}
                fundraisingId={fundraisingId}
              />
            );
          })}
        </ul>
        <div className={styles['jars-info-wrapper']}>
          <div className={styles['jars-buttons']}>
            <AddJarDialog
              jars={jars}
              fundraisingId={fundraisingId}
              renderButton={() => <div />}
            />
            <TransferBetweenJarsDialog
              jars={jars}
              selectedJars={selectedJars}
              expenses={expenses}
            />
          </div>
          <JarsInfo jars={jars} />

          {selectedJars.length ? (
            <SelectedJarsInfo selectedJars={selectedJars} />
          ) : null}
        </div>
      </div>
    </>
  );
};
