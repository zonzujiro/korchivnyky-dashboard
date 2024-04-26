'use client';

import style from './ExpenseTypes.module.css';

import { Button } from '@/library';
import { ExpenseTypeDialog } from './ExpenseTypeDialog/ExpenseTypeDialog';

export const ExpenseTypeTools = ({
  fundraisingId,
}: {
  fundraisingId: string;
}) => {
  return (
    <div className={style['expense-types-tools']}>
      <ExpenseTypeDialog
        title='Запланувати витрати'
        fundraisingId={fundraisingId}
        renderButton={(openDialog) => (
          <Button onClick={openDialog}>🤑 Додати витрати</Button>
        )}
      />
    </div>
  );
};
