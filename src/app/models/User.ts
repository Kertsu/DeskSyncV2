export interface User {
    id?: string
    passwordResetToken?: PasswordResetToken
    _id?: string
    username?: string
    password?: string
    email?: string
    isDisabled?: number
    role?: string
    createdAt?: string
    updatedAt?: string
    __v?: number
    avatar?: string
    banner?: string
    receivingEmail?: boolean
    description?: string
    passwordChangedAt?: string
  }
  
  export interface PasswordResetToken {
    expiresAt: string
    token: string
  }