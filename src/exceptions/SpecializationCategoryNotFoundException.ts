import HttpException from './HttpException';
 
class SpecializationCategoryNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Specialization category with id ${id} not found`);
  }
}
 
export default SpecializationCategoryNotFoundException;