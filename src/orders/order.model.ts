import { model } from 'mongoose';
import { Order } from './order.interface';
import OrderSchema from './schema/order.schema';

const OrderModel = model<Order>('Order', OrderSchema);

export default OrderModel;
