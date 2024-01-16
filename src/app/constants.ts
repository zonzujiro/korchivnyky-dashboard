export const CURATORS_IDS = {
  babenko: 17,
  voloshenko: 26,
  petrynyak: 12,
  tytarenko: 28,
  makogon: 32,
  gryshenko: 34,
};

export const CURATORS_NAMES = {
  babenko: 'Олександр Бабенко',
  voloshenko: 'Олександр Волощенко',
  petrynyak: 'Дмитро Петруняк',
  gryshenko: 'Антон Грищенко',
  tytarenko: 'Іван Титаренко',
  makogon: 'Сергій Макогон',
};

export const CURATORS_COLORS = {
  [CURATORS_IDS.voloshenko]: '#C9DAF8',
  [CURATORS_IDS.petrynyak]: '#D9D2E9',
  [CURATORS_IDS.babenko]: '#FFF2CC',
  [CURATORS_IDS.gryshenko]: '#FF85DC',
  [CURATORS_IDS.tytarenko]: '#B6D7A8',
  [CURATORS_IDS.makogon]: '#D5A6BD',
};

export const CURATORS_NICKNAMES = Object.entries(CURATORS_IDS).reduce(
  (acc, [nickname, id]) => {
    return {
      ...acc,
      [id]: nickname,
    };
  },
  {} as Record<number, string>
);

export const CURATORS = (
  Object.keys(CURATORS_IDS) as Array<keyof typeof CURATORS_IDS>
).reduce((acc, curator) => {
  return {
    ...acc,
    [CURATORS_IDS[curator]]: CURATORS_NAMES[curator],
  };
}, {} as Record<number, string>);

export const DEFAULT_JAR_GOAL = 30000;
