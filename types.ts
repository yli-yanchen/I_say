import axios, { AxiosError } from 'axios';

// 基础错误响应结构
export interface ApiErrorResponse<T = unknown> {
  statusCode: number;
  message: string;
  error?: string;
  details?: T;
  timestamp?: string;
}

// Axios错误扩展类型
export type ApiAxiosError<T = unknown> = AxiosError<ApiErrorResponse<T>>;

// 自定义错误类型
export type AppError =
  | ApiAxiosError
  | Error
  | { message: string; code?: string }
  | string
  | unknown;

// 类型守卫
export function isApiAxiosError<T = unknown>(
  error: unknown
): error is ApiAxiosError<T> {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as AxiosError).isAxiosError
  );
}

export function isNativeError(error: unknown): error is Error {
  return error instanceof Error;
}

export function isErrorWithMessage(
  error: unknown
): error is { message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  );
}

// 错误处理工具类型
export type ErrorHandlerConfig = {
  showAlert?: boolean;
  logToConsole?: boolean;
};

// 错误元数据类型
export interface ErrorMeta {
  component?: string;
  operation?: string;
  input?: Record<string, unknown>;
}
