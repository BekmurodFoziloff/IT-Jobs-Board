import HttpException from './HttpException';

class WorkStyleNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Work style with id ${id} not found`);
  }
}

export default WorkStyleNotFoundException;
