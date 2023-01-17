import HttpException from './HttpException';

class EmploymentTypeNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Employment type with id ${id} not found`);
  }
}

export default EmploymentTypeNotFoundException;
