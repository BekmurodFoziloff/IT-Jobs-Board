interface OrderFilterQuery {
  $or?: [{ title: { $regex: string; $options: string } }];
  specializations?: {
    $in: Array<string>;
  };
  minBudget?: {
    $gte: number;
  };
  maxBudget?: {
    $lte: number;
  };
  customerType?: {
    $in: string;
  };
  status?: {
    $in: string;
  };
  archived?: {
    $in: string;
  };
  owner?: string;
}

export default OrderFilterQuery;
