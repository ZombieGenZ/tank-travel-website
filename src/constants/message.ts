export const USER_MESSAGE = {
  VALIDATION_ERROR: 'Input data error',
  DISPLAY_NAME_IS_REQUIRED: 'Display name cannot be empty',
  DISPLAY_NAME_MUST_BE_A_STRING: 'Display name must be a string',
  DISPLAY_NAME_LENGTH_MUST_BE_FROM_1_TO_50: 'Display name must be between 2 and 50 characters long',
  EMAIL_IS_REQUIRED: 'Email address cannot be empty',
  EMAIL_IS_NOT_VALID: 'Invalid email address',
  EMAIL_IS_MUST_BE_A_STRING: 'Email address must be a string',
  EMAIL_LENGTH_MUST_BE_FROM_5_TO_100: 'Email address must be between 5 and 100 characters long',
  EMAIL_IS_ALWAYS_EXISTENT: 'Email address is already in use',
  PHONE_IS_REQUIRED: 'Phone number cannot be empty',
  PHONE_IS_NOT_VALID: 'Invalid phone number',
  PHONE_MUST_BE_A_STRING: 'Phone number must be a string',
  PHONE_LENGTH_MUST_BE_FROM_10_TO_11: 'Phone number must be between 10 and 11 characters long',
  PHONE_IS_ALWAYS_EXISTENT: 'Phone number is already in use',
  PASSWORD_IS_REQUIRED: 'Password cannot be empty',
  PASSWORD_MUST_BE_A_STRING: 'Password must be a string',
  PASSOWRD_LENGTH_MUST_BE_FROM_8_TO_100: 'Password must be between 8 and 100 characters long',
  PASSOWRD_MUST_BE_STRONG:
    'Password must be at least 8 characters long, including uppercase, lowercase, numbers, and special characters',
  COMFIRM_PASSWORD_IS_REQUIRED: 'Confirm password cannot be empty',
  COMFIRM_PASSWORD_MUST_BE_A_STRING: 'Confirm password must be a string',
  COMFIRM_PASSWORD_LENGTH_MUST_BE_FROM_8_TO_100: 'Confirm password must be between 8 and 100 characters long',
  COMFORM_PASSWORD_MUST_BE_STRONG:
    'Confirm password must be at least 8 characters long, including uppercase, lowercase, numbers, and special characters',
  COMFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD: 'Confirm password must match the password',
  REGISTER_SUCCESS: 'Registration successful!',
  REGISTER_FAILURE: 'Registration failed',
  INCORRECT_EMAIL_OR_PASSWORD: 'Incorrect email or password',
  LOGIN_SUCCESS: 'Login successful!',
  LOGIN_FAILURE: 'Login failed',
  AUTHORIZATION_IS_REQUESTED: 'This function requires an Access token to be sent',
  AUTHORIZATION_MUST_BE_A_STRING: 'Access token must be a string',
  AUTHORIZATION_INVALID: 'Invalid Access token',
  REFUSED_TOKEN_IS_REQUESTED: 'This function requires a Refresh token to be sent',
  REFUSED_TOKEN_MUST_BE_A_STRING: 'Refresh token must be a string',
  REFRESH_TOKEN_DOES_NOT_EXIST: 'Refresh token does not exist',
  REFRESH_TOKEN_INVALID: 'Invalid Refresh token',
  LOGOUT_SUCCESS: 'Logout successful!',
  LOGOUT_FAILURE: 'Logout failed',
  EMAIL_VERIFY_TOKEN_IS_REQUESTED: 'This function requires an email verification code to be sent',
  EMAIL_VERIFY_TOKEN_MUST_BE_A_STRING: 'Email verification code must be a string',
  EMAIL_VERIFY_TOKEN_DOES_NOT_EXIST: 'Email verification code does not exist',
  EMAIL_ALREADY_VERIFIED: 'Email has already been verified',
  EMAIL_VERIFY_SUSSCESS: 'Email verification successful!',
  EMAIL_ALREADY_SENDING: 'Email has already been sent, please check your inbox',
  EMAIL_VERIFY_CODE_SEND_SUCCESS: 'Email verification code sent successfully! Please check your inbox',
  EMAIL_VERIFY_CODE_SEND_FAILURE: 'Failed to send email verification code',
  EMAIL_VERIFY_CODE_IS_REQUESTED: 'Email verification code cannot be empty',
  EMAIL_VERIFY_CODE_MUST_BE_A_STRING: 'Email verification code must be a string',
  EMAIL_VERIFY_CODE_INVALID: 'Invalid email verification code',
  EMAIL_VERIFY_CODE_HAS_NOT_BEEN_SENT: 'Email verification code has not been sent',
  EMAIL_VERIFY_CODE_RESEND_SUCCESS: 'Email verification code resent successfully! Please check your inbox',
  EMAIL_VERIFY_CODE_RESEND_FAILURE: 'Failed to resend email verification code',
  USER_IS_NOT_VERIFIED: 'You must verify your email to use this function',
  USERS_NOT_FOUND: 'No user found with this email',
  FORGOT_PASSWORD_SEND_EMAIL_SUCCESS: 'Email sent successfully! Please check your inbox',
  FORGOT_PASSWORD_SEND_EMAIL_FAILURE: 'Failed to send email',
  TOKEN_IS_REQUESTED: 'Password change token is required',
  TOKEN_MUST_BE_A_STRING: 'Password change token must be a string',
  TOKEN_INVALID: 'Invalid password change token',
  CHANGED_PASSWORD_SUCCESS: 'Password changed successfully! Please log in again',
  CHANGED_PASSWORD_FAILURE: 'Failed to change password',
  USER_NOT_FOUND: 'User not found',
  FORGOT_PASSWORD_TOKEN_INVALID: 'Invalid password change token',
  NEW_PASSWORD_IS_REQUIRED: 'New password cannot be empty',
  NEW_PASSWORD_MUST_BE_A_STRING: 'New password must be a string',
  NEW_PASSOWRD_LENGTH_MUST_BE_FROM_8_TO_100: 'New password must be between 8 and 100 characters long',
  NEW_PASSOWRD_MUST_BE_STRONG:
    'New password must be at least 8 characters long, including uppercase, lowercase, numbers, and special characters',
  COMFIRM_NEW_PASSWORD_IS_REQUIRED: 'Confirm new password cannot be empty',
  COMFIRM_NEW_PASSWORD_MUST_BE_A_STRING: 'Confirm new password must be a string',
  COMFIRM_NEW_PASSWORD_LENGTH_MUST_BE_FROM_8_TO_100: 'Confirm new password must be between 8 and 100 characters long',
  COMFORM_NEW_PASSWORD_MUST_BE_STRONG:
    'Confirm new password must be at least 8 characters long, including uppercase, lowercase, numbers, and special characters',
  COMFIRM_NEW_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD: 'Confirm new password must match the new password',
  PASSWORD_INCORRECT: 'Incorrect password',
  NEW_PASSWORD_MUST_BE_DIFFERENT_FROM_OLD_PASSWORD: 'New password must be different from the old password',
  CHANGED_EMAIL_SUCCESS: 'Email changed successfully! Please log in again',
  CHANGED_EMAIL_FAILURE: 'Failed to change email',
  CHANGED_PHONE_SUCCESS: 'Phone number changed successfully!',
  CHANGED_PHONE_FAILURE: 'Failed to change phone number',
  AVATAR_IS_REQUIRED: 'You must upload your avatar',
  IMAGE_MUST_BE_3x4_ASPECT_RATIO: 'Image must have a 3:4 aspect ratio',
  IMAGE_INVALID: 'Invalid image file',
  AVATAR_3X4_MUST_BE_IMAGE: 'Avatar must be an image file',
  CHANGED_AVATAR_SUCCESS: 'Avatar changed successfully!',
  CHANGED_AVATAR_FAILURE: 'Failed to change avatar',
  USER_IS_TEMPORARY: 'Please change your temporary password before logging in',
  CHANGED_TEMPORARY_PASSWORD_SUCCESS: 'Temporary password changed successfully! Please log in again',
  CHANGED_TEMPORARY_PASSWORD_FAILURE: 'Failed to change temporary password',
  ACCOUNT_IS_NOT_A_CURRENT_ACCOUNT:
    'This account is not issued by us or the account has already been changed for the first time',
  NOT_PERMISSION_TODO_THIS: 'YOU ARE A USER? GET OUT'
} as const

export const AUTHENTICATION_MESSAGE = {
  ACCESS_TOKEN_AND_REFRESH_TOKEN_IS_MISSING: 'You must log in to use this function',
  REFRESH_TOKEN_INVALID: 'Invalid refresh token',
  NOT_PERMISSION_TODO_THIS: 'You do not have permission to perform this action'
} as const

export const VEHICLE_MESSGAE = {
  VEHICLE_TYPE_IS_REQUIRED: 'Vehicle type cannot be empty',
  VEHICLE_TYPE_IS_INVALID: 'Invalid vehicle type',
  VEHICLE_TYPE_MUST_BE_A_NUMBER: 'Vehicle type must be a number',
  SEAT_TYPE_IS_REQUIRED: 'Seat type cannot be empty',
  SEAT_TYPE_IS_INVALID: 'Invalid seat type',
  SEAT_TYPE_IS_MUST_BE_A_NUMBER: 'Seat type must be a number',
  SEATS_IS_REQUIRED: 'Number of seats cannot be empty',
  SEATS_IS_MUST_BE_A_NUMBER: 'Number of seats must be a number',
  SEATS_IS_MUST_BE_GREATER_THAN_0: 'Number of seats must be greater than 0',
  RULES_IS_REQUIRED: 'Rules on the vehicle cannot be empty',
  RULES_IS_MUST_BE_A_STRING: 'Rules on the vehicle must be a string',
  EMAIL_LENGTH_MUST_BE_FROM_10_TO_2000: 'Rules on the vehicle must be between 10 and 2000 characters long',
  AMENITIES_IS_REQUIRED: 'Amenities on the vehicle cannot be empty',
  AMENITIES_IS_MUST_BE_A_STRING: 'Amenities on the vehicle must be a string',
  AMENITIES_LENGTH_MUST_BE_FROM_0_TO_500: 'Amenities on the vehicle must be between 0 and 500 characters long',
  LICENSE_PLATE_IS_REQUIRED: 'License plate cannot be empty',
  LICENSE_PLATE_IS_MUST_BE_A_STRING: 'License plate must be a string',
  LICENSE_PLATE_LENGTH_MUST_BE_FROM_7_TO_8: 'License plate must be between 7 and 8 characters long',
  LICENSE_PLATE_IS_ALREADY_EXISTS: 'License plate already exists',
  ONLY_UPLOAD_IMAGES: 'You can only upload images',
  ONLY_UPLOAD_EACH_IMAGE_UP_TO_5MB: 'Each image must be no larger than 5MB',
  ONLY_UPLOAD_UP_TO_30_IMAGES: 'You can upload up to 30 images',
  UPLOAD_FAILED: 'Upload failed',
  CREATE_VEHICLE_SUCCESS: 'Vehicle created successfully!',
  CREATE_VEHICLE_FAILURE: 'Failed to create vehicle',
  VEHICLE_ID_IS_REQUIRED: 'Vehicle ID cannot be empty',
  VEHICLE_ID_IS_MUST_BE_A_STRING: 'Vehicle ID must be a string',
  VEHICLE_ID_IS_MUST_BE_A_ID: 'Vehicle ID is not in the correct format',
  VEHICLE_ID_IS_NOT_EXIST: 'Vehicle ID does not exist or you do not have permission to do this',
  DELETE_VEHICLE_SUCCESS: 'Vehicle deleted successfully!',
  DELETE_VEHICLE_FAILURE: 'Failed to delete vehicle',
  GET_VEHICLE_FAILURE: 'Failed to get vehicle information',
  UPDATE_VEHICLE_SUCCESS: 'Vehicle updated successfully!',
  UPDATE_VEHICLE_FAILURE: 'Failed to update vehicle',
  CURRENT_IS_REQUIRED: 'Current page number cannot be empty',
  CURRENT_IS_MUST_BE_A_NUMBER: 'Current page number must be a number',
  CURRENT_IS_MUST_BE_GREATER_THAN_0: 'Current page number must be greater than 0',
  KEYWORDS_IS_REQUIRED: 'Keywords cannot be empty',
  NO_MATCHING_RESULTS_FOUND: 'No matching results found',
  DECISION_IS_REQUIRED: 'Decision cannot be empty',
  DECISION_IS_MUST_BE_A_BOOLEAN: 'Decision must be true or false',
  USER_NOT_FOUND: 'User not found',
  IMAGE_IS_REQUIRED: 'At least one image of the vehicle must be uploaded',
  CENSOR_VEHICLE_SUCCESS: 'Vehicle approved successfully!',
  CENSOR_VEHICLE_FAILURE: 'Failed to approve vehicle',
  GET_VEHICLE_LIST_FAILURE: 'Failed to get vehicle list',
  FIND_VEHICLE_FAILURE: 'Failed to find vehicle information',
  SESSION_TIME_IS_REQUIRED: 'Session time cannot be empty',
  SESSION_TIME_IS_MUST_BE_A_DATE: 'Session time is not in the correct format'
} as const

export const BUSROUTE_MESSAGE = {
  START_POINT_IS_REQUIRED: 'Start point cannot be empty',
  START_POINT_LENGTH_MUST_BE_FROM_5_TO_500: 'Start point must be between 5 and 500 characters long',
  END_POINT_IS_REQUIRED: 'End point cannot be empty',
  END_POINT_LENGTH_MUST_BE_FROM_5_TO_500: 'End point must be between 5 and 500 characters long',
  START_POINT_AND_END_POINT_MUST_BE_DIFFERENT: 'Start point and end point must be different',
  DEPARTURE_TIME_IS_REQUIRED: 'Departure time cannot be empty',
  DEPARTURE_TIME_MUST_BE_ISO8601: 'Departure time must be in ISO8601 format',
  ARRIVAL_TIME_IS_REQUIRED: 'Estimated arrival time cannot be empty',
  ARRIVAL_TIME_MUST_BE_ISO8601: 'Estimated arrival time must be in ISO8601 format',
  ARRIVAL_TIME_MUST_BE_GREATER_THAN_DEPARTURE_TIME: 'Estimated arrival time must be later than departure time',
  PRICE_IS_REQUIRED: 'Ticket price cannot be empty',
  PRICE_MUST_BE_A_NUMBER: 'Ticket price must be a number',
  PRICE_MUST_BE_GREATER_THAN_0: 'Ticket price must be greater than 0',
  QUANTITY_IS_REQUIRED: 'Ticket quantity cannot be empty',
  QUANTITY_MUST_BE_A_NUMBER: 'Ticket quantity must be a number',
  QUANTITY_MUST_BE_GREATER_THAN_0: 'Ticket quantity must be greater than 0',
  QUANTITY_MUST_BE_LESS_THAN_OR_EQUAL_TO_VEHICLE_SEATS:
    'Ticket quantity must be less than or equal to the number of seats in the vehicle',
  CREATE_BUS_ROUTE_SUCCESS: 'Route added successfully!',
  CREATE_BUS_ROUTE_FAILURE: 'Failed to add route',
  BUS_ROUTE_ID_IS_REQUIRED: 'Bus route ID cannot be empty',
  BUS_ROUTE_ID_IS_MUST_BE_A_STRING: 'Bus route ID must be a string',
  BUS_ROUTE_ID_IS_MUST_BE_A_ID: 'Bus route ID is not in the correct format',
  BUS_ROUTE_ID_IS_NOT_EXIST: 'Bus route ID does not exist or you do not have permission to do this',
  UPDATE_BUS_ROUTE_SUCCESS: 'Bus route updated successfully!',
  UPDATE_BUS_ROUTE_FAILURE: 'Failed to update bus route',
  DELETE_BUS_ROUTE_SUCCESS: 'Bus route deleted successfully!',
  DELETE_BUS_ROUTE_FAILURE: 'Failed to delete bus route',
  CURRENT_IS_REQUIRED: 'Current page number cannot be empty',
  CURRENT_IS_MUST_BE_A_NUMBER: 'Current page number must be a number',
  CURRENT_IS_MUST_BE_GREATER_THAN_0: 'Current page number must be greater than 0',
  NO_MATCHING_RESULTS_FOUND: 'No matching results found',
  KEYWORDS_IS_REQUIRED: 'Keywords cannot be empty',
  DEPARTURE_TIME_MUST_BE_GREATER_THAN_NOW: 'Departure time must be later than the current time',
  ARRIVAL_TIME_MUST_BE_GREATER_THAN_NOW: 'Estimated arrival time must be later than the current time',
  PRICE_MUST_BE_LESS_THAN_100000000: 'Ticket price must be less than 100,000,000 VND',
  GET_BUS_ROUTE_FAILED: 'Failed to get bus route information',
  FIND_BUS_ROUTE_FAILED: 'Failed to find bus route',
  SESSION_TIME_IS_REQUIRED: 'Session time cannot be empty',
  SESSION_TIME_IS_MUST_BE_A_DATE: 'Session time is not in the correct format'
} as const

export const ORDER_MESSAGE = {
  BUS_ROUTE_ID_IS_REQUIRED: 'Bus route ID cannot be empty',
  BUS_ROUTE_ID_MUST_BE_STRING: 'Bus route ID must be a string',
  BUS_ROUTE_ID_MUST_BE_MONGO_ID: 'Bus route ID is not in the correct format',
  BUS_ROUTE_ID_NOT_EXIST: 'Bus route ID does not exist',
  NAME_IS_REQUIRED: 'Representative name cannot be empty',
  NAME_MUST_BE_STRING: 'Representative name must be a string',
  NAME_LENGTH_MUST_BE_FROM_1_TO_150: 'Representative name must be between 1 and 150 characters long',
  PHONE_IS_REQUIRED: 'Phone number cannot be empty',
  PHONE_MUST_BE_STRING: 'Phone number must be a string',
  PHONE_LENGTH_MUST_BE_FROM_10_TO_11: 'Phone number must be between 10 and 11 characters long',
  PHONE_MUST_BE_MOBILE_PHONE: 'Invalid phone number format',
  QUANTITY_IS_REQUIRED: 'Ticket quantity cannot be empty',
  QUANTITY_MUST_BE_INT: 'Ticket quantity must be an integer',
  QUANTITY_MUST_BE_GREATER_THAN_0: 'Ticket quantity must be greater than 0',
  QUANTITY_MUST_BE_LESS_THAN_REMAINING_QUANTITY: 'Not enough tickets available for this route',
  BALANCE_NOT_ENOUGH: 'Your balance is insufficient to complete this transaction',
  ORDER_SUCCESS: 'Ticket booking successful!',
  ORDER_FAILURE: 'Ticket booking failed',
  CURRENT_IS_REQUIRED: 'Current page number is required',
  CURRENT_IS_MUST_BE_A_NUMBER: 'Current page number must be a number',
  CURRENT_IS_MUST_BE_GREATER_THAN_0: 'Current page number must be greater than 0',
  NO_MATCHING_RESULTS_FOUND: 'No matching results found',
  ORDER_ID_IS_REQUIRED: 'Order ID cannot be empty',
  ORDER_ID_IS_MUST_BE_A_STRING: 'Order ID must be a string',
  ORDER_ID_IS_MUST_BE_A_MONGO_ID: 'Order ID is not in the correct format',
  ORDER_ID_IS_NOT_EXIST: 'Order ID does not exist',
  QUANTITY_MUST_BE_LESS_THAN_1000: 'Ticket quantity must be less than 1000',
  TICKET_ID_IS_REQUIRED: 'Ticket ID cannot be empty',
  TICKET_ID_IS_MUST_BE_A_STRING: 'Ticket ID must be a string',
  TICKET_ID_IS_MUST_BE_A_MONGO_ID: 'Ticket ID is not in the correct format',
  TICKET_ID_IS_NOT_EXIST: 'Ticket ID does not exist',
  CANCELED_TICKET_SUCCESS: 'Ticket canceled successfully',
  GET_ORDER_FAILED: 'Failed to get order information',
  GET_ORDER_DETAIL_FAILED: 'Failed to get order details',
  CANCELED_TICKET_FAILURE: 'Failed to cancel ticket',
  SESSION_TIME_IS_REQUIRED: 'Session time cannot be empty',
  SESSION_TIME_IS_MUST_BE_A_DATE: 'Session time is not in the correct format'
} as const

export const EVALUATE_MESSAGE = {
  VEHICLE_ID_IS_REQUIRED: 'Vehicle ID cannot be empty',
  VEHICLE_ID_IS_MUST_BE_A_STRING: 'Vehicle ID must be a string',
  VEHICLE_ID_IS_INVALID: 'Vehicle ID is not in the correct format',
  VEHICLE_ID_IS_NOT_EXIST: 'Vehicle ID does not exist',
  VEHICLE_ID_IS_NOT_EXIST_IN_BILL: 'You must experience this vehicle to rate it',
  RATING_IS_REQUIRED: 'Rating cannot be empty',
  RATING_IS_MUST_BE_A_NUMBER: 'Rating must be a number',
  RATING_IS_INVALID: 'Invalid rating',
  CONTENT_IS_REQUIRED: 'Review content cannot be empty',
  CONTENT_IS_MUST_BE_A_STRING: 'Review content must be a string',
  CONTENT_LENGTH_MUST_BE_FROM_1_TO_500: 'Review content must be between 1 and 500 characters long',
  VEHICLE_ID_IS_ALREADY_EVALUATED: 'You have already rated this vehicle',
  CREATE_EVALUATE_SUCCESS: 'Review submitted successfully!',
  CREATE_EVALUATE_FAILURE: 'Failed to submit review!',
  EVALUATE_ID_IS_REQUIRED: 'Review ID cannot be empty',
  EVALUATE_ID_IS_MUST_BE_A_STRING: 'Review ID must be a string',
  EVALUATE_ID_IS_INVALID: 'Review ID is not in the correct format',
  EVALUATE_ID_IS_NOT_EXIST: 'Review ID does not exist or you do not have permission to do this',
  UPDATE_EVALUATE_SUCCESS: 'Review updated successfully!',
  UPDATE_EVALUATE_FAILURE: 'Failed to update review',
  DELETE_EVALUATE_SUCCESS: 'Review deleted successfully!',
  DELETE_EVALUATE_FAILURE: 'Failed to delete review',
  CURRENT_IS_REQUIRED: 'Current page number cannot be empty',
  CURRENT_IS_MUST_BE_A_NUMBER: 'Current page number must be a number',
  CURRENT_IS_MUST_BE_GREATER_THAN_0: 'Current page number must be greater than 0',
  NO_MATCHING_RESULTS_FOUND: 'No matching results found',
  CREATE_EVALUATE_FEEDBACK_SUCCESS: 'Review feedback submitted successfully!',
  CREATE_EVALUATE_FEEDBACK_FAILURE: 'Failed to submit review feedback',
  EVALUATE_ID_IS_ALREADY_HAVE_FEEDBACK: 'You have already submitted feedback for this review',
  EVALUATE_ID_IS_NOT_HAVE_FEEDBACK: 'You have not submitted feedback for this review',
  UPDATE_EVALUATE_FEEDBACK_SUCCESS: 'Review feedback updated successfully!',
  UPDATE_EVALUATE_FEEDBACK_FAILURE: 'Failed to update review feedback',
  DELETE_EVALUATE_FEEDBACK_SUCCESS: 'Review feedback deleted successfully!',
  DELETE_EVALUATE_FEEDBACK_FAILURE: 'Failed to delete review feedback',
  GET_EVALUATE_FAILURE: 'Failed to get review information',
  SESSION_TIME_IS_REQUIRED: 'Session time cannot be empty',
  SESSION_TIME_IS_MUST_BE_A_DATE: 'Session time is not in the correct format'
} as const

export const BUSINESS_REGISTRATION_MESSAGE = {
  NAME_IS_REQUIRED: 'Business name cannot be empty',
  NAME_IS_MUST_BE_A_STRING: 'Business name must be a string',
  NAME_LENGTH_MUST_BE_FROM_1_TO_50: 'Business name must be between 1 and 50 characters long',
  EMAIL_IS_REQUIRED: 'Business registration email cannot be empty',
  EMAIL_IS_MUST_BE_A_STRING: 'Business registration email must be a string',
  EMAIL_LENGTH_MUST_BE_FROM_5_TO_100: 'Business registration email must be between 5 and 100 characters long',
  EMAIL_IS_INVALID: 'Invalid business registration email format',
  EMAIL_IS_ALWAYS_EXISTENT: 'Business registration email is already in use',
  PHONE_IS_REQUIRED: 'Business registration phone number cannot be empty',
  PHONE_MUST_BE_A_STRING: 'Business registration phone number must be a string',
  PHONE_LENGTH_MUST_BE_FROM_10_TO_11: 'Business registration phone number must be between 10 and 11 characters long',
  PHONE_IS_INVALID: 'Invalid business registration phone number format',
  PHONE_IS_ALWAYS_EXISTENT: 'Business registration phone number is already in use',
  HAVE_ACCOUNT_IS_REQUIRED: 'Account information cannot be empty',
  HAVE_ACCOUNT_MUST_BE_A_BOOLEAN: 'Account information must be true or false',
  REGISTER_SUCCESS: 'Business registration successful!',
  BUSINESS_REGISTRATION_ID_IS_REQUIRED: 'Business registration ID cannot be empty',
  BUSINESS_REGISTRATION_ID_MUST_BE_A_STRING: 'Business registration ID must be a string',
  BUSINESS_REGISTRATION_ID_IS_NOT_EXISTENT: 'Business registration ID does not exist',
  DECISION_IS_REQUIRED: 'Decision cannot be empty',
  DECISION_MUST_BE_A_BOOLEAN: 'Decision must be true or false',
  CENSOR_SUCCESS: 'Business registration approved successfully!',
  CENSOR_FAILED: 'Failed to approve business registration',
  CURRENT_IS_REQUIRED: 'Current page number cannot be empty',
  CURRENT_IS_MUST_BE_A_NUMBER: 'Current page number must be a number',
  CURRENT_IS_MUST_BE_GREATER_THAN_0: 'Current page number must be greater than 0',
  NO_MATCHING_RESULTS_FOUND: 'No matching results found',
  REGISTER_FAILED: 'Business registration failed',
  GET_BUSINESS_REGISTRATION__FAILED: 'Failed to get business registration information',
  SESSION_TIME_IS_REQUIRED: 'Session time cannot be empty',
  SESSION_TIME_IS_MUST_BE_A_DATE: 'Session time is not in the correct format'
} as const

export const NOTIFICATION_MESSAGE = {
  IMAGE_IS_REQUIRED: 'You must upload at least 1 image for the notification',
  TITLE_IS_REQUIRED: 'Notification title cannot be empty',
  TITLE_MUST_BE_STRING: 'Notification title must be a string',
  TITLE_LENGTH_MUST_BE_FROM_5_TO_200: 'Notification title must be between 5 and 200 characters long',
  DESCRIPTION_IS_REQUIRED: 'Notification content cannot be empty',
  DESCRIPTION_MUST_BE_STRING: 'Notification content must be a string',
  DESCRIPTION_LENGTH_MUST_BE_FROM_5_TO_2000: 'Notification content must be between 5 and 2000 characters long',
  SET_NOTIFICATION_SUCCESS: 'Notification set successfully!',
  SET_NOTIFICATION_FAILED: 'Failed to set notification',
  REMOVE_NOTIFICATION_SUCCESS: 'Notification removed successfully!',
  REMOVE_NOTIFICATION_FAILED: 'Failed to remove notification',
  NOTIFICATION_NOT_FOUND: 'No notifications found',
  GET_NOTIFICATION_FAILED: 'Failed to get notification'
} as const

export const ACCOUNT_MANAGEMENT_MESSAGE = {
  CURRENT_IS_REQUIRED: 'Current page number cannot be empty',
  CURRENT_IS_MUST_BE_A_NUMBER: 'Current page number must be a number',
  CURRENT_IS_MUST_BE_GREATER_THAN_0: 'Current page number must be greater than 0',
  GET_ACCOUNT_FAILURE: 'Failed to get account information list',
  NO_MATCHING_RESULTS_FOUND: 'No matching results found',
  KEYWORDS_IS_REQUIRED: 'Search keywords cannot be empty',
  FIND_ACCOUNT_FAILURE: 'Failed to search for account information',
  USER_ID_IS_REQUIRED: 'User ID cannot be empty',
  USER_ID_IS_INVALID: 'Invalid user ID',
  USER_ID_IS_NOT_EXIST: 'User ID does not exist',
  REASON_IS_REQUIRED: 'Reason for account suspension cannot be empty',
  REASON_IS_MUST_BE_A_STRING: 'Reason for account suspension must be a string',
  REASON_IS_MUST_BE_BETWEEN_1_AND_500_CHARACTERS: 'Reason must be between 1 and 500 characters long',
  EXPIRED_AT_IS_REQUIRED: 'Account reactivation time cannot be empty',
  EXPIRED_AT_IS_MUST_BE_A_VALID_DATE: 'Account reactivation time must be a valid date',
  EXPIRED_AT_IS_MUST_BE_GREATER_THAN_CURRENT_DATE: 'Account reactivation time must be later than the current date',
  BAN_ACCOUNT_SUCCESS: 'Account suspended successfully!',
  BAN_ACCOUNT_FAILURE: 'Failed to suspend account',
  USER_ID_IS_ALREADY_BANNED: 'The user is already suspended',
  USER_ID_IS_NOT_BANNED: 'The user is not suspended',
  UNBAN_ACCOUNT_SUCCESS: 'Account unsuspended successfully!',
  UNBAN_ACCOUNT_FAILURE: 'Failed to unsuspend account',
  MESSAGE_IS_REQUIRED: 'Message cannot be empty',
  MESSAGE_IS_MUST_BE_A_STRING: 'Message must be a string',
  MESSAGE_IS_MUST_BE_BETWEEN_1_AND_500_CHARACTERS: 'Message must be between 1 and 500 characters long',
  SEND_NOTIFICATIONS_SUCCESS: 'Notifications sent successfully!',
  SEND_NOTIFICATIONS_FAILURE: 'Failed to send notifications',
  SESSION_TIME_IS_REQUIRED: 'Session time cannot be empty',
  SESSION_TIME_IS_MUST_BE_A_DATE: 'Session time is not in the correct format'
} as const

export const STATISTICS_MESSAGE = {
  GET_STATISTICS_FAILURE: 'Failed to get statistics information',
  START_TIME_IS_REQUIRED: 'Start time cannot be empty',
  START_TIME_IS_MUST_BE_A_VALID_DATE: 'Start time must be a valid date',
  END_TIME_IS_REQUIRED: 'End time cannot be empty',
  END_TIME_IS_MUST_BE_A_VALID_DATE: 'End time must be a valid date',
  END_TIME_IS_MUST_BE_GREATER_THAN_START_TIME: 'End time must be later than start time'
} as const
