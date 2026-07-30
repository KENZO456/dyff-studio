"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
  fallback: ReactNode;
}

interface State {
  hasError: boolean;
}

export class WebGLErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("WebGL error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export function WebGLFallback({ className }: { className?: string }) {
  return (
    <div className={className} style={{ backgroundColor: "#080808" }}>
      {/* Fallback styling for DYFF green */}
      <div 
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at center, rgba(153, 202, 69, 0.15), transparent 70%)"
        }}
      />
    </div>
  );
}
