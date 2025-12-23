import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../index.js';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        name: string;
    };
}

export const authenticate = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Access denied. No token provided.',
            });
        }

        const token = authHeader.split(' ')[1];
        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not configured');
        }

        const decoded = jwt.verify(token, jwtSecret) as {
            userId: string;
            email: string;
        };

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, name: true },
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid token. User not found.',
            });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                success: false,
                error: 'Invalid token.',
            });
        }
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                success: false,
                error: 'Token expired.',
            });
        }
        next(error);
    }
};
