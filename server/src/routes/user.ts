import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../index.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// GET /api/user/stats - Get user stats
router.get('/stats', asyncHandler(async (req: AuthRequest, res: Response) => {
    let stats = await prisma.userStats.findUnique({
        where: { userId: req.user!.id },
    });

    if (!stats) {
        stats = await prisma.userStats.create({
            data: { userId: req.user!.id },
        });
    }

    res.json({
        success: true,
        data: { stats },
    });
}));

// PUT /api/user/stats - Update user stats (level, XP)
router.put('/stats', asyncHandler(async (req: AuthRequest, res: Response) => {
    const { level, currentXP, totalXP, streak } = req.body;

    const stats = await prisma.userStats.upsert({
        where: { userId: req.user!.id },
        update: {
            ...(level !== undefined && { level }),
            ...(currentXP !== undefined && { currentXP }),
            ...(totalXP !== undefined && { totalXP }),
            ...(streak !== undefined && { streak }),
        },
        create: {
            userId: req.user!.id,
            level: level || 1,
            currentXP: currentXP || 0,
            totalXP: totalXP || 0,
            streak: streak || 0,
        },
    });

    res.json({
        success: true,
        data: { stats },
    });
}));

// PUT /api/user/profile - Update user profile
router.put('/profile', [
    body('name').optional().trim().isLength({ min: 1 }).withMessage('Name cannot be empty'),
], asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }

    const { name } = req.body;

    const user = await prisma.user.update({
        where: { id: req.user!.id },
        data: { name },
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
        },
    });

    res.json({
        success: true,
        data: { user },
    });
}));

// GET /api/user/achievements - Get user achievements
router.get('/achievements', asyncHandler(async (req: AuthRequest, res: Response) => {
    const achievements = await prisma.userAchievement.findMany({
        where: { userId: req.user!.id },
        orderBy: { unlockedAt: 'desc' },
    });

    res.json({
        success: true,
        data: { achievements },
    });
}));

// POST /api/user/achievements - Unlock achievement
router.post('/achievements', [
    body('achievementId').trim().isLength({ min: 1 }).withMessage('Achievement ID is required'),
], asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }

    const { achievementId } = req.body;

    // Check if already unlocked
    const existing = await prisma.userAchievement.findUnique({
        where: {
            userId_achievementId: {
                userId: req.user!.id,
                achievementId,
            },
        },
    });

    if (existing) {
        return res.json({
            success: true,
            data: { achievement: existing, alreadyUnlocked: true },
        });
    }

    const achievement = await prisma.userAchievement.create({
        data: {
            userId: req.user!.id,
            achievementId,
        },
    });

    res.status(201).json({
        success: true,
        data: { achievement },
    });
}));

// GET /api/user/challenges - Get user challenges
router.get('/challenges', asyncHandler(async (req: AuthRequest, res: Response) => {
    const challenges = await prisma.challenge.findMany({
        where: { userId: req.user!.id },
        orderBy: { createdAt: 'desc' },
    });

    res.json({
        success: true,
        data: { challenges },
    });
}));

// POST /api/user/challenges - Create challenge
router.post('/challenges', [
    body('name').trim().isLength({ min: 1 }).withMessage('Challenge name is required'),
    body('startDate').isISO8601().withMessage('Valid start date is required'),
], asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }

    const { name, description, startDate, endDate, icon, color } = req.body;

    const challenge = await prisma.challenge.create({
        data: {
            userId: req.user!.id,
            name,
            description,
            startDate: new Date(startDate),
            endDate: endDate ? new Date(endDate) : null,
            icon,
            color,
        },
    });

    res.status(201).json({
        success: true,
        data: { challenge },
    });
}));

// PUT /api/user/challenges/:id/checkin - Check in to challenge
router.put('/challenges/:id/checkin', asyncHandler(async (req: AuthRequest, res: Response) => {
    const challenge = await prisma.challenge.findFirst({
        where: {
            id: req.params.id,
            userId: req.user!.id,
        },
    });

    if (!challenge) {
        return res.status(404).json({
            success: false,
            error: 'Challenge not found',
        });
    }

    const updated = await prisma.challenge.update({
        where: { id: req.params.id },
        data: {
            checkIns: {
                push: new Date(),
            },
        },
    });

    res.json({
        success: true,
        data: { challenge: updated },
    });
}));

// DELETE /api/user/challenges/:id
router.delete('/challenges/:id', asyncHandler(async (req: AuthRequest, res: Response) => {
    const challenge = await prisma.challenge.findFirst({
        where: {
            id: req.params.id,
            userId: req.user!.id,
        },
    });

    if (!challenge) {
        return res.status(404).json({
            success: false,
            error: 'Challenge not found',
        });
    }

    await prisma.challenge.delete({
        where: { id: req.params.id },
    });

    res.json({
        success: true,
        message: 'Challenge deleted',
    });
}));

export default router;
