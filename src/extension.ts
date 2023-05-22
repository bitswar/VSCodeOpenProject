import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "openproject" is now active!');
  
	let disposable = vscode.commands.registerCommand('openproject.auth', () => {
		vscode.window.showInputBox({ignoreFocusOut: true, password: true, prompt: "API token", title: "OpenProject API token"}).then(token => {
      if (token) {vscode.window.showInformationMessage(`Hello, ${token}!`);}
    });
	});
	context.subscriptions.push(disposable);
}
export function deactivate() {}
