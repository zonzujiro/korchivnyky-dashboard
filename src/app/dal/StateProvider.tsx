'use client';

import React from 'react';
import type {
  ExpenseRecord,
  ExpenseType,
  Jar,
  JarStatisticRecord,
} from '../types';
import { addColorToJar } from '../toolbox/utils';

type StateProviderProps = {
  jars: Array<Jar>;
  expenses: Array<ExpenseRecord>;
  expenseTypes: Array<ExpenseType>;
  statistics: Array<JarStatisticRecord>;
};

export type AppState = StateProviderProps & {
  selectedJars: Array<Jar>;
  toggleJarSelection(jar: Jar): void;
  addJar(jar: Jar): void;
  resetJarSelection(): void;
  addExpense(expense: ExpenseRecord): void;
};

export const AppContext = React.createContext<AppState>({
  statistics: [],
  selectedJars: [],
  expenses: [],
  expenseTypes: [],
  jars: [],
  toggleJarSelection: () => {},
  addJar: () => {},
  resetJarSelection: () => {},
  addExpense: () => {},
});

export const StateProvider = ({
  jars: serverJars,
  expenses: serverExpenses,
  expenseTypes,
  children,
  statistics,
}: StateProviderProps & {
  children: React.ReactNode;
}) => {
  const [selectedJars, setSelectedJars] = React.useState<Array<Jar>>([]);
  const [expenses, setExpenses] = React.useState(serverExpenses);
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

  const addExpense = (expense: ExpenseRecord) => {
    setExpenses([...expenses, expense]);
  };

  const value = {
    selectedJars,
    toggleJarSelection,
    jars,
    addJar,
    resetJarSelection,
    expenses,
    expenseTypes,
    addExpense,
    statistics,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
