export const validationMessages = {
  FIELD_REQUIRED: "{field} is required",
  FIELD_INVALID: "Invalid {field}",

  COUNTRY_REQUIRED: "Country code is required",

  PHONE_REQUIRED: "Mobile number is required",
  PHONE_INVALID: "Enter a valid mobile number",

  OTP_LENGTH: "Enter all {count} digits",
  OTP_NUMERIC: "Code must be numeric",
  OTP_INVALID: "Invalid code",
  OTP_INCORRECT: "The code you entered is incorrect",
} as const
