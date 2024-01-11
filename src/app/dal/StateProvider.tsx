'use client';

import React from 'react';

type AppState = {
  selectedJars: Array<number>;
  setSelectedJars(id: number): void;
};

export const AppContext = React.createContext<AppState>({
  selectedJars: [],
  setSelectedJars: () => {},
});

export const StateProvider = ({
  children,
}: {
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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
