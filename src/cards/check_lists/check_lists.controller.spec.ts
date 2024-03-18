import { Test, TestingModule } from "@nestjs/testing";
import { CheckListsController } from "./check_lists.controller";
import { CheckListsService } from "./check_lists.service";

describe("CheckListsController", () => {
  let controller: CheckListsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CheckListsController],
      providers: [CheckListsService],
    }).compile();

    controller = module.get<CheckListsController>(CheckListsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
