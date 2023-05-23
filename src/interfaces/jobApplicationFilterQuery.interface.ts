interface jobApplicationFilterQuery {
  gender?: {
    $in: Array<string>;
  };
  workExperience?: string;
  jobOwner?: string;
}

export default jobApplicationFilterQuery;
