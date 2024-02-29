'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

import type { Jar } from '@/types';
import { toCurrency, useDependency } from '@/toolbox';

import { CuratorsDropdown } from '../CuratorsDropdown/CuratorsDropdown';
import styles from './JarsSelector.module.css';
import classNames from 'classnames';
import { getFundraisingCampaigns, getJars } from '@/dal';
import { Loader } from '../Loader/Loader';

const SelectedJarInfo = ({ jar }: { jar?: Jar }) => {
  if (!jar) {
    return (
      <div className={styles['jar-info']}>
        <h4>Що по банці?</h4>
        <p>🤔 Банку не обрано</p>
      </div>
    );
  }

  return (
    <div className={styles['jar-info']}>
      <h4>Що по банці?</h4>
      <p>{jar!.isFinished ? '🔓 Збір завершено' : '🔒 Збір продовжується'}</p>
      <p>Зібрано: {toCurrency(jar!.accumulated)}</p>
    </div>
  );
};

const TabContent = (props: {
  id: string;
  selectCurator: (value: string) => void;
  value: Jar;
  jars: Array<Jar>;
  selectJar: (id: number) => void;
}) => {
  const { id, selectCurator, selectJar, value, jars } = props;

  return (
    <>
      <label htmlFor='curator-input'>Оберіть куратора</label>
      <CuratorsDropdown onChange={selectCurator} />
      <label htmlFor={id}>Оберіть банку</label>
      <select
        id={id}
        name={id}
        onChange={(ev) => selectJar(Number(ev.target.value))}
        value={value?.id || ''}
        required
      >
        {jars.map((jar) => (
          <option key={jar.id} value={jar.id}>
            {jar.ownerName}: {jar.jarName}
          </option>
        ))}
      </select>
      <SelectedJarInfo jar={value} />
    </>
  );
};

type PastCampaignsTabProps = {
  currentJars: Array<Jar>;
  jarSelectorId: string;
  selectJar: (jar: Jar) => void;
  curator: string;
  selectCurator: (curator: string) => void;
  selectedJar: Jar;
};

const useJarsSource = (
  campaignId: string,
  externalJars: Array<Jar>,
  curator: string
) => {
  const { result } = useDependency(() => getJars());

  const campaignJars = result
    ? result.filter((jar) => jar.fundraisingCampaignId === Number(campaignId))
    : null;

  const usedJars = campaignJars ? campaignJars : externalJars;

  if (curator === 'all') {
    return usedJars;
  }

  return usedJars.filter((jar) => jar.userId === Number(curator));
};

const PastCampaignsTab = (props: PastCampaignsTabProps) => {
  const {
    currentJars,
    jarSelectorId,
    selectJar,
    selectCurator,
    curator,
    selectedJar,
  } = props;

  const { fundraisingId } = useParams<{
    fundraisingId: string;
  }>();

  const [campaignId, setCampaignId] = useState(fundraisingId);

  // For past campaigns we need all data
  const jars = useJarsSource(campaignId, currentJars, curator);
  const { result: campaigns, isLoading: isLoadingCampaigns } = useDependency(
    () => getFundraisingCampaigns()
  );

  const filteredJars =
    curator === 'all'
      ? jars
      : jars.filter((jar) => jar.userId === Number(curator));

  return (
    <Loader className={styles.loader} isLoading={isLoadingCampaigns}>
      <div className={styles['tab-content']}>
        <label>Оберіть збір</label>
        {campaigns ? (
          <select
            id='campaign-selector'
            name='campaign-selector'
            onChange={(ev) => setCampaignId(ev.target.value)}
            defaultValue={campaignId}
          >
            {campaigns.map((campaign) => (
              <option key={campaign.id} value={campaign.id}>
                {campaign.name}
              </option>
            ))}
          </select>
        ) : null}
        <TabContent
          id={jarSelectorId}
          value={selectedJar || filteredJars[0]}
          selectJar={(id) => {
            const jar = jars.find((jar) => jar.id === Number(id))!;
            selectJar(jar);
          }}
          selectCurator={selectCurator}
          jars={filteredJars}
        />
      </div>
    </Loader>
  );
};

type JarSelectorProps = {
  title: string;
  id: string;
  selectJar: (jar: Jar) => void;
  jars: Array<Jar>;
  selectedJar: Jar;
  className?: string;
};

export const JarSelector = ({
  title,
  id: jarSelectorId,
  jars: currentJars,
  selectJar,
  selectedJar,
  className,
}: JarSelectorProps) => {
  const [curator, selectCurator] = useState('all');
  const [activeTab, setActiveTab] = useState<'current' | 'past'>('current');

  const findJar = (id: number) => currentJars.find((jar) => jar.id === id)!;

  const filteredJars =
    curator === 'all'
      ? currentJars
      : currentJars.filter((jar) => jar.userId === Number(curator));

  useEffect(() => {
    selectJar(filteredJars[0] || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curator]);

  return (
    <fieldset className={classNames(styles['jars-selector'], className)}>
      <legend>{title}</legend>
      <ol className={styles['tabs-wrapper']}>
        <li
          onClick={() => setActiveTab('current')}
          className={classNames(styles.tab, {
            [styles.active]: activeTab === 'current',
          })}
        >
          Поточний збір
        </li>
        <li
          onClick={() => setActiveTab('past')}
          className={classNames(styles.tab, {
            [styles.active]: activeTab === 'past',
          })}
        >
          Попередні збори
        </li>
      </ol>
      {activeTab === 'current' ? (
        <div className={styles['tab-content']}>
          <TabContent
            id={jarSelectorId}
            value={selectedJar || filteredJars[0]}
            selectJar={(id) => selectJar(findJar(id))}
            selectCurator={selectCurator}
            jars={filteredJars}
          />
        </div>
      ) : null}
      {activeTab === 'past' ? (
        <PastCampaignsTab
          currentJars={currentJars}
          jarSelectorId={jarSelectorId}
          selectJar={selectJar}
          curator={curator}
          selectCurator={selectCurator}
          selectedJar={selectedJar}
        />
      ) : null}
    </fieldset>
  );
};
