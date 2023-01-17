import HttpException from './HttpException';

class LegalFormNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Legal form with id ${id} not found`);
  }
}

export default LegalFormNotFoundException;
