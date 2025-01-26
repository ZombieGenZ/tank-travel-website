export const USER_MESSAGE = {
  VALIDATION_ERROR: 'Lỗi dử liệu đầu vào',
  DISPLAY_NAME_IS_REQUIRED: 'Không được để trống tên hiển thị',
  DISPLAY_NAME_MUST_BE_A_STRING: 'Tên hiển thị phải là một chuỗi ký tự',
  DISPLAY_NAME_LENGTH_MUST_BE_FROM_1_TO_50: 'Tên hiển thị phải có độ dài từ 2 đến 50 ký tự',
  EMAIL_IS_REQUIRED: 'Không được để trống địa chỉ email',
  EMAIL_IS_NOT_VALID: 'Địa chỉ email không hợp lệ',
  EMAIL_IS_MUST_BE_A_STRING: 'Địa chỉ email phải là chuổi ký tự',
  EMAIL_LENGTH_MUST_BE_FROM_5_TO_100: 'Địa chỉ email phải có độ dài từ 5 đến 100 ký tự',
  EMAIL_IS_ALWAYS_EXISTENT: 'Địa chỉ email đã được sử dụng',
  PHONE_IS_REQUIRED: 'Không được để trống số điện thoại',
  PHONE_IS_NOT_VALID: 'Số điện thoại không hợp lệ',
  PHONE_MUST_BE_A_STRING: 'Số điện thoại phải là chuổi ký tự',
  PHONE_LENGTH_MUST_BE_FROM_10_TO_11: 'Số điện thoại phải có độ dài từ 10 đến 11 ký tự',
  PHONE_IS_ALWAYS_EXISTENT: 'Số điện thoại đã có người sử dụng',
  PASSWORD_IS_REQUIRED: 'Không được để trống mật khẩu',
  PASSWORD_MUST_BE_A_STRING: 'Mật khẩu phải là một chuỗi ký tự',
  PASSOWRD_LENGTH_MUST_BE_FROM_8_TO_100: 'Mật khẩu phải có độ dài từ 8 đến 100 ký tự',
  PASSOWRD_MUST_BE_STRONG: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt',
  COMFIRM_PASSWORD_IS_REQUIRED: 'Không được để trống xác nhận mật khẩu',
  COMFIRM_PASSWORD_MUST_BE_A_STRING: 'Xác nhận mật khẩu phải là một chuỗi ký tự',
  COMFIRM_PASSWORD_LENGTH_MUST_BE_FROM_8_TO_100: 'Xác nhận mật khẩu phải có độ dài từ 8 đến 100 ký tự',
  COMFORM_PASSWORD_MUST_BE_STRONG:
    'Xác nhận mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt',
  COMFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD: 'Xác nhận mật khẩu phải giống với mật khẩu',
  REGISTER_SUCCESS: 'Đăng ký thành công!',
  INCORRECT_EMAIL_OR_PASSWORD: 'Email hoặc mật khẩu không chính xác',
  LOGIN_SUCCESS: 'Đăng nhập thành công!',
  AUTHORIZATION_IS_REQUESTED: 'Chức năng này yêu cầu Access token phải được gửi kèm',
  AUTHORIZATION_MUST_BE_A_STRING: 'Access token phải là một chuỗi ký tự',
  AUTHORIZATION_INVALID: 'Access token không hợp lệ',
  REFUSED_TOKEN_IS_REQUESTED: 'Chức năng này yêu cầu Refresh token phải được gửi kèm',
  REFUSED_TOKEN_MUST_BE_A_STRING: 'Refresh token phải là một chuỗi ký tự',
  REFRESH_TOKEN_DOES_NOT_EXIST: 'Refresh token không tồn tại',
  REFRESH_TOKEN_INVALID: 'Refresh token không hợp lệ',
  LOGOUT_SUCCESS: 'Đăng xuất thành công!',
  EMAIL_VERIFY_TOKEN_IS_REQUESTED: 'Chức năng này yêu cầu mã xác thực email phải được gửi kèm',
  EMAIL_VERIFY_TOKEN_MUST_BE_A_STRING: 'Mã xác thực email phải là một chuỗi ký tự',
  EMAIL_VERIFY_TOKEN_DOES_NOT_EXIST: 'Mã xác thực email không tồn tại',
  EMAIL_ALREADY_VERIFIED: 'Email đã được xác thực',
  EMAIL_VERIFY_SUSSCESS: 'Xác thực email thành công!',
  EMAIL_ALREADY_SENDING: 'Email đã được gửi, vui lòng kiểm tra email của bạn',
  EMAIL_SENDIING_SUCCESS: 'Gửi email thành công! Vui lòng kiểm tra hộp thư email của bạn',
  EMAIL_VERIFY_CODE_IS_REQUESTED: 'Không được bỏ trống mã xác thực email',
  EMAIL_VERIFY_CODE_MUST_BE_A_STRING: 'Mã xác thực email phải là một chuỗi ký tự',
  EMAIL_VERIFY_CODE_INVALID: 'Mã xác thực email không hợp lệ',
  EMAIL_VERIFY_CODE_HAS_NOT_BEEN_SENT: 'Mã xác thực email chưa được gửi',
  EMAIL_VERIFY_CODE_RESEND_SUCCESS: 'Đã gửi lại mã xác thực email thành công!'
} as const

export const AUTHENTICATION_MESSAGE = {
  ACCESS_TOKEN_AND_REFRESH_TOKEN_IS_MISSING: 'Bạn phải đăng nhập mới có thể sử dụng chức năng này',
  REFRESH_TOKEN_INVALID: 'Refresh token không hợp lệ',
  NOT_PERMISSION_TODO_THIS: 'Bạn không có quyền thực hiện hành động này'
} as const

export const VEHICLE_MESSGAE = {
  VEHICLE_TYPE_IS_REQUIRED: 'Không được bỏ trống loại xe',
  VEHICLE_TYPE_IS_INVALID: 'Loại xe không hợp lệ',
  VEHICLE_TYPE_MUST_BE_A_NUMBER: 'Loại xe phải là một số',
  SEAT_TYPE_IS_REQUIRED: 'Không được bỏ trống loại ghế',
  SEAT_TYPE_IS_INVALID: 'Loại ghế không hợp lệ',
  SEAT_TYPE_IS_MUST_BE_A_NUMBER: 'Loại ghế phải là một số',
  SEATS_IS_REQUIRED: 'Không được bỏ trống số ghế',
  SEATS_IS_MUST_BE_A_NUMBER: 'Số ghế phải là một số',
  SEATS_IS_MUST_BE_GREATER_THAN_0: 'Số ghế phải lớn hơn 0',
  RULES_IS_REQUIRED: 'Không được bỏ trống quy định trên xe',
  RULES_IS_MUST_BE_A_STRING: 'Quy định trên xe phải là một chuỗi ký tự',
  EMAIL_LENGTH_MUST_BE_FROM_0_TO_2000: 'Quy định trên xe phải có độ dài từ 0 đến 2000 ký tự',
  AMENITIES_IS_REQUIRED: 'Không được bỏ trống tiện ích trên xe',
  AMENITIES_IS_MUST_BE_A_STRING: 'Tiện ích trên xe phải là một chuỗi ký tự',
  AMENITIES_LENGTH_MUST_BE_FROM_0_TO_500: 'Tiện ích trên xe phải có độ dài từ 0 đến 500 ký tự',
  LICENSE_PLATE_IS_REQUIRED: 'Không được bỏ trống biển số xe',
  LICENSE_PLATE_IS_MUST_BE_A_STRING: 'Biển số xe phải là một chuỗi ký tự',
  LICENSE_PLATE_LENGTH_MUST_BE_FROM_7_TO_8: 'Biển số xe phải có độ dài từ 7 đến 8 ký tự'
} as const
