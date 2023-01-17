import HttpException from './HttpException';

class IndustryNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Industry with id ${id} not found`);
  }
}

export default IndustryNotFoundException;
