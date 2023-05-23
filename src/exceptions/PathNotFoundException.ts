import HttpException from './HttpException';

class PathNotFoundException extends HttpException {
  constructor(path: string) {
    super(404, ` ${path} path not found`);
  }
}

export default PathNotFoundException;
