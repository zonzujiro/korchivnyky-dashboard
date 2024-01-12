'use client';

import React from 'react';
import type { Jar } from '../types';
import randomColor from 'randomcolor';

export type AppState = {
  selectedJars: Array<number>;
  setSelectedJars(id: number): void;
  jars: Array<Jar>;
  addJar(jar: Jar): void;
};

export const AppContext = React.createContext<AppState>({
  selectedJars: [],
  setSelectedJars: () => {},
  jars: [],
  addJar: () => {},
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

  const toggleJarSelection = (jarId: number) => {
    if (selectedJars.includes(jarId)) {
      setSelectedJars(selectedJars.filter((id) => jarId !== id));
    } else {
      setSelectedJars([...selectedJars, jarId]);
    }
  };

  const addJar = (jar: Jar) => {
    setJars([...jars, jar]);
  };

  const value = {
    selectedJars,
    setSelectedJars: toggleJarSelection,
    jars: clientJars,
    addJar,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
