'use client';

import React, { useState, useContext } from 'react';
import classNames from 'classnames';

import { Image, Button, TooltipComponent, CuratorsDropdown } from '@/library';
import type { Jar, JarStatisticRecord } from '@/types';
import { JarsPageContext } from '@/dal';
import {
  getDateString,
  getGatheredMoney,
  getTimeString,
  toCurrency,
} from '@/toolbox';

import styles from './JarsList.module.css';
import { AddJarDialog } from './AddJarDialog/AddJarDialog';
import { TransferBetweenJarsDialog } from './TransferBetweenJarsDialog/TransferBetweenJarsDialog';

type JarItemProps = {
  jar: Jar;
  isSelected: boolean;
  onClick(): void;
  fundraisingId: string;
  jars: any;
};

const JarItem = ({ jar, isSelected, onClick, fundraisingId }: JarItemProps) => {
  const {
    url,
    goal,
    accumulated,
    ownerName,
    isFinished,
    logo,
    color,
    otherSourcesAccumulated,
  } = jar;

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
          style={{ border: `2px solid ${color}` }}
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
        <h3>
          {ownerName} {isFinished ? <span>🔓</span> : null}
        </h3>
        <div className={styles['item-column']}>
          <span>
            Зібрано: {toCurrency(accumulated + otherSourcesAccumulated)}
          </span>
          <span>{goal ? `Мета: ${toCurrency(goal)}` : 'Немає'}</span>
        </div>
      </div>
    </li>
  );
};

const GeneralInfo = ({
  jars,
  lastRecord,
  fundraisingId,
  selectedJars,
  addJar,
}: {
  jars: Array<Jar>;
  lastRecord?: JarStatisticRecord;
  fundraisingId: string;
  selectedJars: Array<Jar>;
  addJar: (jar: Jar) => void;
}) => {
  const finishedJars = getFinishedJars(jars);
  const achievedGoals = getAchievedGoalJars(jars);

  return (
    <>
      <div className={styles['jars-buttons']}>
        <AddJarDialog
          jars={jars}
          fundraisingId={fundraisingId}
          renderButton={(openDialog) => (
            <Button onClick={openDialog}>Редагувати банку</Button>
          )}
        />
        <TransferBetweenJarsDialog jars={jars} selectedJars={selectedJars} />
      </div>
      <div className={styles['jars-info']}>
        <h4>Загальна інформація</h4>
        {lastRecord ? (
          <small title='Оновлення раз на 12 годин' className={styles.timestamp}>
            Станом на: {getTimeString(lastRecord.createdAt)}{' '}
            {getDateString(lastRecord!.createdAt)}
          </small>
        ) : null}
        <div
          className={classNames(styles['jars-info-tag'], styles['total-jars'])}
        >
          🫙 Усього банок: {jars.length}
        </div>
        <div
          className={classNames(
            styles['jars-info-tag'],
            styles['gathered-money']
          )}
        >
          💸 Доступно для витрат:{' '}
          <span className={styles['jars-info-tag-value']}>
            {toCurrency(getGatheredMoney([...finishedJars, ...achievedGoals]))}
          </span>
        </div>
        <div className={styles['jars-info-tag']}>
          🎯 Досягнули мети: {achievedGoals.length}
        </div>
        <div className={styles['jars-info-tag']}>
          🔒 Закрили збір: {finishedJars.length}
        </div>
      </div>
    </>
  );
};

const getFinishedJars = (jars: Array<Jar>) =>
  jars.filter((jar) => jar.isFinished);

const getAchievedGoalJars = (jars: Array<Jar>) =>
  jars.filter(
    (jar) =>
      jar.goal && jar.accumulated + jar.otherSourcesAccumulated > jar.goal
  );

export const JarsList = ({ fundraisingId }: { fundraisingId: string }) => {
  const {
    selectedJars,
    toggleJarSelection,
    jars,
    resetJarSelection,
    statistics,
    addJar,
  } = useContext(JarsPageContext);

  const [isAllVisible, setIsAllVisible] = useState(jars.length < 10);
  const [selectedCurator, setSelectedCurator] = useState('all');

  const byCurator =
    selectedCurator !== 'all'
      ? jars.filter((jar) => `${jar.userId}` === selectedCurator)
      : jars;

  const toRender =
    !selectedCurator && isAllVisible ? byCurator : byCurator.slice(0, 10);

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
                jars={jars}
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
          <GeneralInfo
            jars={jars}
            lastRecord={statistics[0]}
            fundraisingId={fundraisingId}
            addJar={addJar}
            selectedJars={selectedJars}
          />

          {selectedJars.length ? (
            <div className={styles['jars-info']}>
              <h4>Інформація по обраним</h4>
              <div
                className={classNames(
                  styles['jars-info-tag'],
                  styles['total-jars']
                )}
              >
                🫙 Обрано: {selectedJars.length}
              </div>
              <div className={styles['jars-info-tag']}>
                🏦 Зібрано: {toCurrency(getGatheredMoney(selectedJars))}
              </div>
              <div
                className={classNames(
                  styles['jars-info-tag'],
                  styles['gathered-money']
                )}
              >
                💸 Доступно для витрат:{' '}
                <span className={styles['jars-info-tag-value']}>
                  {toCurrency(
                    getGatheredMoney([
                      ...getFinishedJars(selectedJars),
                      ...getAchievedGoalJars(selectedJars),
                    ])
                  )}
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};
