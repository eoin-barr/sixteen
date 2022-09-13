import { NextFunction, Request, RequestHandler, Response } from "express";
import { getAuthFunction } from "./lib/auth";

/**
 * This router wrapper catches any error from async await
 * and throws it to the default express error handler,
 * instead of crashing the app
 * @param req
 * @param res
 * @param next
 */
export const request = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    next();
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.log({
        level: "error",
        message: "Error in request handler",
        error: err,
      });
    }
    next(err);
  }
};

export const authWrapper =
  (handler: RequestHandler) =>
  async (req: Request, res: Response, next: NextFunction) => {
    let context;
    try {
      const authFunc = await getAuthFunction(req.headers);
      context = await authFunc();
    } catch (err) {
      return next(err);
    }
    res.locals.context = context;
    return handler(req, res, next);
  };
