import HttpException from './HttpException';

class EducationOfUserNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Education of user with id ${id} not found`);
  }
}

export default EducationOfUserNotFoundException;
