import HttpException from './HttpException';
 
class TeamOfTeamNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Team of company with id ${id} not found`);
  }
}
 
export default TeamOfTeamNotFoundException;