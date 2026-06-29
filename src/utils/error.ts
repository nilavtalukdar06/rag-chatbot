export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly success: boolean;
  public readonly message: string;
  public readonly errors?: unknown;
  constructor(
    statusCode: number,
    success: boolean,
    message: string,
    errors?: unknown,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.success = success;
    this.message = message;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}
