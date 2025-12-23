export class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

export class AuthError extends ApiError {
  constructor(message: string, statusCode: number) {
    super(message, statusCode);
    this.name = 'AuthError';
  }
}

export class TripError extends ApiError {
  constructor(message: string, statusCode: number) {
    super(message, statusCode);
    this.name = 'TripError';
  }
}

export class EventError extends ApiError {
  constructor(message: string, statusCode: number) {
    super(message, statusCode);
    this.name = 'EventError';
  }
}

export class UserError extends ApiError {
  constructor(message: string, statusCode: number) {
    super(message, statusCode);
    this.name = 'UserError';
  }
}
