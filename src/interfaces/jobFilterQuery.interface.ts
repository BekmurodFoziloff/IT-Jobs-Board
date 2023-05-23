interface JobFilterQuery {
  $or?: [
    { title: { $regex: string; $options: string } },
    { description: { $regex: string; $options: string } },
    { task: { $regex: string; $options: string } },
    { schedule: { $regex: string; $options: string } }
  ];
  employmentTypes?: {
    $in: Array<string>;
  };
  requirements?: {
    workExperience?: {
      $in: string;
    };
    skills?: {
      $in: Array<string>;
    };
  };
  specializationCategories?: {
    $in: Array<string>;
  };
  owner?: string;
}

export default JobFilterQuery;
