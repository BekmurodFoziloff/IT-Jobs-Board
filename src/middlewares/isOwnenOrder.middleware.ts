import { Request, Response, NextFunction } from 'express';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import { OrdersService } from '../orders/orders.service';
import YouAreNotAllowed from '../exceptions/YouAreNotAllowedException';

async function isOwnerOrder(req: Request, res: Response, next: NextFunction) {
    try {
        const ordersService = new OrdersService();
        const { id } = req.params;
        const job = await ordersService.getOrderById(id);
        if (!(job?.owner.id.toString() === (req as RequestWithUser).user.id.toString())) {
            next(new YouAreNotAllowed());
        }
        next();
    } catch (error) {
        next(error);
    }
}

export default isOwnerOrder;