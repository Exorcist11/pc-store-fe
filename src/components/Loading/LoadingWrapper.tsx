import { cn } from "@/lib/utils";
import React from "react";

interface LoadingWrapperProps {
  isLoading: boolean;
  overlay?: boolean;
  fullScreen?: boolean;
  text?: string;
  size?: "sm" | "md" | "lg";
  blurBackdrop?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export default function LoadingWrapper({
  isLoading,
  overlay = true,
  fullScreen = false,
  text,
  size = "md",
  blurBackdrop = true,
  children,
  className = "",
}: LoadingWrapperProps) {
  const spinnerSizeClass =
    size === "sm" ? "w-4 h-4" : size === "lg" ? "w-10 h-10" : "w-6 h-6";

  const overlayBase = fullScreen
    ? "fixed inset-0 z-[9999] flex items-center justify-center"
    : "absolute inset-0 z-50 flex items-center justify-center";

  return (
    <div className={`relative ${className}`}>
      {/* children */}
      <div
        className={`${
          isLoading && overlay ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        {children}
      </div>

      {!overlay && isLoading && (
        <div className="inline-flex items-center gap-2">
          <svg
            className={`${spinnerSizeClass} animate-spin`}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              className="opacity-20"
            />
            <path
              d="M22 12a10 10 0 00-10-10"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
          {text && (
            <span className="text-sm text-muted-foreground">{text}</span>
          )}
        </div>
      )}

      {/* Overlay loader */}
      {overlay && isLoading && (
        <div
          className={`${overlayBase} ${
            blurBackdrop && !fullScreen ? "backdrop-blur-sm" : ""
          }`}
          aria-live="polite"
          role="status"
        >
          <div
            className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl shadow-lg bg-white/90 dark:bg-slate-900/80 ${
              fullScreen ? "mx-4" : "max-w-xs"
            }`}
            style={{
              // subtle border blur fallback for older browsers
              backdropFilter: blurBackdrop
                ? "saturate(180%) blur(6px)"
                : "none",
            }}
          >
            <svg
              className={`${spinnerSizeClass} animate-spin text-sky-600`}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                className="opacity-20"
              />
              <path
                d="M22 12a10 10 0 00-10-10"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>

            {text ? (
              <div className="text-sm text-center text-slate-700 dark:text-slate-200">
                {text}
              </div>
            ) : (
              <div className="text-sm text-center text-slate-700 dark:text-slate-200">
                Đang xử lý...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
