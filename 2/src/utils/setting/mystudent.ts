import axios from '@/utils/axios/axios'
import type { AxiosResponse, AxiosError } from 'axios'

export interface myStudentInterface{
    name: string
    is_check: number
    school: number
    email: string
    phone: string
    typeNumber: [number, number, number, number, number]
    processNumber: number
    onlineTodayNumber: [number, number, number, number, number]
    experiTodayNumber: [number, number, number, number, number]
    processTodayNumber: number
}
export function getMystudent() {
    return new Promise((resolve: (value:myStudentInterface[])=>void, reject) => {
        axios.post(
            'user/getMyStudents/'
        ).then(
            (response: AxiosResponse) => {
                resolve(response.data.responses)
            }
        )
    })
}