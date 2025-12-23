import jwt from 'jsonwebtoken';

export const generateToken = (userId: string, email: string): string => {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

    if (!secret) {
        throw new Error('JWT_SECRET is not configured');
    }

    return jwt.sign({ userId, email }, secret, { expiresIn });
};

export const verifyToken = (token: string): { userId: string; email: string } => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error('JWT_SECRET is not configured');
    }

    return jwt.verify(token, secret) as { userId: string; email: string };
};
