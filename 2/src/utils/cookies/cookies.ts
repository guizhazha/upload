// npm install js-cookie --save
// npm install --save @types/js-cookie
import Cookies from "js-cookie";

export const emailKey = 'email'

export function setEmail(email: string, cookieExpires: number) {
    if (cookieExpires == 0) {
        return Cookies.set(emailKey, email)
    } else {
        const curDate = new Date()
        curDate.setTime(curDate.getTime() + 24 * 60 * 60 * 1000 * cookieExpires)
        return Cookies.set(emailKey, email, { expires: curDate })
    }
}

export function getEmail() {
    return Cookies.get(emailKey)
}

export function removeEmail() {
    return Cookies.remove(emailKey)
}
