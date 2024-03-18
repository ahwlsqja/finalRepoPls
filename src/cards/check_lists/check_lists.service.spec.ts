import { Test, TestingModule } from '@nestjs/testing';
import { CheckListsService } from './check_lists.service';

describe('CheckListsService', () => {
  let service: CheckListsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CheckListsService],
    }).compile();

    service = module.get<CheckListsService>(CheckListsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
