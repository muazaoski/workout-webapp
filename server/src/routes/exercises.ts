import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../index.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/exercises - Get all default exercises
router.get('/', asyncHandler(async (req: AuthRequest, res: Response) => {
    const exercises = await prisma.exercise.findMany({
        where: { isDefault: true },
        orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });

    res.json({
        success: true,
        data: { exercises },
    });
}));

// POST /api/exercises - Create custom exercise (requires auth)
router.post('/', authenticate, [
    body('name').trim().isLength({ min: 1 }).withMessage('Exercise name is required'),
    body('category').isIn(['strength', 'cardio', 'flexibility', 'balance', 'sports', 'functional'])
        .withMessage('Valid category is required'),
    body('muscleGroups').isArray().withMessage('Muscle groups must be an array'),
], asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }

    const { name, category, muscleGroups, instructions, icon } = req.body;

    const exercise = await prisma.exercise.create({
        data: {
            name,
            category,
            muscleGroups,
            instructions,
            icon,
            isDefault: false,
        },
    });

    res.status(201).json({
        success: true,
        data: { exercise },
    });
}));

// GET /api/exercises/:id
router.get('/:id', asyncHandler(async (req: AuthRequest, res: Response) => {
    const exercise = await prisma.exercise.findUnique({
        where: { id: req.params.id },
    });

    if (!exercise) {
        return res.status(404).json({
            success: false,
            error: 'Exercise not found',
        });
    }

    res.json({
        success: true,
        data: { exercise },
    });
}));

export default router;
