//for Get Request
export const GETME = "api/users/me";
export const GETALLUSERS = "api/users/all";
export const GETALLDEPARTMENTS = "api/department/all/";
export const GETMYDEPARTMENT = "api/department/my";
export const GETDEPARTMENTMANAGERS = "api/users/department_managers";
export const GETDEPARTMENTUSERS = "api/department/users/";
export const GETSKILLS = "/skills";
export const GETMYDEPARTMENTSKILLS = "api/department/skills";
export const GETMYSKILLS = "api/user/skills";
export const GETCUSTOMROLES = "api/roles";
export const GETALLPROJECTS = "api/projects";
export const GETPROJECT = "api/project/";
export const TEAMFIND = "api/team_finder/";
export const GETPROPOSALS = "api/department/requests/proposals";
export const GETURL = "api/register/invite";
export const GETDEALLOCATIONS = "api/department/requests/deallocations";
export const GETUSER = "api/users/";
//for Post Request
export const POSTDEPARTMENT = "api/department/create/";
export const POSTNEWMEMBERS = "api/department/assign/";
export const POSTNEWSKILLS = "/skill";
export const ASSIGNSKILLTODEPARTMENT = "api/department/skill/assign/";
export const ASSIGNSKILLTOUSER = "api/user/skill/assign?";
export const POSTNEWROLE = "/api/role";
export const POSTNEWPROJECT = "api/project";
export const POSTASSIGNUSER = "api/project/employee/propose";
export const ACCEPTPROPOSAL = "api/department/requests/propose/accept/";
export const ACCEPTDEALLOCATE = "api/department/requests/deallocate/accept/";
export const REJECTPROPOSAL = "api/department/requests/propose/reject/";
export const REJECTDEALLOCATE = "api/department/requests/deallocate/reject/";
export const DEALLOCATEUSER = "api/project/employee/deallocate";
//for Put Request
export const PUTUSERROLES = "api/users/roles/update";
export const PUTEDITDEPARTMENT = "api/department";
export const PUTEDITUSERSKILL = "api/user/skill";
//for Delete Request
export const DELETEDEPARTMENTUSER = "api/department/user/";
export const DELETEDEPARTMENTSKILL = "api/department/skill/";
export const DELETEDEPARTMENT = "api/department/";
export const DELETEUSERSKILL = "api/user/skill";
