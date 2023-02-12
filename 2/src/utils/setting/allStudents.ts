import axios from '@/utils/axios/axios'
import type { AxiosResponse, AxiosError } from 'axios'
import {getSchool} from '@/utils/setting/school'
import { getEmail } from '@/utils/cookies/cookies'

interface childrenInterface{
    value: string,
    label: string,
    disabled?: boolean
}
export interface studentInterface{
    value: number,
    label: string,
    children?: childrenInterface[],
    disabled?: boolean
}
export function getAllstudents(emailList: string[]) {
    return new Promise((resolve: (value:studentInterface[])=>void, reject) => {
        axios.post(
            'user/getAllStudents/'
        ).then(
            (response: AxiosResponse) => {
                const allStudents:studentInterface[] = []

                const schoolsNumber = 2
                for(const index of Array.from(new Array(schoolsNumber).keys()).slice(0)){
                    if(response.data.response[index] !== undefined){
                        const children: childrenInterface[] = []

                        for(const res of response.data.response[index]){
                            if(emailList.includes(res.email)){
                                children.push({
                                    value: res.email,
                                    label: res.name + '(✔)',
                                    disabled: true
                                })
                            }else{
                                children.push({
                                    value: res.email,
                                    label: res.name,
                                    disabled: false
                                })
                            }
                            
                        }
                        allStudents.push({
                            value: index,
                            label: getSchool(index),
                            children: children
                        })
                    }else{
                        allStudents.push({
                            value: index,
                            label: getSchool(index),
                            disabled: true
                        })
                    }
                }

                resolve(allStudents)
            }
        )
    })
}


export function getAll() {
    const email = getEmail()

    return new Promise((resolve: (value:studentInterface[])=>void, reject) => {
        axios.post(
            'user/getAll/'
        ).then(
            (response: AxiosResponse) => {
                const all:studentInterface[] = []

                const schoolsNumber = 2
                for(const index of Array.from(new Array(schoolsNumber).keys()).slice(0)){
                    if(response.data.responses[index] !== undefined){
                        const children: childrenInterface[] = []

                        for(const res of response.data.responses[index].response){
                            if(email == res.email){
                                children.push({
                                    value: res.email,
                                    label: res.name,
                                    disabled: true
                                })
                            }else{
                                children.push({
                                    value: res.email,
                                    label: res.name,
                                    disabled: false
                                })
                            }
                        }
                        all.push({
                            value: index,
                            label: getSchool(index),
                            children: children
                        })

                        console.log('all', all)
                    }else{
                        all.push({
                            value: index,
                            label: getSchool(index),
                            disabled: true
                        })
                    }
                }

                resolve(all)
            }
        )
    })
}