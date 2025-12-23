import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import { prisma } from '../index.js';
import { generateToken } from '../utils/jwt.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Validation middleware
const registerValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').trim().isLength({ min: 1 }).withMessage('Name is required'),
];

const loginValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').exists().withMessage('Password is required'),
];

// POST /api/auth/register
router.post('/register', registerValidation, asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }

    const { email, password, name } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return res.status(400).json({
            success: false,
            error: 'Email already registered',
        });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user with stats
    const user = await prisma.user.create({
        data: {
            email,
            passwordHash,
            name,
            stats: {
                create: {}, // Creates with defaults
            },
        },
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
        },
    });

    // Generate token
    const token = generateToken(user.id, user.email);

    res.status(201).json({
        success: true,
        data: {
            user,
            token,
        },
    });
}));

// POST /api/auth/login
router.post('/login', loginValidation, asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }

    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            name: true,
            passwordHash: true,
            createdAt: true,
        },
    });

    if (!user) {
        return res.status(401).json({
            success: false,
            error: 'Invalid email or password',
        });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
        return res.status(401).json({
            success: false,
            error: 'Invalid email or password',
        });
    }

    // Generate token
    const token = generateToken(user.id, user.email);

    // Remove password from response
    const { passwordHash, ...userWithoutPassword } = user;

    res.json({
        success: true,
        data: {
            user: userWithoutPassword,
            token,
        },
    });
}));

// GET /api/auth/me
router.get('/me', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            stats: true,
        },
    });

    res.json({
        success: true,
        data: { user },
    });
}));

// POST /api/auth/logout (for token invalidation in future)
router.post('/logout', authenticate, (req: AuthRequest, res: Response) => {
    // In a stateless JWT setup, logout is handled client-side
    // For future: implement token blacklist with Redis
    res.json({
        success: true,
        message: 'Logged out successfully',
    });
});

export default router;
