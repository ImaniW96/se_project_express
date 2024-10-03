module.exports = {
  BAD_REQUEST: 400,
  FORBIDDEN_ERROR: 403,
  NOT_FOUND: 404,
  DEFAULT: 500,
  NOT_AUTHORIZED: 401,
  OKAY_REQUEST: 200,
  CREATE_REQUEST: 201,
  DUPLICATE_ERROR: 409,
};

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}
class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}
class NotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}
class Default extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
  }
}
class NotAuthorized extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}
class OkayRequest extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 200;
  }
}
class CreateRequest extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 201;
  }
}
class DuplicateError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}
module.exports = {
  BadRequestError,
  ForbiddenError,
  NotFound,
  Default,
  NotAuthorized,
  OkayRequest,
  CreateRequest,
  DuplicateError,
};
