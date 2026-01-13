import React from 'react';
import { Typography } from '../components/common/Typography.tsx';
import { Button } from '../components/common/Button.tsx';

interface ErrorBoundaryProps {
  children?: React.ReactNode;
  fallbackRender?: (props: { error: Error; reset: () => void }) => React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

const isDev = import.meta.env.DEV;

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, State> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  resetError = () => {
    this.setState({ hasError: false });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  render() {
    const { hasError, error } = this.state;
    const { fallbackRender, children } = this.props;
    if (hasError && error) {
      if (fallbackRender) {
        return fallbackRender({
          error,
          reset: this.resetError,
        });
      }

      return (
        <div className="p-10 text-center flex flex-col items-center justify-center h-dvh bg-gray-200">
          <div className="text-4xl mb-4">🚨</div>

          <Typography variant="h2" color="error" className="mb-2 font-bold">
            앗! 오류가 발생했어요
          </Typography>

          <Typography variant="body" color="muted" className="mb-8 max-w-md break-keep">
            일시적인 오류일 수 있습니다.
            <br />
            다시 시도하거나 이전 페이지로 이동해 주세요.
          </Typography>

          {isDev && this.state.error && (
            <div className="w-full max-w-lg p-4 mb-8 text-xs text-left text-red-600 bg-red-50 rounded border border-red-100 overflow-auto max-h-40">
              <p className="font-bold mb-1">[개발자 모드 에러 상세]</p>
              <code className="font-mono">{this.state.error.message}</code>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-none justify-center">
            <Button
              onClick={this.handleGoBack}
              variant="secondary"
              size="md"
              className="w-full sm:w-auto bg-gray-200 rounded-sm"
            >
              이전 페이지
            </Button>

            <Button
              onClick={this.handleReload}
              size="md"
              className="w-full sm:w-auto text-gray-500 hover:text-gray-700 bg-white rounded-sm"
            >
              새로고침
            </Button>
          </div>
        </div>
      );
    }

    return children;
  }
}
