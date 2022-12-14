interface JobFilterQuery {
    employmentTypes?: {
        $in: Array<string>;
    };
    jobRequirements?: {
        workExperience?: {
            $in: string;
        };
        requiredSkills?: {
            $in: Array<string>;
        };
    };
    specializationCategories?: {
        $in: Array<string>;
    };
}

export default JobFilterQuery;