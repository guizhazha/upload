import axios from '@/utils/axios/axios'

export function online(describe: string) {
    axios.post(
        'loggings/online/',
        {
            describe: describe
        }
    )
}