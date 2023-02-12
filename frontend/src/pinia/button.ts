import { defineStore } from "pinia"


export interface buttonState {
    isFold: boolean;
    isFull: boolean;
    isRight: boolean;
    isClose: boolean;
    language: string;
    isExist: boolean;
    isTeacher: boolean;
}

export const clickButton = defineStore({
    id: 'button', 
    state: ():buttonState => ({
        isFold: true,
        isFull: false,  
        isRight: false,
        isClose: false,
        language: navigator.language.toLowerCase(),
        isExist: true,
        isTeacher: false
    }),
    getters: {
    },
    actions: {
        setExist(){
            this.isExist = true
        },
        setTeacher(){
            this.isTeacher = true
        },

        initButton(){
            this.isFold = true
            this.isFull = false
            this.isRight = false
            this.isClose = false
            this.language = navigator.language.toLowerCase()
            this.isExist = true
            this.isTeacher = false
        }
    }
})
