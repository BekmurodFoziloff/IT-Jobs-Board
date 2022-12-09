import HttpException from './HttpException';
 
class RequiredSkillNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Required skill with id ${id} not found`);
  }
}
 
export default RequiredSkillNotFoundException;