'use client';

import React from 'react';
import type { Jar } from '../types';
import randomColor from 'randomcolor';

export type AppState = {
  selectedJars: Array<number>;
  toggleJarSelection(id: number): void;
  jars: Array<Jar>;
  addJar(jar: Jar): void;
  selectMultipleJars(jars: Array<number>): void;
  deselectMultipleJars(jars: Array<number>): void;
};

export const AppContext = React.createContext<AppState>({
  selectedJars: [],
  toggleJarSelection: () => {},
  jars: [],
  addJar: () => {},
  selectMultipleJars: () => {},
  deselectMultipleJars: () => {},
});

export const StateProvider = ({
  jars,
  children,
}: {
  jars: Array<Jar>;
  children: Array<React.ReactElement>;
}) => {
  const jarsWithColors = jars.map((jar) => ({
    ...jar,
    color: randomColor(),
  }));

  const [selectedJars, setSelectedJars] = React.useState<Array<number>>([]);
  const [clientJars, setJars] = React.useState(jarsWithColors);

  const selectMultipleJars = (value: Array<number>) => {
    const nextSelectedJars = value.filter((jarId) => {
      return !selectedJars.includes(jarId);
    });

    setSelectedJars([...selectedJars, ...nextSelectedJars]);
  };

  const deselectMultipleJars = (value: Array<number>) => {
    setSelectedJars(
      selectedJars.filter((id) => {
        return !value.includes(id);
      })
    );
  };

  const toggleJarSelection = (value: number) => {
    if (selectedJars.includes(value)) {
      setSelectedJars(selectedJars.filter((id) => value !== id));
    } else {
      setSelectedJars([...selectedJars, value]);
    }
  };

  const addJar = (jar: Jar) => {
    const nextJars = [...jars];
    nextJars.unshift(jar);

    setJars(nextJars);
  };

  const value = {
    selectedJars,
    toggleJarSelection,
    jars: clientJars,
    addJar,
    deselectMultipleJars,
    selectMultipleJars,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
