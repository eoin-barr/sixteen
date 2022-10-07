// eslint-disable-next-line max-classes-per-file
import { ApolloError } from 'apollo-server-core';

export class BaseError extends ApolloError {
  public status: number;

  constructor(status: number, code: string, message: string) {
    super(message, code);
    this.status = status;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// Generic Errors
export class GqlAlreadyExistsError extends BaseError {
  constructor(message = 'Already exists') {
    super(409, 'ALREADY_EXISTS', message);
    Object.defineProperty(this, 'name', { value: 'AlreadyExistsError' });
  }
}

export class GqlInternalServerError extends BaseError {
  constructor(message = 'An unknown internal server error occurred') {
    super(500, 'INTERNAL_SERVER_ERROR', message);
    Object.defineProperty(this, 'name', { value: 'InternalServerError' });
  }
}

export class GqlNotFoundError extends BaseError {
  constructor(message: string) {
    super(404, 'NOT_FOUND', message);
    Object.defineProperty(this, 'name', { value: 'GqlNotFoundError' });
  }
}

export class GqlUnauthorizedError extends BaseError {
  constructor(message = 'Invalid credentials') {
    super(401, 'UNAUTHORIZED', message);
    Object.defineProperty(this, 'name', { value: 'GqlUnauthorizedError' });
  }
}
