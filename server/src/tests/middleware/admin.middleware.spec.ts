import { Request, Response, NextFunction } from 'express';
import { requireAdmin } from '../../middleware/admin.middleware';
import { ForbiddenError } from '../../errors/ForbiddenError';

describe('requireAdmin Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
  });

  it('should call next() when user has ADMIN role', () => {
    mockRequest.user = {
      id: 'admin-uuid-123',
      email: 'admin@example.com',
      role: 'ADMIN',
    };

    requireAdmin(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
  });

  it('should throw ForbiddenError when user has USER role', () => {
    mockRequest.user = {
      id: 'user-uuid-123',
      email: 'user@example.com',
      role: 'USER',
    };

    expect(() => {
      requireAdmin(mockRequest as Request, mockResponse as Response, nextFunction);
    }).toThrow(ForbiddenError);

    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should throw ForbiddenError when user is not attached to request', () => {
    mockRequest.user = undefined;

    expect(() => {
      requireAdmin(mockRequest as Request, mockResponse as Response, nextFunction);
    }).toThrow(ForbiddenError);

    expect(nextFunction).not.toHaveBeenCalled();
  });
});
