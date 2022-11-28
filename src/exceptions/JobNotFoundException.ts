import HttpException from './HttpException';
 
class JobNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Job with id ${id} not found`);
  }
}
 
export default JobNotFoundException;