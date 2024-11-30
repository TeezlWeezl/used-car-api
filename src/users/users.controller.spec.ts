import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth/auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      find: (email: string) =>
        Promise.resolve([{ id: 1, email, password: 'abc' } as User]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
      findOne: (id: number) =>
        Promise.resolve({
          id,
          email: 'abc@abc.com',
          password: 'abc',
        } as User),
      // remove: (id: number) => {
      //   return Promise.resolve({
      //     id,
      //     email: 'abc@abc.com',
      //     password: 'abc',
      //   } as User);
      // },
      // update: (id: number, userAttr: Partial<User>) =>
      //   Promise.resolve({ id, email: 'abc@abc.com', password: 'abc' } as User),
    };
    fakeAuthService = {
      // signup: () => {},
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();
    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('abc@abc.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('abc@abc.com');
  });

  it('findUser returns a single user with the given ID', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser returns an error if user with given id is not found', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fakeUsersService.findOne = (id: number) => Promise.resolve(null as User);
    await expect(controller.findUser('2')).rejects.toThrow(NotFoundException);
  });

  it('signin updates session object and returns user', async () => {
    const session = { userId: null };
    const user = await controller.authenticateUser(
      { email: 'abc@abc.com', password: 'abc' },
      session,
    );
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
