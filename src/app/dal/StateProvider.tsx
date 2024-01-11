'use client';

import React from 'react';
import type { Jar } from '../types';

type AppState = {
  selectedJars: Array<number>;
  setSelectedJars(id: number): void;
  jars: Array<Jar>;
};

export const AppContext = React.createContext<AppState>({
  selectedJars: [],
  setSelectedJars: () => {},
  jars: [],
});

export const StateProvider = ({
  jars,
  children,
}: {
  jars: Array<Jar>;
  children: Array<React.ReactElement>;
}) => {
  const [selectedJars, setSelectedJars] = React.useState<Array<number>>([]);

  const toggleJarSelection = (jarId: number) => {
    if (selectedJars.includes(jarId)) {
      setSelectedJars(selectedJars.filter((id) => jarId !== id));
    } else {
      setSelectedJars([...selectedJars, jarId]);
    }
  };

  const value = {
    selectedJars,
    setSelectedJars: toggleJarSelection,
    jars,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
