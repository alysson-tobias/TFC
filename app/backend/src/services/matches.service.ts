import { ModelStatic } from 'sequelize';
import IResponse from '../interfaces/IResponse';
import { response, responseError } from '../utils/response';
import Matche from '../database/models/MatcheModel';
import Team from '../database/models/TeamModel';
import IMatchesUpdate from '../interfaces/IMatchesUpdate';
import IMatche from '../interfaces/IMatche';

class MatcheService {
  private _model: ModelStatic<Matche> = Matche;

  async getAll(inProgress: string): Promise<IResponse> {
    const matches = await this._model.findAll({
      include: [
        { model: Team, as: 'homeTeam', attributes: ['teamName'] },
        { model: Team, as: 'awayTeam', attributes: ['teamName'] },
      ],
    });

    if (!inProgress) return response(200, matches);

    const isTrue = (inProgress === 'true');
    if (isTrue) return response(200, matches.filter((e) => e.inProgress));

    const isFalse = (inProgress === 'false');
    if (isFalse) return response(200, matches.filter((e) => !e.inProgress));

    return response(200, matches);
  }

  async finished(id: number): Promise<IResponse> {
    await this._model.update({ inProgress: false }, { where: { id } });
    return response(200, { message: 'Finished' });
  }

  async update(id: number, body:IMatchesUpdate): Promise<IResponse> {
    const matche = await this._model.findByPk(id);
    if (matche?.inProgress) {
      await this._model.update({ ...body }, { where: { id } });
    }
    return response(200, { message: 'updated' });
  }

  async create(body: IMatche): Promise<IResponse> {
    if (body.awayTeamId === body.homeTeamId) {
      return responseError(422, 'It is not possible to create a match with two equal teams');
    }

    const team1 = await this._model.findByPk(body.awayTeamId);
    const team2 = await this._model.findByPk(body.homeTeamId);

    if (!team1 || !team2) {
      return responseError(404, 'There is no team with such id!');
    }

    const created = await this._model.create({ ...body });
    return response(201, created);
  }
}

export default MatcheService;
