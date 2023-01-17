import HttpException from './HttpException';

class WorkExperienceNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Work experience with id ${id} not found`);
  }
}

export default WorkExperienceNotFoundException;
