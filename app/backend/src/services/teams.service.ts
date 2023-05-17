import { ModelStatic } from 'sequelize';
import Team from '../database/models/TeamModel';
import IResponse from '../interfaces/IResponse';
import { response } from '../utils/response';

class TeamService {
  private model: ModelStatic<Team> = Team;

  async get(): Promise<IResponse> {
    const teams = await this.model.findAll();
    return response(200, teams);
  }

  async getById(id: number): Promise<IResponse> {
    const teams = await this.model.findByPk(id);
    return response(200, teams);
  }
}

export default TeamService;
