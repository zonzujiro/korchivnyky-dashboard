'use client';

import React, { useState } from 'react';
import classNames from 'classnames';

import {
  Image,
  Button,
  JarsInfo,
  SelectedJarsInfo,
  UserSelect,
} from '@/library';
import type { Jar, JarStatisticRecord, User } from '@/types';
import { getJarLeftovers, toCurrency } from '@/toolbox';

import styles from './JarsList.module.css';
import { AddJarDialog } from './JarDialog/JarDialog';
import { TransferBetweenJarsDialog } from './TransferBetweenJarsDialog/TransferBetweenJarsDialog';
import { Analytics } from '../Statistics/Statistics';

type JarItemProps = {
  jar: Jar;
  isSelected: boolean;
  onClick(): void;
  fundraisingId: string;
  jars: Array<Jar>;
  users: Array<User>;
};

const JarProgress = ({ jar }: { jar: Jar }) => {
  const percentageOfGoal = `${Math.floor(
    (100 * jar.debit) / (jar.goal || 30000)
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
        <div className={styles['jar-progress-name']}>
          {toCurrency(jar.debit)}, {percentageOfGoal}
        </div>
      </div>
    </div>
  );
};

const JarItem = ({
  jar,
  isSelected,
  onClick,
  fundraisingId,
  jars,
  users,
}: JarItemProps) => {
  const { ownerName, logo, color, jarName, url } = jar;

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
        <div className={styles['jar-owner']}>{ownerName}</div>
      </div>
      <div className={classNames(styles['item-column'], styles['jar-info'])}>
        <div className={styles['jar-title']}>{jarName}</div>
        <JarProgress jar={jar} />
        <div className={styles['jar-progress-balance']}>
          Мета: {toCurrency(jar.goal || 30000)}
        </div>
        <div className={styles['jar-leftovers']}>
          Залишок: {toCurrency(getJarLeftovers(jar))}
        </div>
        <div className={styles['jar-settings']}>
          <AddJarDialog
            jar={jar}
            fundraisingId={fundraisingId}
            jars={jars}
            users={users}
            renderButton={(openDialog) => (
              <Button onClick={openDialog} className={styles['jar-button']}>
                ✏️ Редагувати
              </Button>
            )}
          />
          <Button className={styles['jar-button']}>
            <a href={url} target='_blank' className={styles['jar-link']}>
              🔗 Посилання
            </a>
          </Button>
        </div>
      </div>
    </li>
  );
};

export const JarsList = ({
  fundraisingId,
  statistics,
  users,
  jars,
}: {
  fundraisingId: string;
  statistics: Array<JarStatisticRecord>;
  users: Array<User>;
  jars: Array<Jar>;
}) => {
  const [selectedJars, setSelectedJars] = React.useState<Array<Jar>>([]);
  const [selectedCurator, setSelectedCurator] = useState('all');

  const resetJarSelection = () => {
    setSelectedJars([]);
  };

  const toggleJarSelection = (jar: Jar) => {
    if (selectedJars.find(({ id }) => id === jar.id)) {
      setSelectedJars(selectedJars.filter(({ id }) => id !== jar.id));
    } else {
      setSelectedJars([...selectedJars, jar]);
    }
  };

  const byCurator =
    selectedCurator !== 'all'
      ? jars.filter((jar) => `${jar.userId}` === selectedCurator)
      : jars;

  const toRender =
    selectedCurator === 'all' ? byCurator : byCurator.slice(0, 10);

  const usedJars = selectedJars.length ? selectedJars : jars;

  const jarsRecords = statistics.filter((record) =>
    usedJars.some((jar) => jar.id === record.jarId)
  );

  return (
    <>
      <div className={styles.controls}>
        <div className={styles['curators-filter']}>
          <span>Куратор</span>
          <UserSelect
            users={users}
            onChange={(ev) => setSelectedCurator(ev.target.value)}
          />
        </div>
        <div className={styles['jars-filters']}>
          <Button disabled={!selectedJars.length} onClick={resetJarSelection}>
            Відмінити вибір
          </Button>
        </div>
      </div>
      <div className={styles['jars-main-content']}>
        <ul className={styles['jars-list']}>
          {toRender.map((item) => {
            return (
              <JarItem
                key={item.id}
                jar={item}
                isSelected={selectedJars.some(
                  (selectedJar) => selectedJar.id === item.id
                )}
                onClick={() => toggleJarSelection(item)}
                fundraisingId={fundraisingId}
                jars={jars}
                users={users}
              />
            );
          })}
        </ul>
        <div className={styles['jars-info-wrapper']}>
          <div className={styles['jars-buttons']}>
            <AddJarDialog
              jars={jars}
              fundraisingId={fundraisingId}
              renderButton={(openDialog) => (
                <Button onClick={openDialog}>➕ Додати банку</Button>
              )}
              users={users}
            />
            <TransferBetweenJarsDialog
              jars={jars}
              selectedJars={selectedJars}
              users={users}
            />
          </div>
          <JarsInfo jars={jars} />
          {selectedJars.length ? (
            <SelectedJarsInfo selectedJars={selectedJars} />
          ) : null}
          <Analytics jars={usedJars} jarsRecords={jarsRecords} users={users} />
        </div>
      </div>
    </>
  );
};
