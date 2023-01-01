interface CompanyFilterQuery {
    specializations?: {
        $in: Array<string>;
    };
}

export default CompanyFilterQuery;