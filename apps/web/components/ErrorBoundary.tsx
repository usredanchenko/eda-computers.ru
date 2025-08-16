'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Логирование ошибки
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Вызов пользовательского обработчика ошибок
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Отправка ошибки в систему мониторинга (если есть)
    this.reportError(error, errorInfo);
  }

  private reportError(error: Error, errorInfo: ErrorInfo) {
    // Здесь можно добавить интеграцию с системами мониторинга
    // например, Sentry, LogRocket, etc.
    
    // Пример отправки в консоль для разработки
    if (process.env.NODE_ENV === 'development') {
      console.group('Error Details');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Пользовательский fallback
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Стандартный fallback
      return (
        <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full glass-card p-8 text-center"
          >
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-white mb-4">
              Что-то пошло не так
            </h1>
            <p className="text-gray-300 mb-6">
              Произошла непредвиденная ошибка. Мы уже работаем над её устранением.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="text-neon-cyan cursor-pointer mb-2">
                  Детали ошибки (только для разработки)
                </summary>
                <div className="bg-dark-800 p-4 rounded-lg text-sm text-gray-400 overflow-auto max-h-40">
                  <div className="mb-2">
                    <strong>Ошибка:</strong> {this.state.error.message}
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Компонент:</strong>
                      <pre className="mt-1 text-xs">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            <div className="space-y-3">
              <motion.button
                onClick={this.handleRetry}
                className="w-full neon-button py-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🔄 Попробовать снова
              </motion.button>
              
              <motion.button
                onClick={this.handleReload}
                className="w-full py-3 text-gray-400 hover:text-neon-cyan transition-colors border border-gray-600 rounded-lg hover:border-neon-cyan"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🔄 Перезагрузить страницу
              </motion.button>
            </div>

            <div className="mt-6 text-sm text-gray-500">
              Если проблема повторяется, обратитесь в поддержку
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Хук для обработки ошибок в функциональных компонентах
export function useErrorHandler() {
  const handleError = React.useCallback((error: Error, context?: string) => {
    console.error(`Error in ${context || 'component'}:`, error);
    
    // Здесь можно добавить отправку ошибки в систему мониторинга
    if (process.env.NODE_ENV === 'development') {
      console.group('Error Context');
      console.error('Context:', context);
      console.error('Error:', error);
      console.error('Stack:', error.stack);
      console.groupEnd();
    }
  }, []);

  return handleError;
}

// Компонент для отображения ошибок загрузки
export function LoadingError({ 
  error, 
  onRetry 
}: { 
  error: string; 
  onRetry?: () => void; 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-8"
    >
      <div className="text-4xl mb-4">❌</div>
      <h3 className="text-xl font-bold text-white mb-2">
        Ошибка загрузки
      </h3>
      <p className="text-gray-300 mb-4">{error}</p>
      {onRetry && (
        <motion.button
          onClick={onRetry}
          className="neon-button px-6 py-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🔄 Попробовать снова
        </motion.button>
      )}
    </motion.div>
  );
}
