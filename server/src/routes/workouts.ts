import { Router, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { prisma } from '../index.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// All workout routes require authentication
router.use(authenticate);

// GET /api/workouts - Get all workouts for user
router.get('/', asyncHandler(async (req: AuthRequest, res: Response) => {
    const workouts = await prisma.workout.findMany({
        where: { userId: req.user!.id },
        include: {
            exercises: {
                include: {
                    exercise: true,
                },
                orderBy: { order: 'asc' },
            },
        },
        orderBy: { startTime: 'desc' },
    });

    res.json({
        success: true,
        data: { workouts },
    });
}));

// GET /api/workouts/:id - Get single workout
router.get('/:id', asyncHandler(async (req: AuthRequest, res: Response) => {
    const workout = await prisma.workout.findFirst({
        where: {
            id: req.params.id,
            userId: req.user!.id,
        },
        include: {
            exercises: {
                include: {
                    exercise: true,
                },
                orderBy: { order: 'asc' },
            },
        },
    });

    if (!workout) {
        return res.status(404).json({
            success: false,
            error: 'Workout not found',
        });
    }

    res.json({
        success: true,
        data: { workout },
    });
}));

// POST /api/workouts - Create new workout
router.post('/', [
    body('name').trim().isLength({ min: 1 }).withMessage('Workout name is required'),
    body('startTime').isISO8601().withMessage('Valid start time is required'),
], asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }

    const { name, startTime, endTime, duration, mood, energy, notes, exercises } = req.body;

    const workout = await prisma.workout.create({
        data: {
            userId: req.user!.id,
            name,
            startTime: new Date(startTime),
            endTime: endTime ? new Date(endTime) : null,
            duration,
            mood,
            energy,
            notes,
            exercises: exercises ? {
                create: exercises.map((ex: any, index: number) => ({
                    exerciseId: ex.exerciseId,
                    sets: ex.sets,
                    notes: ex.notes,
                    order: index,
                })),
            } : undefined,
        },
        include: {
            exercises: {
                include: {
                    exercise: true,
                },
                orderBy: { order: 'asc' },
            },
        },
    });

    // Update user stats
    await updateUserStats(req.user!.id, workout);

    res.status(201).json({
        success: true,
        data: { workout },
    });
}));

// PUT /api/workouts/:id - Update workout
router.put('/:id', asyncHandler(async (req: AuthRequest, res: Response) => {
    const { name, endTime, duration, mood, energy, notes } = req.body;

    // Verify ownership
    const existing = await prisma.workout.findFirst({
        where: { id: req.params.id, userId: req.user!.id },
    });

    if (!existing) {
        return res.status(404).json({
            success: false,
            error: 'Workout not found',
        });
    }

    const workout = await prisma.workout.update({
        where: { id: req.params.id },
        data: {
            name,
            endTime: endTime ? new Date(endTime) : undefined,
            duration,
            mood,
            energy,
            notes,
        },
        include: {
            exercises: {
                include: {
                    exercise: true,
                },
                orderBy: { order: 'asc' },
            },
        },
    });

    res.json({
        success: true,
        data: { workout },
    });
}));

// DELETE /api/workouts/:id - Delete workout
router.delete('/:id', asyncHandler(async (req: AuthRequest, res: Response) => {
    // Verify ownership
    const existing = await prisma.workout.findFirst({
        where: { id: req.params.id, userId: req.user!.id },
    });

    if (!existing) {
        return res.status(404).json({
            success: false,
            error: 'Workout not found',
        });
    }

    await prisma.workout.delete({
        where: { id: req.params.id },
    });

    res.json({
        success: true,
        message: 'Workout deleted',
    });
}));

// Helper to update user stats after workout
async function updateUserStats(userId: string, workout: any) {
    let totalReps = 0;
    let totalWeight = 0;
    let totalSets = 0;

    if (workout.exercises) {
        for (const we of workout.exercises) {
            if (Array.isArray(we.sets)) {
                for (const set of we.sets) {
                    totalSets++;
                    totalReps += set.reps || 0;
                    totalWeight += (set.weight || 0) * (set.reps || 0);
                }
            }
        }
    }

    await prisma.userStats.upsert({
        where: { userId },
        update: {
            totalWorkouts: { increment: 1 },
            totalExercises: { increment: workout.exercises?.length || 0 },
            totalSets: { increment: totalSets },
            totalReps: { increment: totalReps },
            totalWeight: { increment: totalWeight },
            lastWorkoutDate: new Date(),
        },
        create: {
            userId,
            totalWorkouts: 1,
            totalExercises: workout.exercises?.length || 0,
            totalSets,
            totalReps,
            totalWeight,
            lastWorkoutDate: new Date(),
        },
    });
}

export default router;
