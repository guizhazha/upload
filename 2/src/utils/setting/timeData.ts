import axios from '@/utils/axios/axios'
import type { AxiosResponse, AxiosError } from 'axios'

export interface timeInterface{
    time: number
    start_date: Date
    end_date: Date
    name: string
    experiNumber: [number, number, number, number, number]
}
export function getWeekData(email: string, name:string, week: number){
    return new Promise((resolve: (week:timeInterface)=>void, reject) => {
        axios.post(
            'data/getWeekData/',
            {
                'email': email,
                'week': week
            }
        ).then(
            (response: AxiosResponse) => {
                const result = {
                    time: week,
                    start_date: response.data.start_date,
                    end_date: response.data.end_date,
                    name: name,
                    experiNumber: response.data.experiWeekNumber
                }
                resolve(result)
            }
        )
    })
}
export function getMonthData(email: string, name:string, month: number){
    return new Promise((resolve: (result:timeInterface)=>void, reject) => {
        axios.post(
            'data/getMonthData/',
            {
                'email': email,
                'month': month
            }
        ).then(
            (response: AxiosResponse) => {
                const result = {
                    time: month,
                    start_date: response.data.start_date,
                    end_date: response.data.end_date,
                    name: name,
                    experiNumber: response.data.experiMonthNumber
                }
                resolve(result)
            }
        )
    })
}
export function getYearData(email: string, name:string, year: number){
    return new Promise((resolve: (result:timeInterface)=>void, reject) => {
        axios.post(
            'data/getYearData/',
            {
                'email': email,
                'year': year
            }
        ).then(
            (response: AxiosResponse) => {
                const result = {
                    time: year,
                    start_date: response.data.start_date,
                    end_date: response.data.end_date,
                    name: name,
                    experiNumber: response.data.experiYearNumber
                }
                resolve(result)
            }
        )
    })
}