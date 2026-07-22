import { Request, Response, NextFunction } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import * as jwtUtils from '../../utils/jwt';
import { UnauthorizedError } from '../../errors/UnauthorizedError';

describe('authenticateToken Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
  });

  it('should call next() and attach user to req when token is valid', () => {
    const mockUserPayload: jwtUtils.JwtPayload = {
      id: 'user-uuid-123',
      email: 'test@example.com',
      role: 'USER',
    };

    mockRequest.headers = {
      authorization: 'Bearer valid-jwt-token',
    };

    jest.spyOn(jwtUtils, 'verifyToken').mockReturnValue(mockUserPayload);

    authenticateToken(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(jwtUtils.verifyToken).toHaveBeenCalledWith('valid-jwt-token');
    expect(mockRequest.user).toEqual(mockUserPayload);
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should throw UnauthorizedError when authorization header is missing', () => {
    mockRequest.headers = {};

    expect(() => {
      authenticateToken(mockRequest as Request, mockResponse as Response, nextFunction);
    }).toThrow(UnauthorizedError);

    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedError when authorization header format is not Bearer', () => {
    mockRequest.headers = {
      authorization: 'Basic invalidformat',
    };

    expect(() => {
      authenticateToken(mockRequest as Request, mockResponse as Response, nextFunction);
    }).toThrow(UnauthorizedError);

    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedError when token is invalid or expired', () => {
    mockRequest.headers = {
      authorization: 'Bearer invalid-token',
    };

    jest.spyOn(jwtUtils, 'verifyToken').mockImplementation(() => {
      throw new Error('jwt expired');
    });

    expect(() => {
      authenticateToken(mockRequest as Request, mockResponse as Response, nextFunction);
    }).toThrow(UnauthorizedError);

    expect(nextFunction).not.toHaveBeenCalled();
  });
});
