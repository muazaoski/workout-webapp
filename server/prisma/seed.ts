import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultExercises = [
    // Chest
    { name: 'Bench Press', category: 'strength', muscleGroups: ['chest', 'triceps', 'shoulders'], icon: '🏋️', isDefault: true },
    { name: 'Push-ups', category: 'strength', muscleGroups: ['chest', 'triceps', 'shoulders'], icon: '💪', isDefault: true },
    { name: 'Dumbbell Flyes', category: 'strength', muscleGroups: ['chest'], icon: '🦋', isDefault: true },
    { name: 'Incline Bench Press', category: 'strength', muscleGroups: ['chest', 'shoulders'], icon: '📐', isDefault: true },

    // Back
    { name: 'Pull-ups', category: 'strength', muscleGroups: ['back', 'biceps'], icon: '🧗', isDefault: true },
    { name: 'Lat Pulldown', category: 'strength', muscleGroups: ['back', 'biceps'], icon: '⬇️', isDefault: true },
    { name: 'Bent-over Row', category: 'strength', muscleGroups: ['back', 'biceps'], icon: '🚣', isDefault: true },
    { name: 'Deadlift', category: 'strength', muscleGroups: ['back', 'legs', 'glutes'], icon: '🏋️', isDefault: true },

    // Shoulders
    { name: 'Overhead Press', category: 'strength', muscleGroups: ['shoulders', 'triceps'], icon: '🙌', isDefault: true },
    { name: 'Lateral Raises', category: 'strength', muscleGroups: ['shoulders'], icon: '🦅', isDefault: true },
    { name: 'Front Raises', category: 'strength', muscleGroups: ['shoulders'], icon: '🎯', isDefault: true },

    // Arms
    { name: 'Bicep Curls', category: 'strength', muscleGroups: ['biceps'], icon: '💪', isDefault: true },
    { name: 'Tricep Dips', category: 'strength', muscleGroups: ['triceps'], icon: '⬇️', isDefault: true },
    { name: 'Hammer Curls', category: 'strength', muscleGroups: ['biceps', 'forearms'], icon: '🔨', isDefault: true },
    { name: 'Skull Crushers', category: 'strength', muscleGroups: ['triceps'], icon: '💀', isDefault: true },

    // Legs
    { name: 'Squats', category: 'strength', muscleGroups: ['legs', 'glutes', 'core'], icon: '🦵', isDefault: true },
    { name: 'Leg Press', category: 'strength', muscleGroups: ['legs', 'glutes'], icon: '🦿', isDefault: true },
    { name: 'Lunges', category: 'strength', muscleGroups: ['legs', 'glutes'], icon: '🚶', isDefault: true },
    { name: 'Leg Curls', category: 'strength', muscleGroups: ['legs'], icon: '🔄', isDefault: true },
    { name: 'Calf Raises', category: 'strength', muscleGroups: ['calves'], icon: '⬆️', isDefault: true },

    // Core
    { name: 'Plank', category: 'strength', muscleGroups: ['core'], icon: '📏', isDefault: true },
    { name: 'Crunches', category: 'strength', muscleGroups: ['core'], icon: '🔥', isDefault: true },
    { name: 'Russian Twists', category: 'strength', muscleGroups: ['core'], icon: '🌀', isDefault: true },
    { name: 'Leg Raises', category: 'strength', muscleGroups: ['core'], icon: '🦵', isDefault: true },

    // Cardio
    { name: 'Running', category: 'cardio', muscleGroups: ['legs', 'core'], icon: '🏃', isDefault: true },
    { name: 'Cycling', category: 'cardio', muscleGroups: ['legs'], icon: '🚴', isDefault: true },
    { name: 'Jump Rope', category: 'cardio', muscleGroups: ['legs', 'core'], icon: '🪢', isDefault: true },
    { name: 'Burpees', category: 'cardio', muscleGroups: ['chest', 'legs', 'core'], icon: '⚡', isDefault: true },

    // Flexibility
    { name: 'Stretching', category: 'flexibility', muscleGroups: ['legs', 'back'], icon: '🧘', isDefault: true },
    { name: 'Yoga', category: 'flexibility', muscleGroups: ['core', 'back', 'legs'], icon: '🧘‍♀️', isDefault: true },
];

async function main() {
    console.log('🌱 Seeding database...');

    // Clear existing default exercises
    await prisma.exercise.deleteMany({
        where: { isDefault: true },
    });

    // Create default exercises
    for (const exercise of defaultExercises) {
        await prisma.exercise.create({
            data: exercise,
        });
    }

    console.log(`✅ Created ${defaultExercises.length} default exercises`);
    console.log('🎉 Database seeding complete!');
}

main()
    .catch((e) => {
        console.error('Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
