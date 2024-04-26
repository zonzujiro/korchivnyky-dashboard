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
    >
      {!isPersonOnly ? <option value='all'>Всі</option> : null}
      <option
        selected={defaultValue === CURATORS_IDS.gryshenko}
        value={CURATORS_IDS.gryshenko}
      >
        {CURATORS_NAMES.gryshenko}
      </option>
      <option
        selected={defaultValue === CURATORS_IDS.petrynyak}
        value={CURATORS_IDS.petrynyak}
      >
        {CURATORS_NAMES.petrynyak}
      </option>
      <option
        selected={defaultValue === CURATORS_IDS.tytarenko}
        value={CURATORS_IDS.tytarenko}
      >
        {CURATORS_NAMES.tytarenko}
      </option>
      <option
        selected={defaultValue === CURATORS_IDS.babenko}
        value={CURATORS_IDS.babenko}
      >
        {CURATORS_NAMES.babenko}
      </option>
      <option
        selected={defaultValue === CURATORS_IDS.voloshenko}
        value={CURATORS_IDS.voloshenko}
      >
        {CURATORS_NAMES.voloshenko}
      </option>
      <option
        selected={defaultValue === CURATORS_IDS.makogon}
        value={CURATORS_IDS.makogon}
      >
        {CURATORS_NAMES.makogon}
      </option>
    </select>
  );
};
