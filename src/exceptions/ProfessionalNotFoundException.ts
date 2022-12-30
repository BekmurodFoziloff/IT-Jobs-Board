import HttpException from './HttpException';
 
class ProfessionalNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Professional with id ${id} not found`);
  }
}
 
export default ProfessionalNotFoundException;