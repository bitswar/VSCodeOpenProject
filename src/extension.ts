import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "openproject" is now active!');
  
	let disposable = vscode.commands.registerCommand('openproject.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from OpenProject!');
	});

	context.subscriptions.push(disposable);
}
export function deactivate() {}
