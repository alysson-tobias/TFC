import { IRouter, Router } from 'express';
import UserController from '../controllers/user.controller';
import verifyLogin from '../middlewares/login.middleware';
import verifyToken from '../middlewares/token.middleware';

const userController = new UserController();

const userRoutes: IRouter = Router();

userRoutes.post('/login', verifyLogin, userController.login.bind(userController));

userRoutes.get('/login/role', verifyToken, UserController.getRole);

export default userRoutes;
