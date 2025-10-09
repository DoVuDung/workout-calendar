// Export all workout-related hooks organized by HTTP action

// GET operations (Queries)
export { 
  useWorkout, 
  useWorkoutsForDay,
  workoutKeys 
} from './useWorkoutQueries';

// POST operations (Create Mutations)
export { 
  useCreateWorkout 
} from './useWorkoutCreateMutations';

// PUT operations (Update Mutations)
export { 
  useUpdateWorkout,
  useMoveWorkout,
  useReorderWorkout,
  useMoveExercise 
} from './useWorkoutUpdateMutations';

// DELETE operations (Delete Mutations)
export { 
  useDeleteWorkout 
} from './useWorkoutDeleteMutations';
