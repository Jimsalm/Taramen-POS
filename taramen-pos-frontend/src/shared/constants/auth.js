export const DEFAULT_LOGIN_CREDENTIALS = {
   username: "admin@bulsu.edu.ph",
   password: "Password123",
};

export const AUTH_STORAGE_KEY = "elib_auth_token";

export const AUTH_REFRESH_KEY = "refreshToken";

export const AUTH_USER_STORAGE_KEY = "user";

export const REDIRECT_PATHS = {
   AFTER_LOGIN: "/dashboard",
   AFTER_LOGOUT: "/login",
};

export const USER_SCOPES = {
   SUPERADMIN: "GLOBAL_ACCESS",
   FORMS: "FORMS",
};

export const USER_ROLES = {
   SUPERADMIN: "superadmin",
   ADMIN: "admin",
   STAFF: "staff",
   STUDENT: "student",
   REQUESTOR: "requestor",
   GLOBAL: "*",
};

export const ROUTE_STATUS = {
   ACCESSIBLE: "accessible",
   DENIED: "denied",
   DEVELOPMENT: "development",
};
