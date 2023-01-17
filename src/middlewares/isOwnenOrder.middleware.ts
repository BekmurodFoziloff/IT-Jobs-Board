import { Request, Response, NextFunction } from 'express';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import { OrdersService } from '../orders/orders.service';
import YouAreNotAllowedException from '../exceptions/YouAreNotAllowedException';

async function isOwnerOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const ordersService = new OrdersService();
    const { id } = req.params;
    const order = await ordersService.getOrderById(id);
    if (!(order?.owner.id.toString() === (req as RequestWithUser).user.id.toString())) {
      next(new YouAreNotAllowedException());
    }
    next();
  } catch (error) {
    res.status(error.status || 500).json(error.message);
  }
}

export default isOwnerOrder;
