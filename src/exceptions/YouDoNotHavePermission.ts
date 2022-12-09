import HttpException from './HttpException';

class YouDoNotHavePermission extends HttpException {
  constructor() {
    super(401, 'You don\'t have permission');
  }
}

export default YouDoNotHavePermission;