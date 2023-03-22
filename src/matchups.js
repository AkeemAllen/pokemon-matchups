const { pokemonTypes, typesInPokemondbOrder } = require("./types");
const { genDefault } = require("./typeCharts");

const createMatchupMap = (generation) => {
  const map = new Map();
  const data = genDefault;
  for (const [row, rowValue] of data.entries()) {
    for (const [col, colValue] of rowValue.entries()) {
      const typeOne = typesInPokemondbOrder[row];
      const typeTwo = typesInPokemondbOrder[col];
      const key = `${typeOne} > ${typeTwo}`;
      map.set(key, colValue);
    }
  }
  return map;
};

const matchupForPair = (generation, defenseType, offenseType) => {
  const map = createMatchupMap(generation);
  const key = `${offenseType} > ${defenseType}`;
  const value = map.get(key);
  return value;
};

const matchupFor = (generation, defenseTypes, offensetype) => {
  return defenseTypes
    .filter((defenseType) => defenseType !== offensetype)
    .map((defenseType) => matchupForPair(generation, defenseType, offensetype))
    .reduce((acc, cur) => acc * cur, 1);
};

const groupMatchupsByEffectiveness = (matchups, effectiveness) => {
  const groupedMatchups = matchups
    .filter((matchup) => matchup.effectiveness === effectiveness)
    .map((matchup) => {
      return matchup.pokemonType;
    });

  return groupedMatchups;
};

const defensiveMatchups = (generation, defenseTypes) => {
  const matchups = pokemonTypes.map((pokemonType) => {
    const effectiveness = matchupFor(generation, defenseTypes, pokemonType);
    return { generation, pokemonType, effectiveness };
  });
  return matchups;
};

module.exports = { defensiveMatchups, groupMatchupsByEffectiveness };
