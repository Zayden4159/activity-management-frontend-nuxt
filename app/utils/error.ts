// utils/error.ts
import axios from 'axios'
import type { ApiErrorResponse } from '~/types/api'

export const getErrorMessage = (err: unknown): string => {
    if (axios.isAxiosError<ApiErrorResponse>(err)) {
        const errorData = err.response?.data?.error

        if (errorData) {
            const msg = errorData.message
            if (typeof msg === 'string') return msg
        }

        if (err.code === 'ERR_NETWORK') return 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้'
        if (err.code === 'ECONNABORTED') return 'เซิร์ฟเวอร์ตอบกลับช้าเกินไป'

        return err.message
    }

    if (err instanceof Error) return err.message
    return 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ'
}