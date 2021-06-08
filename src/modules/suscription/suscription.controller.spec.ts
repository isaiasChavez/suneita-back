import { Test, TestingModule } from '@nestjs/testing';
import { SuscriptionController } from './suscription.controller';

describe('SuscriptionController', () => {
  let controller: SuscriptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuscriptionController],
    }).compile();

    controller = module.get<SuscriptionController>(SuscriptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
