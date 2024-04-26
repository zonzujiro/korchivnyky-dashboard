import type { PageParams } from '@/types';
import { getExpenseTypesPageData } from '@/dal';
import { ExpenseTypesInfo } from '@/library';

import style from './ExpenseTypes.module.css';
import { ExpenseType } from './ExpenseType/ExpenseType';
import { ExpenseTypeTools } from './ExpenseTypeTools';

export const ExpenseTypes = async ({ params }: PageParams) => {
  const { fundraisingId } = params;
  const { expensesTypes, invoices, transactions, jars } =
    await getExpenseTypesPageData(fundraisingId);

  return (
    <div className={style['expense-types-wrapper']}>
      <ExpenseTypeTools fundraisingId={fundraisingId} />
      <div className={style['expense-types-content']}>
        <div className={style['expense-types-list']}>
          {expensesTypes.map((expenseType) => {
            return (
              <ExpenseType
                key={expenseType.id}
                expenseType={expenseType}
                invoices={invoices}
                transactions={transactions}
                fundraisingId={fundraisingId}
              />
            );
          })}
        </div>
        <div className={style['expense-types-sidebar']}>
          <ExpenseTypesInfo
            expenseTypes={expensesTypes}
            invoices={invoices}
            transactions={transactions}
            jars={jars}
          />
        </div>
      </div>
    </div>
  );
};
