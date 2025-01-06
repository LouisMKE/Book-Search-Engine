import jwt from 'jsonwebtoken';
import { Request } from 'express';

const secret = 'your-secret-key'; // Replace with your actual secret
const expiration = '2h';

export const authMiddleware = ({ req }: { req: Request }) => {
  let token = req.body.token || req.query.token || req.headers.authorization;

  if (req.headers.authorization) {
    token = token.split(' ').pop()?.trim();
  }

  if (!token) {
    return req;
  }

  try {
    const { data } = jwt.verify(token, secret, { maxAge: expiration }) as any;
    req.user = data;
  } catch {
    console.log('Invalid token');
  }

  return req;
};

export const signToken = ({ username, email, _id }: any) => {
  const payload = { username, email, _id };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
};
