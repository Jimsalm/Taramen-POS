export const NUMERIC_ONLY = /[^0-9]/g;
export const ALPHABETS_ONLY = /[^a-zA-Z]/g;
export const ALPHANUMERIC_ONLY = /[^a-zA-Z0-9]/g;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^\+?[\d\s\-\(\)]+$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
