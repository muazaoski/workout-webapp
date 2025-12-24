import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
    statusCode?: number;
    errors?: unknown[];
}

export const errorHandler = (
    err: ApiError,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
) => {
    console.error('Error:', err.message);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        error: message,
        ...(err.errors && { errors: err.errors }),
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void | unknown> | void) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
