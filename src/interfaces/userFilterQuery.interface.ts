interface UserFilterQuery {
  $or?: [
    { 'profile?.position': { $regex: string; $options: string } },
    { 'profile?.aboutMe': { $regex: string; $options: string } }
  ];
  profile?: {
    specializationCategories?: {
      $in: Array<string>;
    };
    region?: {
      $in: Array<string>;
    };
    skills?: {
      $in: Array<string>;
    };
  };
}

export default UserFilterQuery;
