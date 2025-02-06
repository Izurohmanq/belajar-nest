import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
// import * as httpMock from 'node-mocks-http'

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers:[UserService]
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should can say hello', async() => {
    const response = await controller.sayHello('Eko Khannedy')
    expect(response).toBe("hello Eko Khannedy")
  });

});
