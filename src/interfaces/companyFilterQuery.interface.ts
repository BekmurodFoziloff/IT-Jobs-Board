interface CompanyFilterQuery {
  $or?: [{ name: { $regex: string; $options: string } }, { aboutCompany: { $regex: string; $options: string } }];
  specializations?: {
    $in: Array<string>;
  };
  owner?: string;
}

export default CompanyFilterQuery;
