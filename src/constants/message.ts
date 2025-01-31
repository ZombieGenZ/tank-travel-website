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
  EMAIL_VERIFY_CODE_RESEND_SUCCESS: 'Đã gửi lại mã xác thực email thành công!',
  USER_IS_NOT_VERIFIED: 'Bạn phải xác thực email mới có thể sử dụng chức năng này'
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
  EMAIL_LENGTH_MUST_BE_FROM_10_TO_2000: 'Quy định trên xe phải có độ dài từ 10 đến 2000 ký tự',
  AMENITIES_IS_REQUIRED: 'Không được bỏ trống tiện ích trên xe',
  AMENITIES_IS_MUST_BE_A_STRING: 'Tiện ích trên xe phải là một chuỗi ký tự',
  AMENITIES_LENGTH_MUST_BE_FROM_0_TO_500: 'Tiện ích trên xe phải có độ dài từ 0 đến 500 ký tự',
  LICENSE_PLATE_IS_REQUIRED: 'Không được bỏ trống số hiệu',
  LICENSE_PLATE_IS_MUST_BE_A_STRING: 'Số hiệu phải là một chuỗi ký tự',
  LICENSE_PLATE_LENGTH_MUST_BE_FROM_7_TO_8: 'Số hiệu phải có độ dài từ 7 đến 8 ký tự',
  LICENSE_PLATE_IS_ALREADY_EXISTS: 'Số hiệu đã tồn tại',
  ONLY_UPLOAD_IMAGES: 'Bạn chỉ được tải lên hình ảnh',
  ONLY_UPLOAD_EACH_IMAGE_UP_TO_5MB: 'Bạn chỉ được tải lên mỗi hình ảnh tối đa 5MB',
  ONLY_UPLOAD_UP_TO_30_IMAGES: 'Bạn chỉ được tải lên tối đa 30 hình ảnh',
  UPLOAD_FAILED: 'Tải lên thất bại',
  CREATE_VEHICLE_SUCCESS: 'Tạo phương tiện thành công!',
  VEHICLE_ID_IS_REQUIRED: 'Không được bỏ trống id phương tiện',
  VEHICLE_ID_IS_MUST_BE_A_STRING: 'Id phương tiện phải là một chuỗi ký tự',
  VEHICLE_ID_IS_MUST_BE_A_ID: 'Id phương tiện không đúng định dạn',
  VEHICLE_ID_IS_NOT_EXIST: 'Id phương tiện không tồn tại hoặc bạn không có quyền làm điều này',
  DELETE_VEHICLE_SUCCESS: 'Xóa phương tiện thành công!',
  UPDATE_VEHICLE_SUCCESS: 'Cập nhật phương tiện thành công!',
  CURRENT_IS_REQUIRED: 'Không được bỏ trống số trang hiện tại',
  CURRENT_IS_MUST_BE_A_NUMBER: 'Số trang hiện tại phải là một số',
  CURRENT_IS_MUST_BE_GREATER_THAN_0: 'Số trang hiện tại phải lớn hơn 0',
  KEYWORDS_IS_REQUIRED: 'Không được bỏ trống từ khóa',
  NO_MATCHING_RESULTS_FOUND: 'Không tìm thấy kết quả phù hợp',
  DECISION_IS_REQUIRED: 'Không được bỏ trống quyết định',
  DECISION_IS_MUST_BE_A_BOOLEAN: 'Quyết định phải là một giá trị đúng hoặc sai',
  USER_NOT_FOUND: 'Không tìm thấy người dùng'
} as const

export const BUSROUTE_MESSAGE = {
  START_POINT_IS_REQUIRED: 'Không được bỏ trống điểm khởi hành',
  START_POINT_LENGTH_MUST_BE_FROM_5_TO_500: 'Điểm khởi hành phải có độ dài từ 5 đến 500 ký tự',
  END_POINT_IS_REQUIRED: 'Không được bỏ trống điểm đến',
  END_POINT_LENGTH_MUST_BE_FROM_5_TO_500: 'Điểm đến phải có độ dài từ 5 đến 500 ký tự',
  START_POINT_AND_END_POINT_MUST_BE_DIFFERENT: 'Địa điểm đến và địa điếm đi không được trùng nhau',
  DEPARTURE_TIME_IS_REQUIRED: 'Không được bỏ trống thời gian khởi hành',
  DEPARTURE_TIME_MUST_BE_ISO8601: 'Thời gian khởi hành phải đúng định dạng',
  ARRIVAL_TIME_IS_REQUIRED: 'Không được bỏ trống thời gian đến dự kiến',
  ARRIVAL_TIME_MUST_BE_ISO8601: 'Thời gian khởi hành phải đúng định dạng',
  ARRIVAL_TIME_MUST_BE_GREATER_THAN_DEPARTURE_TIME: 'Thời gian đến dự kiến phải lớn hơn thời gian khởi hành',
  PRICE_IS_REQUIRED: 'Không được bỏ trống giá vé',
  PRICE_MUST_BE_A_NUMBER: 'Giá vé phải là một số',
  PRICE_MUST_BE_GREATER_THAN_0: 'Giá vé phải lớn hơn 0',
  QUANTITY_IS_REQUIRED: 'Không được bỏ trống số lượng vé',
  QUANTITY_MUST_BE_A_NUMBER: 'Số lượng vé phải là một số',
  QUANTITY_MUST_BE_GREATER_THAN_0: 'Số lượng vé phải lớn hơn 0',
  QUANTITY_MUST_BE_LESS_THAN_OR_EQUAL_TO_VEHICLE_SEATS: 'Số lượng vé phải nhỏ hơn hoặc bằng số ghế của phương tiện',
  CREATE_BUS_ROUTE_SUCCESS: 'Thêm tuyến thành công!',
  BUS_ROUTE_ID_IS_REQUIRED: 'Không được bỏ trống id tuyến xe',
  BUS_ROUTE_ID_IS_MUST_BE_A_STRING: 'Id tuyến xe phải là một chuỗi ký tự',
  BUS_ROUTE_ID_IS_MUST_BE_A_ID: 'Id tuyến xe không đúng định dạng',
  BUS_ROUTE_ID_IS_NOT_EXIST: 'Id tuyến xe không tồn tại hoặc bạn không có quyền làm điều này',
  UPDATE_BUS_ROUTE_SUCCESS: 'Cập nhật tuyến xe thành công!',
  DELETE_BUS_ROUTE_SUCCESS: 'Xóa tuyến xe thành công!',
  CURRENT_IS_REQUIRED: 'Không được bỏ trống số trang hiện tại',
  CURRENT_IS_MUST_BE_A_NUMBER: 'Số trang hiện tại phải là một số',
  CURRENT_IS_MUST_BE_GREATER_THAN_0: 'Số trang hiện tại phải lớn hơn 0',
  NO_MATCHING_RESULTS_FOUND: 'Không tìm thấy kết quả phù hợp',
  KEYWORDS_IS_REQUIRED: 'Không được bỏ trống từ khóa',
  DEPARTURE_TIME_MUST_BE_GREATER_THAN_NOW: 'Thời gian khởi hành phải lớn hơn thời gian hiện tại',
  ARRIVAL_TIME_MUST_BE_GREATER_THAN_NOW: 'Thời gian đến dự kiến phải lớn hơn thời gian hiện tại',
  PRICE_MUST_BE_LESS_THAN_100000000: 'Giá vé phải nhỏ hơn 100,000,000 vnđ'
} as const

export const ORDER_MESSAGE = {
  BUS_ROUTE_ID_IS_REQUIRED: 'Không được bỏ trống id tuyến xe',
  BUS_ROUTE_ID_MUST_BE_STRING: 'Id tuyến xe phải là một chuỗi ký tự',
  BUS_ROUTE_ID_MUST_BE_MONGO_ID: 'Id tuyến xe không đúng định dạng',
  BUS_ROUTE_ID_NOT_EXIST: 'Id tuyến xe không tồn tại',
  NAME_IS_REQUIRED: 'Không được bỏ trống tên đại diện',
  NAME_MUST_BE_STRING: 'Tên đại diện phải là một chuỗi ký tự',
  NAME_LENGTH_MUST_BE_FROM_1_TO_150: 'Tên đại diện phải có độ dài từ 1 đến 150 ký tự',
  PHONE_IS_REQUIRED: 'Không được bỏ trống số điện thoại',
  PHONE_MUST_BE_STRING: 'Số điện thoại phải là một chuỗi ký tự',
  PHONE_LENGTH_MUST_BE_FROM_10_TO_11: 'Số điện thoại phải có độ dài từ 10 đến 11 ký tự',
  PHONE_MUST_BE_MOBILE_PHONE: 'Số điện thoại không đúng định dạng',
  QUANTITY_IS_REQUIRED: 'Không được bỏ trống số lượng vé',
  QUANTITY_MUST_BE_INT: 'Số lượng vé phải là một số nguyên',
  QUANTITY_MUST_BE_GREATER_THAN_0: 'Số lượng vé phải lớn hơn 0',
  QUANTITY_MUST_BE_LESS_THAN_REMAINING_QUANTITY: 'Số lượng vé của tuyến không đủ',
  BALANCE_NOT_ENOUGH: 'Số dư của bạn không đủ để thực hiện giao dịch này',
  ORDER_SUCCESS: 'Đặt vé thành công!',
  CURRENT_IS_REQUIRED: 'Số trang hiện tại là bắt buộc',
  CURRENT_IS_MUST_BE_A_NUMBER: 'Số trang hiện tại phải là một số',
  CURRENT_IS_MUST_BE_GREATER_THAN_0: 'Số trang hiện tại phải lớn hơn 0',
  NO_MATCHING_RESULTS_FOUND: 'Không tìm thấy kết quả phù hợp',
  ORDER_ID_IS_REQUIRED: 'Không được bỏ trống id đơn hàng',
  ORDER_ID_IS_MUST_BE_A_STRING: 'Id đơn hàng phải là một chuỗi ký tự',
  ORDER_ID_IS_MUST_BE_A_MONGO_ID: 'Id đơn hàng không đúng định dạng',
  ORDER_ID_IS_NOT_EXIST: 'Id đơn hàng không tồn tại',
  QUANTITY_MUST_BE_LESS_THAN_1000: 'Số lượng vé phải nhỏ hơn 1000',
  TICKET_ID_IS_REQUIRED: 'Không được bỏ trống id vé xe',
  TICKET_ID_IS_MUST_BE_A_STRING: 'Id vé xe phải là một chuỗi ký tự',
  TICKET_ID_IS_MUST_BE_A_MONGO_ID: 'Id vé xe không đúng định dạng',
  TICKET_ID_IS_NOT_EXIST: 'Id vé xe không tồn tại',
  CANCELED_TICKET_SUCCESS: 'Đã hủy vé thành công'
} as const

export const EVALUATE_MESSAGE = {
  VEHICLE_ID_IS_REQUIRED: 'Không được bỏ trống id phương tiện',
  VEHICLE_ID_IS_MUST_BE_A_STRING: 'Id phương tiện phải là một chuỗi ký tự',
  VEHICLE_ID_IS_INVALID: 'Id phương tiện không đúng định dạng',
  VEHICLE_ID_IS_NOT_EXIST: 'Id phương tiện không tồn tại',
  VEHICLE_ID_IS_NOT_EXIST_IN_BILL: 'Bạn phải trải nghiệm phương tiện này mới có thể đánh giá',
  RATING_IS_REQUIRED: 'Không được bỏ trống xếp hạn đánh giá',
  RATING_IS_MUST_BE_A_NUMBER: 'Xếp hạng đánh giá phải là một số',
  RATING_IS_INVALID: 'Xếp hạng đánh giá không hợp lệ',
  CONTENT_IS_REQUIRED: 'Không được bỏ trống nội dung đánh giá',
  CONTENT_IS_MUST_BE_A_STRING: 'Nội dung đánh giá phải là một chuỗi ký tự',
  CONTENT_LENGTH_MUST_BE_FROM_1_TO_500: 'Nội dung đánh giá phải có độ dài từ 1 đến 500 ký tự',
  VEHICLE_ID_IS_ALREADY_EVALUATED: 'Bạn đã đánh giá cho phương tiện này rồi',
  CREATE_EVALUATE_SUCCESS: 'Đánh giá thành công!',
  EVALUATE_ID_IS_REQUIRED: 'Không được bỏ trống Id đánh giá',
  EVALUATE_ID_IS_MUST_BE_A_STRING: 'Id đánh giá phải là một chuỗi ký tự',
  EVALUATE_ID_IS_INVALID: 'Id đánh giá không đúng định dạng',
  EVALUATE_ID_IS_NOT_EXIST: 'Id đánh giá không tồn tại hoặc bạn không có quyền làm điều này',
  UPDATE_EVALUATE_SUCCESS: 'Cập nhật đánh giá thành công!',
  DELETE_EVALUATE_SUCCESS: 'Xóa đánh giá thành công!',
  CURRENT_IS_REQUIRED: 'Không được bỏ trống số trang hiện tại',
  CURRENT_IS_MUST_BE_A_NUMBER: 'Số trang hiện tại phải là một số',
  CURRENT_IS_MUST_BE_GREATER_THAN_0: 'Số trang hiện tại phải lớn hơn 0',
  NO_MATCHING_RESULTS_FOUND: 'Không tìm thấy kết quả phù hợp',
  CREATE_EVALUATE_FEEDBACK_SUCCESS: 'Gửi phản hồi đánh giá thành công!',
  EVALUATE_ID_IS_ALREADY_HAVE_FEEDBACK: 'Bạn đã gửi phản hồi cho đánh giá này rồi',
  EVALUATE_ID_IS_NOT_HAVE_FEEDBACK: 'Bạn chưa gửi phản hồi cho đánh giá này',
  UPDATE_EVALUATE_FEEDBACK_SUCCESS: 'Cập nhật phản hồi đánh giá thành công!',
  DELETE_EVALUATE_FEEDBACK_SUCCESS: 'Xóa phản hồi đánh giá thành công!'
} as const
