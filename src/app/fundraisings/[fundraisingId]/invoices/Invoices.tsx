import { Suspense } from "react";

import type { PageParams } from "@/app/types";
import { InvoicesStateProvider, getInvoicesPageData } from "@/app/dal";

import { InvoicesList } from "./InvoicesList";

export const Invoices = async ({ params }: PageParams) => {
  const { fundraisingId } = params;
  const { expensesTypes, invoices, expenses, jars, currentUser } =
    await getInvoicesPageData({ fundraisingId });

  const userJars = jars.filter((jar) => jar.userId === currentUser.id);

  return (
    <Suspense fallback={<p>🚙 Loading...</p>}>
      <InvoicesStateProvider invoices={invoices}>
        <InvoicesList
          expenses={expenses}
          jars={userJars}
          expensesTypes={expensesTypes}
        />
      </InvoicesStateProvider>
    </Suspense>
  );
};
