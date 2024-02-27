'use client';

import { useState, useEffect } from 'react';

import type { Jar } from '@/app/types';
import { toCurrency } from '@/app/toolbox';

import { CuratorsDropdown } from '../CuratorsDropdown/CuratorsDropdown';
import styles from './JarsSelector.module.css';
import classNames from 'classnames';

const SelectedJarInfo = ({ jar }: { jar: Jar }) => {
  return (
    <div className={styles['jar-info']}>
      <h4>Що по банці?</h4>
      <p>{jar.isFinished ? '🔓 Збір завершено' : '🔒 Збір продовжується'}</p>
      <p>Зібрано: {toCurrency(jar.accumulated)}</p>
    </div>
  );
};

type JarSelectorProps = {
  title: string;
  id: string;
  selectJar: (jar: Jar) => void;
  jars: Array<Jar>;
  selectedJar: Jar;
  className?: string;
};

export const JarSelector = ({
  title,
  id,
  jars,
  selectJar,
  selectedJar,
  className,
}: JarSelectorProps) => {
  const [selectedCurator, setSelectedCurator] = useState('all');

  const findJar = (id: string) => jars.find((jar) => jar.id === Number(id))!;

  const filteredJars =
    selectedCurator === 'all'
      ? jars
      : jars.filter((jar) => jar.userId === Number(selectedCurator));

  useEffect(() => {
    selectJar(filteredJars[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCurator]);

  return (
    <fieldset className={classNames(styles['jars-selector'], className)}>
      <legend>{title}</legend>
      <label htmlFor='curator-input'>Оберіть куратора</label>
      <CuratorsDropdown onChange={setSelectedCurator} />
      <label htmlFor={id}>Оберіть банку</label>
      <select
        id={id}
        name={id}
        onChange={(ev) => selectJar(findJar(ev.target.value))}
        defaultValue={selectedJar?.id || filteredJars[0].id}
      >
        {filteredJars.map((jar) => (
          <option key={jar.id} value={jar.id}>
            {jar.ownerName}: {jar.jarName}
          </option>
        ))}
      </select>
      <SelectedJarInfo jar={selectedJar || filteredJars[0].id} />
    </fieldset>
  );
};
