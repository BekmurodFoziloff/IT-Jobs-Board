interface UserFilterQuery {
    profile?: {
        specializationCategories?: {
            $in: Array<string>;
        };
        region: {
            $in: Array<string>;
        },
        skills: {
            $in: Array<string>;
        }
    };
}

export default UserFilterQuery;