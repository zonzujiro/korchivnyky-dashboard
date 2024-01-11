'use client';

import { useState, useRef, useContext } from 'react';
import Image from 'next/image';
import classNames from 'classnames';

import type { Jar } from '../types';

import styles from './JarsList.module.css';
import { AppContext } from '../dal/StateProvider';

type JarItemProps = {
  jar: Jar;
  isSelected: boolean;
  onClick(): void;
};

const AddJar = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openDialog = () => {
    dialogRef.current?.showModal();
  };

  return (
    <>
      <li
        className={classNames(styles.item, styles['add-jar'])}
        onClick={openDialog}
      >
        + Додати банку
      </li>
      <dialog ref={dialogRef}>
        <p>Greetings, one and all!</p>
        <form method='dialog'>
          <button>OK</button>
        </form>
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
        <span>Зібрано: {accumulated}₴</span>
        {goal && <span> 🎯 Мета: {goal}₴</span>}
      </div>
    </li>
  );
};

type JarsListProps = {
  jars: Array<Jar>;
};

export const JarsList = (props: JarsListProps) => {
  const { jars } = props;

  const [isAllVisible, setIsAllVisible] = useState(jars.length < 10);
  const { selectedJars, setSelectedJars } = useContext(AppContext);

  const toRender = isAllVisible ? jars : jars.slice(0, 10);

  return (
    <>
      <div className={styles.controls}>
        <h3>
          Загалом банок: {jars.length} | Обрано: {selectedJars.length}
        </h3>
        {jars.length > 10 && (
          <span onClick={() => setIsAllVisible(!isAllVisible)}>
            {!isAllVisible ? 'Є приховані' : 'Всі банки відображено'}
          </span>
        )}
      </div>
      <ol className={styles['jars-list']}>
        <AddJar />
        {toRender.map((item) => (
          <JarItem
            key={item.id}
            jar={item}
            isSelected={selectedJars.includes(item.id)}
            onClick={() => setSelectedJars(item.id)}
          />
        ))}
      </ol>
    </>
  );
};
