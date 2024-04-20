import type { PageParams } from '@/types';
import { getExpenseTypesPageData } from '@/dal';

import style from './ExpenseTypes.module.css';
import { ExpenseTypeDialog } from './ExpenseTypeDialog/ExpenseTypeDialog';
import { ExpenseType } from './ExpenseType/ExpenseType';
import { ExpenseTypesInfo } from '@/library';

export const ExpenseTypes = async ({ params }: PageParams) => {
  const { fundraisingId } = params;
  const { expensesTypes, invoices, transactions, jars } =
    await getExpenseTypesPageData(fundraisingId);

  return (
    <div className={style['expense-types-wrapper']}>
      <div className={style['expense-types-tools']}>
        <ExpenseTypeDialog fundraisingCampaignId={Number(fundraisingId)} />
      </div>
      <div className={style['expense-types-content']}>
        <div className={style['expense-types-list']}>
          {expensesTypes.map((expenseType) => {
            return (
              <ExpenseType
                key={expenseType.id}
                expenseType={expenseType}
                invoices={invoices}
                transactions={transactions}
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
