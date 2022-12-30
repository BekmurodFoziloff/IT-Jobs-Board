import HttpException from './HttpException';
 
class AchievementOfUserNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Achievement of user with id ${id} not found`);
  }
}
 
export default AchievementOfUserNotFoundException;