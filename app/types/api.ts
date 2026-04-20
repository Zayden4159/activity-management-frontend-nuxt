export interface ApiErrorDetail {
    code: number
    messageKey: string
    message: string
}

export interface ApiSuccessResponse<T = unknown> {
    success: true
    status: number
    message?: string
    data?: T
    totalPages?: number
}

export interface ApiErrorResponse {
    success: false
    status: number
    error: ApiErrorDetail
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse


export type ErrorKey =
    | 'INVALID_INPUT'
    | 'UNAUTHORIZED'
    | 'PERMISSION_DENIED'
    | 'SERVER_ERROR'
    | 'TELEGRAM_INVALID_DATA'
    | 'TELEGRAM_INVALID_TOKEN'
    | 'TELEGRAM_BOT_ALREADY_EXISTS'
    | 'TELEGRAM_SEND_MESSAGE_FAILED'
    | 'TELEGRAM_BOT_NOT_IN_GROUP'