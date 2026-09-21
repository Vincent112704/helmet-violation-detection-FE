import React from "react";

interface ErrorMessageProps {
  message?: string;
  title?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message = "An unexpected error occurred. Please try again.",
  title = "Error",
}) => {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300">
      <div className="flex items-start gap-3">
        {/* Warning / Error Icon */}
        <svg
          className="h-5 w-5 shrink-0 text-red-500 dark:text-red-400 mt-0.5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>

        <div className="space-y-1">
          {title && <h3 className="font-medium leading-none">{title}</h3>}
          <p className="text-sm opacity-90">{message}</p>
        </div>
      </div>
    </div>
  );
};