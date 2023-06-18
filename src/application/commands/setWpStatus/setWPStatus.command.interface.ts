import { WP } from "op-client";

export default interface SetWPStatusCommand {
  setWPStatus(wp: WP): Promise<void>;
}
