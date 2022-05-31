import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../errors';


export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.currentUser) {  // asumess we called current-user middleware previously
    throw new NotAuthorizedError();
  }
  next();
};
