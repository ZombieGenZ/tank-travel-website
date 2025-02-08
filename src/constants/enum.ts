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
  ForgotPasswordToken
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

export enum TicketStatus {
  PAID,
  CANCELLED
}

export enum PaymentType {
  CARD,
  BANK
}

export enum RevenueStatus {
  PENDING,
  SUCCESS,
  FAILURE
}

export enum LogTypeEnum {
  INFO,
  WARN,
  ERROR
}

export enum NotificationStatus {
  SENT,
  DELETED
}
