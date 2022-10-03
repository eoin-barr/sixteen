import { ApolloError } from 'apollo-server-core';

export class OAuthGqlError extends ApolloError {
  public status: number;

  constructor(status: number, code: string, message: string) {
    super(message, code);
    this.status = status;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class GqlUnauthorizedError extends OAuthGqlError {
  constructor(message = 'Invalid credendials') {
    super(401, 'UNAUTHORIZED', message);
    Object.defineProperty(this, 'name', { value: 'GqlUnauthorizedError' });
  }
}
