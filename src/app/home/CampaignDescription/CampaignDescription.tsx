import styles from './CampaignDescription.module.css';

export const CampaignDescription = () => {
  return (
    <div className={styles['campaign-description-wrapper']}>
      <h3>Збір на 5 пікапів</h3>
      <span>
        <strong>Кому:</strong> 401 ОСБ, ГУР, 112 ТрО
      </span>
      <span>
        <strong>Дата початку:</strong> 01.02.2024
      </span>
    </div>
  );
};
