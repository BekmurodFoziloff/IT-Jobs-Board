import HttpException from './HttpException';

class SpecializationNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Specialization with id ${id} not found`);
  }
}

export default SpecializationNotFoundException;
