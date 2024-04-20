'use client';

import React from 'react';
import type {
  Transaction,
  ExpenseType,
  Jar,
  JarStatisticRecord,
  User,
} from '@/types';
import { addColorToJar } from '../toolbox/utils';

type StateProviderProps = {
  jars: Array<Jar>;
  transactions: Array<Transaction>;
  expenseTypes: Array<ExpenseType>;
  statistics: Array<JarStatisticRecord>;
  users: Array<User>;
};

export type JarsPageState = StateProviderProps & {
  selectedJars: Array<Jar>;
  toggleJarSelection(jar: Jar): void;
  addJar(jar: Jar): void;
  replaceJar(jar: Jar): void;
  resetJarSelection(): void;
  addTransaction(expense: Transaction): void;
};

export const JarsPageContext = React.createContext<JarsPageState>({
  statistics: [],
  selectedJars: [],
  transactions: [],
  expenseTypes: [],
  jars: [],
  users: [],
  toggleJarSelection: () => {},
  addJar: () => {},
  replaceJar: () => {},
  resetJarSelection: () => {},
  addTransaction: () => {},
});

export const JarsPageStateProvider = ({
  jars: serverJars,
  transactions: serverTransactions,
  expenseTypes,
  children,
  statistics,
  users,
}: StateProviderProps & {
  children: React.ReactNode;
}) => {
  const [selectedJars, setSelectedJars] = React.useState<Array<Jar>>([]);
  const [transactions, setTransactions] = React.useState(serverTransactions);
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

  const replaceJar = (jar: Jar) => {
    const nextJars = [...jars];
    const index = nextJars.findIndex((el) => el.id === jar.id);
    nextJars[index] = jar;

    setJars(nextJars);
  };

  const addTransaction = (expense: Transaction) => {
    setTransactions([...transactions, expense]);
  };

  const value = {
    selectedJars,
    toggleJarSelection,
    jars,
    addJar,
    replaceJar,
    resetJarSelection,
    transactions,
    expenseTypes,
    addTransaction,
    statistics,
    users,
  };

  return (
    <JarsPageContext.Provider value={value}>
      {children}
    </JarsPageContext.Provider>
  );
};
