import HttpException from './HttpException';

class YouDoNotHavePermissionException extends HttpException {
  constructor() {
    super(401, "You don't have permission");
  }
}

export default YouDoNotHavePermissionException;
