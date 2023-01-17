import HttpException from './HttpException';

class YouAreNotAllowedException extends HttpException {
  constructor() {
    super(403, 'You are not allowed');
  }
}

export default YouAreNotAllowedException;
