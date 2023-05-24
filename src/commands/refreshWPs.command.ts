import OpenProjectTreeDataProvider from "../views/openProject.treeDataProvider";

export default function refreshWPs() {
  OpenProjectTreeDataProvider.getInstance().refreshWPs();
}
