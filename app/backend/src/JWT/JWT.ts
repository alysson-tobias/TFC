import { sign, SignOptions } from 'jsonwebtoken';

const secret = process.env.JWT_SECRET as string;

const validateToken = (payload: unknown, expiresIn = '10d') => {
  const jwtCfg: SignOptions = {
    expiresIn,
    algorithm: 'HS256',
  };

  const token1 = sign({ payload }, secret, jwtCfg);
  return token1;
};

export default validateToken;
