'use client';

import style from './ExpenseTypes.module.css';

import type { User } from '@/types';
import { Button } from '@/library';
import { ExpenseTypeDialog } from './ExpenseTypeDialog/ExpenseTypeDialog';

export const ExpenseTypeTools = ({
  fundraisingId,
  users,
}: {
  fundraisingId: string;
  users: Array<User>;
}) => {
  return (
    <div className={style['expense-types-tools']}>
      <ExpenseTypeDialog
        title='Запланувати витрати'
        fundraisingId={fundraisingId}
        users={users}
        renderButton={(openDialog) => (
          <Button onClick={openDialog}>🤑 Додати витрати</Button>
        )}
      />
    </div>
  );
};
