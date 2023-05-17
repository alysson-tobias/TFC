import { IRouter, Router } from 'express';
import MatcheController from '../controllers/matches.controller';
import verifyToken from '../middlewares/token.middleware';

const matcheController = new MatcheController();

const matcheRoutes: IRouter = Router();

matcheRoutes.get('/matches', matcheController.getAll.bind(matcheController));

matcheRoutes.patch(
  '/matches/:id/finish',
  verifyToken,
  matcheController.finished.bind(matcheController),
);

matcheRoutes.patch(
  '/matches/:id',
  verifyToken,
  matcheController.update.bind(matcheController),
);

matcheRoutes.post(
  '/matches',
  verifyToken,
  matcheController.create.bind(matcheController),
);

export default matcheRoutes;
