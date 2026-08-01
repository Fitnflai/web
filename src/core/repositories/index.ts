import { MockBiometricRepository } from './mocks/MockBiometricRepository';
import { MockNutritionRepository } from './mocks/MockNutritionRepository';
import { MockCommentRepository } from './mocks/MockCommentRepository';
import { MockWorkoutRepository } from './mocks/MockWorkoutRepository';

export const repositories = {
  biometrics: new MockBiometricRepository(),
  nutrition: new MockNutritionRepository(),
  comments: new MockCommentRepository(),
  workouts: new MockWorkoutRepository()
};

export const useRepositories = () => repositories;
