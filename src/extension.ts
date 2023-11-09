import * as vscode from "vscode";

let previousBranch: string | undefined;

export async function activate(
  context: vscode.ExtensionContext
): Promise<void> {
  // Locate the Git repositories when activated
  const gitExtension =
    vscode.extensions.getExtension<any>("vscode.git")?.exports;
  const api = gitExtension?.getAPI(1);
  const repo = api?.repositories[0];

  // Initiate the previous branch
  previousBranch = repo?.state?.HEAD?.name || undefined;
  if (previousBranch) {
    updateCommitMessage(repo, previousBranch!);
  }
  // Monitor the Git repository for branch changes
  repo?.state.onDidChange(() => {
    try {
      // Check if the branch has been changed
      const currentBranch = repo?.state.HEAD.name;
      if (currentBranch !== previousBranch) {
        updateCommitMessage(repo, currentBranch!);
        previousBranch = currentBranch;
      }
    } catch (error) {
      // Log error for debugging
      logError(error);

      // Provide clear feedback to the user
      vscode.window.showErrorMessage(
        "An error occurred while updating the commit message."
      );
    }
  });

  // Handle deactivation (cleanup, if necessary)
  context.subscriptions.push({
    dispose: () => {
      // Example: Remove any temporary files or close connections if needed
    },
  });
}

// Function to update the commit message
function updateCommitMessage(repo: any, branchName: string): void {
  // Validate input (simplified example)
  if (typeof branchName !== "string" || !branchName.length) {
    throw new Error("Invalid branch name.");
  }

  // Set the commit message
  repo.inputBox.value = `${branchName}: `;
}

// Function to log errors (simplified example)
function logError(error: any): void {
  // Create or retrieve an output channel to log errors
  const outputChannel = vscode.window.createOutputChannel("My Extension Logs");
  outputChannel.appendLine(`[${new Date().toISOString()}] ${error.message}`);
  outputChannel.show();
}

export function deactivate(): void {
  // Cleanup on deactivation can be done here if necessary
}
