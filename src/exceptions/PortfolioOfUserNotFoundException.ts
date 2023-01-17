import HttpException from './HttpException';

class PortfolioOfUserNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Portfolio of user with id ${id} not found`);
  }
}

export default PortfolioOfUserNotFoundException;
