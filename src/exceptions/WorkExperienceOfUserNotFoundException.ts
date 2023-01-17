import HttpException from './HttpException';

class WorkExperienceOfUserNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Work experience of user with id ${id} not found`);
  }
}

export default WorkExperienceOfUserNotFoundException;
