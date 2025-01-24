export enum UserStatus {
  UnVerified,
  Verified
}

export enum UserPermission {
  CUSTOMER,
  BUSINESS,
  ADMINISTRATOR
}

export enum TokenType {
  AccessToken,
  RefreshToken,
  ForgotPasswordToken,
  EmailVerifyToken
}
