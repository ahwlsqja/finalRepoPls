import { Test, TestingModule } from "@nestjs/testing";
import { CheckListsController } from "./checkLists.controller";
import { CheckListsService } from "./checkLists.service";

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
