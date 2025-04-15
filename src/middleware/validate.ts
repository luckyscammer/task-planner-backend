import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err: any) {
      const errors = err.errors.map((e: any) => ({
        field: e.path[0],
        message: e.message,
      }));
      return res.status(400).json({ errors });
    }
  };
