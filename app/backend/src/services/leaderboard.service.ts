import { ModelStatic } from 'sequelize';
import Matche from '../database/models/MatcheModel';
import IResponse from '../interfaces/IResponse';
import { response } from '../utils/response';
import Team from '../database/models/TeamModel';
import ILeaderboard from '../interfaces/ILeaderboard';
import { rank, gResults, orderRank,
  gResultsGeneral, rankGeneral } from '../utils/leaderboardFunctions';

class LeaderboardService {
  private _matche: ModelStatic<Matche> = Matche;
  private _team: ModelStatic<Team> = Team;

  async rankHome(): Promise<IResponse> {
    const teams = await this._team.findAll();
    const matches = await this._matche.findAll({ where: { inProgress: false } });

    const result: ILeaderboard[] = [];

    teams.forEach((e) => {
      const matchesByTeam = matches.filter((el) => el.homeTeamId === e.id);
      const results = gResults(matchesByTeam, ['homeTeamGoals', 'awayTeamGoals']);

      result.push(rank(e, results, matchesByTeam, ['homeTeamGoals', 'awayTeamGoals']));
    });
    return response(200, orderRank(result));
  }

  async rankAway(): Promise<IResponse> {
    const teams = await this._team.findAll();
    const matches = await this._matche.findAll({ where: { inProgress: false } });

    const result: ILeaderboard[] = [];

    teams.forEach((e) => {
      const matchesByTeam = matches.filter((el) => el.awayTeamId === e.id);
      const results = gResults(matchesByTeam, ['awayTeamGoals', 'homeTeamGoals']);

      result.push(rank(e, results, matchesByTeam, ['awayTeamGoals', 'homeTeamGoals']));
    });
    return response(200, orderRank(result));
  }

  async rankGeral(): Promise<IResponse> {
    const teams = await this._team.findAll();
    const matches = await this._matche.findAll({ where: { inProgress: false } });

    const result: ILeaderboard[] = [];

    teams.forEach((e) => {
      const matchesByTeam = matches.filter(
        (el) => el.awayTeamId === e.id || el.homeTeamId === e.id,
      );
      const results = gResultsGeneral(e.id, matchesByTeam);

      result.push(rankGeneral(e, results, matchesByTeam));
    });
    return response(200, orderRank(result));
  }
}

export default LeaderboardService;
