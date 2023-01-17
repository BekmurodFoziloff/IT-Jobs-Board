interface JobFilterQuery {
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
}

export default JobFilterQuery;
