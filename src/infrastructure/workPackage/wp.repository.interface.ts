import { WP } from "op-client";
import { Event } from "vscode";

export default interface WPRepository {
  save(wp: WP): Promise<WP>;
  findById(id: number): WP;
  findByParentId(parentId: number): WP[];
  findByProjectId(projectId: number): WP[];
  findAll(): WP[];
  refetch(): Promise<void>;
  onWPsChange: Event<void>;
}
