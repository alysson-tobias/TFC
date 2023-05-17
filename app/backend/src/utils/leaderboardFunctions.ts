import ILeaderboard from '../interfaces/ILeaderboard';
import Matche from '../database/models/MatcheModel';
import Team from '../database/models/TeamModel';

const count = (string: string, arry: string[]) => {
  let sum = 0;
  arry.forEach((e) => {
    if (e === string) sum += 1;
  });
  return sum;
};

const gResults = (matches: Matche[], t: string[]) => {
  const keyOne = `${t[0]}` as ('awayTeamGoals' | 'homeTeamGoals');
  const keyTwo = `${t[1]}` as ('awayTeamGoals' | 'homeTeamGoals');
  return matches.map((e) => {
    if (e[keyOne] > e[keyTwo]) return 'V';
    if (e[keyOne] === e[keyTwo]) return 'D';
    return 'L';
  }) as string[];
};

const rank = (e: Team, results: string[], matchesByTeam: Matche[], t: string[]) => {
  const keyOne = `${t[0]}` as ('awayTeamGoals' | 'homeTeamGoals');
  const keyTwo = `${t[1]}` as ('awayTeamGoals' | 'homeTeamGoals');

  const goalsFavor = matchesByTeam.reduce((a, c) => a + c[`${keyOne}`], 0);

  const goalsOwn = matchesByTeam.reduce((a, c) => a + c[`${keyTwo}`], 0);

  const points = count('V', results) * 3 + count('D', results);
  const efficiency = ((points / (results.length * 3)) * 100).toFixed(2);

  return {
    name: e.teamName,
    totalPoints: count('V', results) * 3 + count('D', results),
    totalGames: results.length,
    totalVictories: count('V', results),
    totalDraws: count('D', results),
    totalLosses: count('L', results),
    goalsFavor,
    goalsOwn,
    goalsBalance: goalsFavor - goalsOwn,
    efficiency: Number(efficiency),
  };
};

const gResultsGeneral = (id: number, matches: Matche[]) => matches.map((e) => {
  const teamOne = e.awayTeamId === id ? 'awayTeamGoals' : 'homeTeamGoals';
  const teamTwo = teamOne === 'awayTeamGoals' ? 'homeTeamGoals' : 'awayTeamGoals';

  if (e[teamOne] > e[teamTwo]) return 'v';
  if (e[teamOne] === e[teamTwo]) return 'd';
  return '1';
}) as string[];

const getGoals = (e: Team, matchesByTeam: Matche[]) => {
  let goalsFavor = 0;
  let goalsOwn = 0;

  matchesByTeam.forEach((el) => {
    const teamOne = el.awayTeamId === e.id ? 'awayTeamGoals' : 'homeTeamGoals';
    const teamTwo = teamOne === 'awayTeamGoals' ? 'homeTeamGoals' : 'awayTeamGoals';

    goalsFavor += el[teamOne];
    goalsOwn += el[teamTwo];
  });

  return { goalsFavor, goalsOwn };
};

const rankGeneral = (e: Team, results: string[], matchesByTeam: Matche[]) => {
  const { goalsFavor, goalsOwn } = getGoals(e, matchesByTeam);
  const points = count('v', results) * 3 + count('d', results);
  const efficiency = ((points / (results.length * 3)) * 100).toFixed(2);
  return {
    name: e.teamName,
    totalPoints: count('v', results) * 3 + count('d', results),
    totalGames: results.length,
    totalVictories: count('v', results),
    totalDraws: count('d', results),
    totalLosses: count('l', results),
    goalsFavor,
    goalsOwn,
    goalsBalance: goalsFavor - goalsOwn,
    efficiency: Number(efficiency),
  };
};

const test = (n1: number, n2: number) => {
  if (n1 > n2) return 1;
  return -1;
};

const orderRank = (arry: ILeaderboard[]) => {
  arry.sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return test(b.totalPoints, a.totalPoints);
    if (b.totalVictories !== a.totalVictories) return test(b.totalVictories, a.totalVictories);
    if (b.goalsBalance !== a.goalsBalance) return test(b.goalsBalance, a.goalsBalance);
    if (b.goalsFavor !== a.goalsFavor) return test(b.goalsFavor, a.goalsFavor);
    return test(b.goalsOwn, a.goalsOwn);
  });
  return arry;
};

export { rank, gResults, orderRank, gResultsGeneral, rankGeneral };
