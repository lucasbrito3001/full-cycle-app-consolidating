import { Outcome } from 'src/domain/outcome/outcome.domain';
import { User } from 'src/domain/user/user.domain';
import { Categories } from './enums';

export const spySave = jest.fn();
export const spyFind = jest.fn();
export const spyConnect = jest.fn();
export const spyRelease = jest.fn();
export const spyFindByEmail = jest.fn();
export const spyFindByUser = jest.fn();
export const spyFindByUUID = jest.fn();
export const spyFindById = jest.fn();
export const spyHash = jest.fn();
export const spyCompareHash = jest.fn();
export const spyFromEntity = jest.fn();

export const mockDataSource = {
  createQueryRunner: () => ({
    connect: spyConnect,
    release: spyRelease,
    manager: {
      save: spySave,
      find: spyFind,
    },
  }),
};

export const mockUserRepository = {
  save: spySave,
  findByEmail: spyFindByEmail,
  findByUUID: spyFindByUUID,
};

export const mockOutcomeRepository = {
  save: spySave,
  findByUser: spyFindByUser,
  findById: spyFindById,
};

export const mockUser = User.create({
  email: 'test@example.com',
  familyIncome: 1000,
  name: 'John Doe',
  password: 'mockpass',
});

export const mockOutcome = Outcome.create({
  category: Categories.Essential,
  description: 'House rent',
  value: 550,
});

export const mockOutcomeTests = {
  category: Categories.Essential,
  description: 'House rent',
  value: 550,
  date: new Date().toISOString().substring(0, 10),
};

export const mockUserEntity = User.create({
  email: 'test@example.com',
  familyIncome: 1000,
  name: 'John Doe',
});
