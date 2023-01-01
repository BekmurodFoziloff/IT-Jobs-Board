import HttpException from './HttpException';
 
class PortfolioOfCompanyNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Portfolio of company with id ${id} not found`);
  }
}
 
export default PortfolioOfCompanyNotFoundException;