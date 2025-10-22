"use client";

import Link from "next/link";

export default function RootError({ error }: { error: Error }) {
  console.error("Unhandled server error:", error);
  return (
    <html>
      <body>
        <div
          className="min-h-screen flex items-center justify-center p-6"
          role="alert"
          aria-live="assertive"
        >
          <div className="max-w-lg w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow p-6">
            <h1 className="text-2xl font-semibold">Something went wrong</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              An unexpected error occurred while rendering this page.
            </p>
            <div className="mt-4 flex gap-3">
              <button
                className="px-4 py-2 bg-slate-100 rounded hover:bg-slate-200"
                onClick={() => location.reload()}
              >
                Reload
              </button>
              <Link
                href="/"
                className="px-4 py-2 border rounded border-slate-200 hover:bg-slate-50"
              >
                Home
              </Link>
            </div>
            <details className="mt-4 text-xs text-slate-500 dark:text-slate-400">
              <summary className="cursor-pointer">Error details</summary>
              <pre className="whitespace-pre-wrap mt-2 text-xs">
                {String(error.message)}
              </pre>
            </details>
          </div>
        </div>
      </body>
    </html>
  );
}
