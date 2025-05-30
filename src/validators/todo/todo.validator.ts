import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../../types/error/error.type';

/**
 * Extract validation errors from a request
 */
const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // Format validation errors
    const formattedErrors: Record<string, string[]> = {};
    
    errors.array().forEach((error) => {
      // Ensure error has path property
      if ('path' in error) {
        const field = error.path;
        const message = error.msg;
        
        if (!formattedErrors[field]) {
          formattedErrors[field] = [];
        }
        
        formattedErrors[field].push(message);
      }
    });
    
    throw HttpError.UnprocessableEntity('Validation failed', formattedErrors);
  }
  
  next();
};

/**
 * Validate ID parameter for todo endpoints
 */
export const validateId = [
  param('id')
    .isUUID()
    .withMessage('Invalid todo ID format')
    .notEmpty()
    .withMessage('Todo ID is required'),
  handleValidationErrors,
];

/**
 * Validate create todo request body
 */
export const validateCreateTodo = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Title must be between 2 and 100 characters'),
  handleValidationErrors,
];

/**
 * Validate update todo request body
 */
export const validateUpdateTodo = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty if provided')
    .isLength({ min: 2, max: 100 })
    .withMessage('Title must be between 2 and 100 characters'),
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be a boolean value'),
  handleValidationErrors,
];