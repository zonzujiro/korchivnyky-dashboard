import { CURATORS_IDS, CURATORS_NAMES } from '@/app/constants';

export const CuratorsDropdown = ({
  onChange,
  name = 'curator',
  defaultValue,
  isPersonOnly,
}: {
  onChange?: (value: string) => void;
  name?: string;
  defaultValue?: number;
  isPersonOnly?: boolean;
}) => {
  return (
    <select
      id='curator-input'
      name={name}
      onChange={(ev) => onChange?.(ev.target.value)}
      defaultValue={defaultValue}
    >
      {!isPersonOnly ? <option value='all'>Всі</option> : null}
      <option value={CURATORS_IDS.gryshenko}>{CURATORS_NAMES.gryshenko}</option>
      <option value={CURATORS_IDS.petrynyak}>{CURATORS_NAMES.petrynyak}</option>
      <option value={CURATORS_IDS.tytarenko}>{CURATORS_NAMES.tytarenko}</option>
      <option value={CURATORS_IDS.babenko}>{CURATORS_NAMES.babenko}</option>
      <option value={CURATORS_IDS.voloshenko}>
        {CURATORS_NAMES.voloshenko}
      </option>
      <option value={CURATORS_IDS.makogon}>{CURATORS_NAMES.makogon}</option>
    </select>
  );
};
