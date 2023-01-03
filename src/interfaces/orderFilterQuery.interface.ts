interface OrderFilterQuery {
    specializations?: {
        $in: Array<string>;
    };
    minBudget?: {
        $gte: number;
    };
    maxBudget?: {
        $lte: number
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
}

export default OrderFilterQuery;