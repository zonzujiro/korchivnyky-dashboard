'use client';

import React from 'react';
import type { Invoice } from '@/types';

type StateProviderProps = {
  invoices: Array<Invoice>;
};

export type InvoicesPageState = StateProviderProps & {
  addInvoice: (invoice: Invoice) => void;
};

export const InvoicesPageContext = React.createContext<InvoicesPageState>({
  invoices: [],
  addInvoice: () => {},
});

export const InvoicesStateProvider = ({
  invoices: serverInvoices,
  children,
}: StateProviderProps & {
  children: React.ReactNode;
}) => {
  const [invoices, setInvoices] = React.useState(serverInvoices);

  const addInvoice = (invoice: Invoice) => {
    setInvoices([...invoices, invoice]);
  };

  const value = {
    addInvoice,
    invoices,
  };

  return (
    <InvoicesPageContext.Provider value={value}>
      {children}
    </InvoicesPageContext.Provider>
  );
};
