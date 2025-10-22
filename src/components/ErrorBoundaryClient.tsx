"use client";

import React from "react";

type State = { hasError: boolean; error?: Error };

export default class ErrorBoundaryClient extends React.Component<
  {
    children: React.ReactNode;
  },
  State
> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Unhandled error in client boundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          role="alertdialog"
        >
          <div className="max-w-lg w-full bg-white dark:bg-slate-900 border border-red-200 dark:border-red-700 rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-red-700 dark:text-red-400">
              Something went wrong
            </h2>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
              An unexpected error occurred. Please reload the page or try again
              later.
            </p>
            <div className="mt-4 flex gap-3">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => window.location.reload()}
              >
                Reload
              </button>
              <button
                className="px-4 py-2 border rounded border-slate-200 dark:border-slate-700"
                onClick={() =>
                  this.setState({ hasError: false, error: undefined })
                }
              >
                Dismiss
              </button>
            </div>
            <details className="mt-4 text-xs text-slate-500 dark:text-slate-400">
              <summary className="cursor-pointer">Error details</summary>
              <pre className="whitespace-pre-wrap mt-2 text-xs">
                {String(this.state.error?.message ?? "No details")}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}
