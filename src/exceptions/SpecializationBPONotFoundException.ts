import HttpException from './HttpException';

class SpecializationBPONotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Specialization Business Process Outsourcing with id ${id} not found`);
  }
}

export default SpecializationBPONotFoundException;
