/**
 * Custom HTTP Error class for consistent error handling
 */
export class HttpError extends Error {
  statusCode: number;
  errors?: Record<string, string[]> | string[];

  /**
   * Create a new HTTP error
   * @param statusCode HTTP status code
   * @param message Error message
   * @param errors Optional validation errors
   */
  constructor(
    statusCode: number, 
    message: string, 
    errors?: Record<string, string[]> | string[]
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Create a 400 Bad Request error
   */
  static BadRequest(message = 'Bad Request', errors?: Record<string, string[]> | string[]) {
    return new HttpError(400, message, errors);
  }

  /**
   * Create a 401 Unauthorized error
   */
  static Unauthorized(message = 'Unauthorized') {
    return new HttpError(401, message);
  }

  /**
   * Create a 403 Forbidden error
   */
  static Forbidden(message = 'Forbidden') {
    return new HttpError(403, message);
  }

  /**
   * Create a 404 Not Found error
   */
  static NotFound(message = 'Resource not found') {
    return new HttpError(404, message);
  }

  /**
   * Create a 409 Conflict error
   */
  static Conflict(message = 'Conflict') {
    return new HttpError(409, message);
  }

  /**
   * Create a 422 Unprocessable Entity error
   */
  static UnprocessableEntity(message = 'Validation failed', errors?: Record<string, string[]> | string[]) {
    return new HttpError(422, message, errors);
  }

  /**
   * Create a 500 Internal Server Error
   */
  static InternalServerError(message = 'Internal server error') {
    return new HttpError(500, message);
  }
}