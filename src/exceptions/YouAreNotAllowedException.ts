import HttpException from './HttpException';

class YouAreNotAllowed extends HttpException {
  constructor() {
    super(403, 'You are not allowed');
  }
}

export default YouAreNotAllowed;