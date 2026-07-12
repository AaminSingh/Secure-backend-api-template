export const UserRolesEnum = {
    ADMIN:"admin",
    PROJECT_ADMIN:"project_admin",
    MEMBER:"member"
}

export const AvailableUserRoles = Object.values(UserRolesEnum);      //this will give us an array of all the values in the UserRolesEnum object. because we want to use this array in our validation schema to check if the role provided by the user is valid or not.
export const AvailableUserRole = AvailableUserRoles;                   //this is just an alias for AvailableUserRoles, we can use either of them in our validation schema.

export const TaskStatusEnum = {
    TODO:"todo",
    IN_PROGRESS:"in_progress",
    DONE:"done"
}

export const AvailableTaskStatus = Object.values(TaskStatusEnum)