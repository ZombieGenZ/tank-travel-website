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

export enum VehicleTypeEnum {
  BUS,
  TRAIN,
  PLANE
}

export enum SeatType {
  SEATING_SEAT,
  SLEEPER_SEAT,
  HYBRID_SEAT
}

export enum VehicleStatus {
  PENDING_APPROVAL,
  ACCEPTED,
  DENIED
}
