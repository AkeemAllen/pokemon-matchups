const express = require("express");
const {
  defensiveMatchups,
  groupMatchupsByEffectiveness,
} = require("./matchups");

const app = express();

app.get("/", (req, res) => {
  let types = req.query.types.split(" ");
  let matchups = defensiveMatchups(1, types);
  // console.log(matchups);
  const effectivenessLevels = [8, 4, 2, 1, 1 / 2, 1 / 4, 1 / 8, 0];

  let matchupsByEffectiveness = effectivenessLevels.map((effectiveness) => {
    let data = groupMatchupsByEffectiveness(matchups, effectiveness);
    if (data.length > 0) {
      return { [`${effectiveness}`]: data };
    }
  });

  let filteredMatchupsByEffectiveness = matchupsByEffectiveness
    .filter((data) => data !== undefined)
    .reduce((obj, item) => Object.assign(obj, { ...item }), {});

  return res.json(filteredMatchupsByEffectiveness);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
