interface JobFilterQuery {
    employmentTypes?: {
        $in: Array<string>;
    };
    jobRequirements?: {
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