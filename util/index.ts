import { CallBackStatus } from '../services/types'

export function tokenExpiration(timestamp: Date): Number {
    return (Date.now() - timestamp.getTime()) / 1000
}

export function generateCallback(url: string, status: CallBackStatus = null, message: string = null, params: any = {}) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    return baseUrl + url + '/?' + new URLSearchParams({
        ...params,
        status: status,
        message: message
    })
}