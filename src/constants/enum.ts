export enum UserStatus {
  UnVerified,
  Verified
}

interface Permissions {
  permission_name: string
  allowed_ticket_management: boolean
  allowed_ticket_management_all: boolean
  allowed_create_ticket: boolean
  allowed_edit_ticket: boolean
  allowed_delete_ticket: boolean
  allowed_view_statistical_report: boolean
  allowed_view_statistical_report_overview: boolean
  allowed_account_management: boolean
  allowed_edit_account: boolean
  allowed_delete_account: boolean
  allowed_business_registration_review: boolean
  allowed_ticket_review: boolean
}

const CUSTOMER: Permissions = {
  permission_name: 'Khách hàng',
  allowed_ticket_management: false,
  allowed_ticket_management_all: false,
  allowed_create_ticket: false,
  allowed_edit_ticket: false,
  allowed_delete_ticket: false,
  allowed_view_statistical_report: false,
  allowed_view_statistical_report_overview: false,
  allowed_account_management: false,
  allowed_edit_account: false,
  allowed_delete_account: false,
  allowed_business_registration_review: false,
  allowed_ticket_review: false
}

const BUSINESS: Permissions = {
  permission_name: 'Doanh nghiệp',
  allowed_ticket_management: true,
  allowed_ticket_management_all: false,
  allowed_create_ticket: true,
  allowed_edit_ticket: true,
  allowed_delete_ticket: true,
  allowed_view_statistical_report: true,
  allowed_view_statistical_report_overview: false,
  allowed_account_management: false,
  allowed_edit_account: false,
  allowed_delete_account: false,
  allowed_business_registration_review: false,
  allowed_ticket_review: false
}

const ADMINISTRATOR: Permissions = {
  permission_name: 'Quản trị viên',
  allowed_ticket_management: true,
  allowed_ticket_management_all: true,
  allowed_create_ticket: true,
  allowed_edit_ticket: true,
  allowed_delete_ticket: true,
  allowed_view_statistical_report: true,
  allowed_view_statistical_report_overview: true,
  allowed_account_management: true,
  allowed_edit_account: true,
  allowed_delete_account: true,
  allowed_business_registration_review: true,
  allowed_ticket_review: true
}

export enum UserPermission {
  CUSTOMER,
  BUSINESS,
  ADMINISTRATOR
}
