import HttpException from './HttpException';

class JobApplicationNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Job application with id ${id} not found`);
  }
}

export default JobApplicationNotFoundException;
