import HttpException from './HttpException';
 
class RegionNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Region with id ${id} not found`);
  }
}
 
export default RegionNotFoundException;