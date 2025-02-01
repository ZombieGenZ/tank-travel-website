import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/enum'

export interface EmailVerifyBody {
  email: string
}

export interface RegisterRequestBody {
  display_name: string
  email: string
  phone: string
  password: string
  confirm_password: string
}

export interface LoginRequestBody {
  email: string
  password: string
}

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
}

export interface LogoutRequestBody {
  refresh_token: string
}

export interface SendForgotPasswordBody {
  email: string
}

export interface ForgotPasswordBody {
  token: string
  new_password: string
  comform_new_password: string
}
