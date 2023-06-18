import { injectable } from "inversify";
import OpenProjectTreeDataProvider from "../openProject.treeDataProvider.interface";

@injectable()
export default class OpenProjectTreeDataProviderImpl
  implements OpenProjectTreeDataProvider
{
  redraw = jest.fn();

  refresh = jest.fn();

  onDidChangeTreeData = jest.fn();

  refreshWPs = jest.fn();

  getTreeItem = jest.fn();

  getChildren = jest.fn();

  getParent = jest.fn();

  resolveTreeItem = jest.fn();
}
