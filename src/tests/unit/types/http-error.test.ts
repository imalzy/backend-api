import { HttpError } from '../../../types/error/error.type';

describe('HttpError', () => {
  describe('Constructor', () => {
    it('should create an HttpError with the given status code and message', () => {
      // Arrange & Act
      const error = new HttpError(400, 'Bad request');
      
      // Assert
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('Bad request');
      expect(error.errors).toBeUndefined();
    });
    
    it('should include validation errors when provided', () => {
      // Arrange
      const validationErrors = {
        email: ['Invalid email format'],
        password: ['Password is too short']
      };
      
      // Act
      const error = new HttpError(422, 'Validation failed', validationErrors);
      
      // Assert
      expect(error.statusCode).toBe(422);
      expect(error.message).toBe('Validation failed');
      expect(error.errors).toEqual(validationErrors);
    });
    
    it('should capture stack trace', () => {
      // Act
      const error = new HttpError(500, 'Server error');
      
      // Assert
      expect(error.stack).toBeDefined();
      expect(error.stack).toContain('HttpError');
    });
  });
  
  describe('Static methods', () => {
    it('BadRequest should create a 400 error', () => {
      // Act
      const error = HttpError.BadRequest('Invalid request data');
      
      // Assert
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('Invalid request data');
    });
    
    it('BadRequest should use default message when not provided', () => {
      // Act
      const error = HttpError.BadRequest();
      
      // Assert
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('Bad Request');
    });
    
    it('Unauthorized should create a 401 error', () => {
      // Act
      const error = HttpError.Unauthorized('Authentication required');
      
      // Assert
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('Authentication required');
    });
    
    it('Forbidden should create a 403 error', () => {
      // Act
      const error = HttpError.Forbidden('Not allowed');
      
      // Assert
      expect(error.statusCode).toBe(403);
      expect(error.message).toBe('Not allowed');
    });
    
    it('NotFound should create a 404 error', () => {
      // Act
      const error = HttpError.NotFound('User not found');
      
      // Assert
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe('User not found');
    });
    
    it('Conflict should create a 409 error', () => {
      // Act
      const error = HttpError.Conflict('Resource already exists');
      
      // Assert
      expect(error.statusCode).toBe(409);
      expect(error.message).toBe('Resource already exists');
    });
    
    it('UnprocessableEntity should create a 422 error with validation errors', () => {
      // Arrange
      const validationErrors = { name: ['Name is required'] };
      
      // Act
      const error = HttpError.UnprocessableEntity('Validation failed', validationErrors);
      
      // Assert
      expect(error.statusCode).toBe(422);
      expect(error.message).toBe('Validation failed');
      expect(error.errors).toEqual(validationErrors);
    });
    
    it('InternalServerError should create a 500 error', () => {
      // Act
      const error = HttpError.InternalServerError('Something went wrong');
      
      // Assert
      expect(error.statusCode).toBe(500);
      expect(error.message).toBe('Something went wrong');
    });
  });
});