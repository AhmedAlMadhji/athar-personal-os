"use client";

import { Component, type ReactNode } from "react";
import { isChunkLoadError, reloadForStaleChunks } from "@/lib/chunkError";

interface Props {
  children: ReactNode;
  fallbackTitle: string;
  fallbackDescription: string;
  retryLabel: string;
  reloadLabel: string;
}

interface State {
  hasError: boolean;
  isChunk: boolean;
}

export class ClientErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, isChunk: false };

  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      isChunk: isChunkLoadError(error),
    };
  }

  componentDidCatch(error: unknown) {
    console.error("[client-error-boundary]", error);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, isChunk: false });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const {
      fallbackTitle,
      fallbackDescription,
      retryLabel,
      reloadLabel,
    } = this.props;

    return (
      <div className="mx-auto flex min-h-[40vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {fallbackTitle}
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {fallbackDescription}
        </p>
        <button
          type="button"
          onClick={
            this.state.isChunk ? reloadForStaleChunks : this.handleRetry
          }
          className="rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-indigo-700"
        >
          {this.state.isChunk ? reloadLabel : retryLabel}
        </button>
      </div>
    );
  }
}
