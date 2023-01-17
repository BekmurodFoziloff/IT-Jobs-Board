import HttpException from './HttpException';

class SkillNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Skill with id ${id} not found`);
  }
}

export default SkillNotFoundException;
