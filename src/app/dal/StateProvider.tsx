'use client';

import React from 'react';
import type { Jar } from '../types';
import { addColorToJar } from '../utils';

export type AppState = {
  selectedJars: Array<Jar>;
  toggleJarSelection(jar: Jar): void;
  jars: Array<Jar>;
  addJar(jar: Jar): void;
  resetJarSelection(): void;
};

export const AppContext = React.createContext<AppState>({
  selectedJars: [],
  toggleJarSelection: () => {},
  jars: [],
  addJar: () => {},
  resetJarSelection: () => {},
});

export const StateProvider = ({
  jars: serverJars,
  children,
}: {
  jars: Array<Jar>;
  children: Array<React.ReactElement>;
}) => {
  const [selectedJars, setSelectedJars] = React.useState<Array<Jar>>([]);
  const [jars, setJars] = React.useState(serverJars);

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

  const addJar = (jar: Jar) => {
    const nextJars = [...jars];
    nextJars.unshift(addColorToJar(jar));

    setJars(nextJars);
  };

  const value = {
    selectedJars,
    toggleJarSelection,
    jars,
    addJar,
    resetJarSelection,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
