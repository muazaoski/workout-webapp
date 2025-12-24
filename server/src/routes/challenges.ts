import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../index.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// All challenge routes require authentication
router.use(authenticate);

// GET /api/challenges - Get all public challenges + user's own challenges
router.get('/', asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;

    const challenges = await prisma.challenge.findMany({
        where: {
            OR: [
                { isPublic: true },
                { creatorId: userId },
                { participants: { some: { userId } } }
            ]
        },
        include: {
            creator: {
                select: { id: true, name: true }
            },
            participants: {
                select: {
                    userId: true,
                    user: { select: { name: true } },
                    joinedAt: true
                }
            },
            _count: {
                select: { participants: true, logs: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    // Get user's logs for each challenge
    const challengesWithUserLogs = await Promise.all(
        challenges.map(async (c) => {
            const userLogs = await prisma.challengeLog.findMany({
                where: { challengeId: c.id, userId },
                orderBy: { createdAt: 'desc' }
            });
            const userTotal = userLogs.reduce((sum, log) => sum + log.value, 0);

            return {
                ...c,
                isCreator: c.creatorId === userId,
                isParticipant: c.participants.some(p => p.userId === userId),
                userLogs,
                userTotal
            };
        })
    );

    res.json({
        success: true,
        data: { challenges: challengesWithUserLogs }
    });
}));

// POST /api/challenges - Create a new challenge
router.post('/', [
    body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Name is required (max 100 chars)'),
    body('description').optional().trim().isLength({ max: 500 }),
    body('targetValue').optional().isInt({ min: 1, max: 1000 }),
    body('isPublic').optional().isBoolean(),
    body('startDate').optional().isISO8601(),
    body('endDate').optional().isISO8601(),
], asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    const { name, description, targetValue, isPublic, startDate, endDate, icon, color } = req.body;

    const challenge = await prisma.challenge.create({
        data: {
            creatorId: req.user!.id,
            name,
            description,
            targetValue: targetValue || 30,
            isPublic: isPublic || false,
            startDate: startDate ? new Date(startDate) : new Date(),
            endDate: endDate ? new Date(endDate) : null,
            icon,
            color,
            // Creator automatically joins
            participants: {
                create: { userId: req.user!.id }
            }
        },
        include: {
            creator: { select: { id: true, name: true } },
            participants: true
        }
    });

    res.status(201).json({
        success: true,
        data: { challenge }
    });
}));

// PUT /api/challenges/:id - Update challenge (creator only)
router.put('/:id', [
    body('name').optional().trim().isLength({ min: 1, max: 100 }),
    body('description').optional().trim().isLength({ max: 500 }),
    body('targetValue').optional().isInt({ min: 1, max: 1000 }),
    body('isPublic').optional().isBoolean(),
], asyncHandler(async (req: AuthRequest, res: Response) => {
    const challenge = await prisma.challenge.findFirst({
        where: {
            id: req.params.id,
            creatorId: req.user!.id // Only creator can edit
        }
    });

    if (!challenge) {
        return res.status(404).json({
            success: false,
            error: 'Challenge not found or you are not the creator'
        });
    }

    const { name, description, targetValue, isPublic, isActive, icon, color } = req.body;

    const updated = await prisma.challenge.update({
        where: { id: req.params.id },
        data: {
            ...(name && { name }),
            ...(description !== undefined && { description }),
            ...(targetValue && { targetValue }),
            ...(isPublic !== undefined && { isPublic }),
            ...(isActive !== undefined && { isActive }),
            ...(icon && { icon }),
            ...(color && { color })
        }
    });

    res.json({
        success: true,
        data: { challenge: updated }
    });
}));

// DELETE /api/challenges/:id - Delete challenge (creator only)
router.delete('/:id', asyncHandler(async (req: AuthRequest, res: Response) => {
    const challenge = await prisma.challenge.findFirst({
        where: {
            id: req.params.id,
            creatorId: req.user!.id // Only creator can delete
        }
    });

    if (!challenge) {
        return res.status(404).json({
            success: false,
            error: 'Challenge not found or you are not the creator'
        });
    }

    await prisma.challenge.delete({
        where: { id: req.params.id }
    });

    res.json({
        success: true,
        message: 'Challenge deleted'
    });
}));

// POST /api/challenges/:id/join - Join a challenge
router.post('/:id/join', asyncHandler(async (req: AuthRequest, res: Response) => {
    const challenge = await prisma.challenge.findFirst({
        where: { id: req.params.id, isActive: true }
    });

    if (!challenge) {
        return res.status(404).json({
            success: false,
            error: 'Challenge not found or not active'
        });
    }

    // Check if already a participant
    const existing = await prisma.challengeParticipant.findUnique({
        where: {
            challengeId_userId: {
                challengeId: req.params.id,
                userId: req.user!.id
            }
        }
    });

    if (existing) {
        return res.json({
            success: true,
            message: 'Already joined',
            data: { participant: existing }
        });
    }

    const participant = await prisma.challengeParticipant.create({
        data: {
            challengeId: req.params.id,
            userId: req.user!.id
        }
    });

    res.status(201).json({
        success: true,
        data: { participant }
    });
}));

// DELETE /api/challenges/:id/leave - Leave a challenge
router.delete('/:id/leave', asyncHandler(async (req: AuthRequest, res: Response) => {
    const challenge = await prisma.challenge.findFirst({
        where: { id: req.params.id }
    });

    if (!challenge) {
        return res.status(404).json({
            success: false,
            error: 'Challenge not found'
        });
    }

    // Creator cannot leave their own challenge
    if (challenge.creatorId === req.user!.id) {
        return res.status(400).json({
            success: false,
            error: 'Creator cannot leave their own challenge. Delete it instead.'
        });
    }

    await prisma.challengeParticipant.deleteMany({
        where: {
            challengeId: req.params.id,
            userId: req.user!.id
        }
    });

    // Also delete user's logs for this challenge
    await prisma.challengeLog.deleteMany({
        where: {
            challengeId: req.params.id,
            userId: req.user!.id
        }
    });

    res.json({
        success: true,
        message: 'Left challenge'
    });
}));

// POST /api/challenges/:id/log - Add a log entry (+1 or -1)
router.post('/:id/log', [
    body('value').isInt({ min: -100, max: 100 }).withMessage('Value must be between -100 and 100'),
    body('note').optional().trim().isLength({ max: 200 })
], asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    // Check if user is a participant
    const participant = await prisma.challengeParticipant.findUnique({
        where: {
            challengeId_userId: {
                challengeId: req.params.id,
                userId: req.user!.id
            }
        }
    });

    if (!participant) {
        return res.status(403).json({
            success: false,
            error: 'You must join the challenge first'
        });
    }

    const { value, note } = req.body;

    const log = await prisma.challengeLog.create({
        data: {
            challengeId: req.params.id,
            userId: req.user!.id,
            value,
            note
        }
    });

    // Get updated total for user
    const userLogs = await prisma.challengeLog.findMany({
        where: { challengeId: req.params.id, userId: req.user!.id }
    });
    const userTotal = userLogs.reduce((sum, l) => sum + l.value, 0);

    res.status(201).json({
        success: true,
        data: { log, userTotal }
    });
}));

// GET /api/challenges/:id/logs - Get user's logs for a challenge
router.get('/:id/logs', asyncHandler(async (req: AuthRequest, res: Response) => {
    const logs = await prisma.challengeLog.findMany({
        where: {
            challengeId: req.params.id,
            userId: req.user!.id
        },
        orderBy: { createdAt: 'desc' }
    });

    const total = logs.reduce((sum, log) => sum + log.value, 0);

    res.json({
        success: true,
        data: { logs, total }
    });
}));

// GET /api/challenges/:id/leaderboard - Get leaderboard (total logs per participant)
router.get('/:id/leaderboard', asyncHandler(async (req: AuthRequest, res: Response) => {
    const participants = await prisma.challengeParticipant.findMany({
        where: { challengeId: req.params.id },
        include: {
            user: { select: { id: true, name: true } }
        }
    });

    const leaderboard = await Promise.all(
        participants.map(async (p) => {
            const logs = await prisma.challengeLog.findMany({
                where: { challengeId: req.params.id, userId: p.userId }
            });
            const total = logs.reduce((sum, log) => sum + log.value, 0);
            return {
                userId: p.userId,
                userName: p.user.name,
                total,
                joinedAt: p.joinedAt
            };
        })
    );

    // Sort by total (descending)
    leaderboard.sort((a, b) => b.total - a.total);

    res.json({
        success: true,
        data: { leaderboard }
    });
}));

export default router;
