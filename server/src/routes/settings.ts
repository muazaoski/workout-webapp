import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../index.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// All settings routes require authentication
router.use(authenticate);

// GET /api/settings - Get user settings
router.get('/', asyncHandler(async (req: AuthRequest, res: Response) => {
    let settings = await prisma.userSettings.findUnique({
        where: { userId: req.user!.id },
    });

    if (!settings) {
        settings = await prisma.userSettings.create({
            data: { userId: req.user!.id },
        });
    }

    res.json({
        success: true,
        data: { settings },
    });
}));

// PUT /api/settings - Update user settings
router.put('/', [
    body('weightUnit').optional().isIn(['kg', 'lbs']).withMessage('Invalid weight unit'),
    body('distanceUnit').optional().isIn(['km', 'miles']).withMessage('Invalid distance unit'),
    body('theme').optional().isIn(['light', 'dark', 'system']).withMessage('Invalid theme'),
], asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }

    const { weightUnit, distanceUnit, theme } = req.body;

    const settings = await prisma.userSettings.upsert({
        where: { userId: req.user!.id },
        update: { weightUnit, distanceUnit, theme },
        create: {
            userId: req.user!.id,
            weightUnit: weightUnit || 'kg',
            distanceUnit: distanceUnit || 'km',
            theme: theme || 'dark',
        },
    });

    res.json({
        success: true,
        data: { settings },
    });
}));

export default router;
