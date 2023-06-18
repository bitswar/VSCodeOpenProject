jest.mock("../../quickPicks/wpStatus/wpStatus.quickPick");
jest.mock("../../views/openProject.treeDataProvider");
jest.mock("../../../infrastructure/openProject/openProject.client");
import { Status, WP } from "op-client";
import container from "../../../DI/container";
import TOKENS from "../../../DI/tokens";
import WPStatus from "../../../infrastructure/openProject/wpStatus.enum";
import WPRepository from "../../../infrastructure/workPackage/wp.repository.interface";
import WPStatusQuickPick from "../../quickPicks/wpStatus/wpStatus.quickPick";
import SetWPStatusCommandImpl from "./setWPStatus.command";

describe("SetWPStatusCommand test suit", () => {
  let command: SetWPStatusCommandImpl;
  let repository: WPRepository;

  beforeEach(() => {
    command = container.get<SetWPStatusCommandImpl>(TOKENS.setWPStatusCommand);
    repository = container.get<WPRepository>(TOKENS.wpRepository);
  });

  describe("setWPStatus", () => {
    it("should show wpStatusQuickPick", async () => {
      jest.spyOn(WPStatusQuickPick.prototype, "show");

      await command.setWPStatus(new WP(1));

      expect(WPStatusQuickPick.prototype.show).toHaveBeenCalled();
    });
    it("should set wp this new", async () => {
      const wp = new WP(1);
      const status = new Status(1);

      jest.spyOn(WPStatusQuickPick.prototype, "show").mockResolvedValue(status);
      jest.spyOn(repository, "save").mockResolvedValue(wp);

      await command.setWPStatus(wp);

      expect(wp.status).toEqual(status);
    });
    it("should save wp", async () => {
      const wp = new WP(1);

      jest
        .spyOn(WPStatusQuickPick.prototype, "show")
        .mockResolvedValue(WPStatus.closed);
      jest.spyOn(repository, "save").mockResolvedValue(wp);

      await command.setWPStatus(wp);

      expect(repository.save).toHaveBeenLastCalledWith(wp);
    });
    it("should show success message", async () => {
      const wp = new WP(1);

      jest
        .spyOn(WPStatusQuickPick.prototype, "show")
        .mockResolvedValue(WPStatus.closed);
      jest.spyOn(repository, "save").mockResolvedValue(wp);
      jest.spyOn(command as any, "showSuccessMessage");

      await command.setWPStatus(wp);

      expect(command["showSuccessMessage"]).toHaveBeenCalled();
    });
    it("should show failure message", async () => {
      const wp = new WP(1);
      const err = new Error();

      jest
        .spyOn(WPStatusQuickPick.prototype, "show")
        .mockResolvedValue(WPStatus.closed);
      jest.spyOn(repository, "save").mockRejectedValue(err);
      jest.spyOn(command as any, "showFailureMessage");

      await command.setWPStatus(wp);

      expect(command["showFailureMessage"]).toHaveBeenLastCalledWith(err);
    });
  });
});
