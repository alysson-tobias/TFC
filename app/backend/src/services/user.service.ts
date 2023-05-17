import { ModelStatic } from 'sequelize';
import * as bcrypt from 'bcryptjs';
import User from '../database/models/UserModel';
import IResponse from '../interfaces/IResponse';
import ILogin from '../interfaces/ILogin';
import { response, responseError } from '../utils/response';
import validateToken from '../JWT/JWT';
import { validateLogin } from './validations/inputs';

class UserService {
  private _model: ModelStatic<User> = User;

  async login(body: ILogin): Promise<IResponse> {
    const users = await this._model.findAll();
    const user = users.find((e) => e.email === body.email);

    const error = validateLogin(body);
    console.log({ error });

    if (error) return responseError(401, 'Invalid email or password');

    const checkPass = bcrypt.compareSync(body.password, user?.password || '_');
    console.log({ checkPass });

    if (!user || !checkPass) return responseError(401, 'Invalid email or password');

    const { id, email, role, username } = user;
    const token = validateToken({ id, email, role, username });
    return response(200, { token });
  }
}

export default UserService;
