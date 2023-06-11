/* eslint-disable max-classes-per-file */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/naming-convention */

import type { window as vscodeWindow } from "vscode";

class Disposable {}

class EventEmitter {
  fire = jest.fn();

  event = jest.fn();
}

const languages = {
  createDiagnosticCollection: jest.fn(),
};

const StatusBarAlignment = {};

const windowMocked: typeof vscodeWindow = {
  createStatusBarItem: jest.fn(() => ({
    show: jest.fn(),
  })),
  showErrorMessage: jest.fn(),
  showWarningMessage: jest.fn(),
  showInformationMessage: jest.fn(),
  createTextEditorDecorationType: jest.fn(),
  createTreeView: jest.fn(),
  createInputBox: jest.fn(),
  showInputBox: jest.fn(),
  showQuickPick: jest.fn(),
} as any;

const workspace = {
  getConfiguration: jest.fn(),
  workspaceFolders: [],
  onDidSaveTextDocument: jest.fn(),
};

const OverviewRulerLane = {
  Left: null,
};

const Uri = {
  file: (f: any) => f,
  parse: jest.fn(),
};
const Diagnostic = jest.fn();
const DiagnosticSeverity = { Error: 0, Warning: 1, Information: 2, Hint: 3 };

const debug = {
  onDidTerminateDebugSession: jest.fn(),
  startDebugging: jest.fn(),
};
const RangeMocked = jest.fn();

const commands = {
  executeCommand: jest.fn(),
  registerCommand: jest.fn(),
};

const TreeItemCollapsibleState = {
  None: 0,
  Collapsed: 1,
  Expanded: 2,
};

export {
  Diagnostic,
  DiagnosticSeverity,
  Disposable,
  EventEmitter,
  OverviewRulerLane,
  RangeMocked as Range,
  StatusBarAlignment,
  TreeItemCollapsibleState,
  Uri,
  commands,
  debug,
  languages,
  windowMocked as window,
  workspace,
};
