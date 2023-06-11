import { WP } from "op-client";
import { TreeDataProvider } from "vscode";

export default interface OpenProjectTreeDataProvider
  extends TreeDataProvider<WP> {
  refreshWPs: () => Promise<void>;
}
