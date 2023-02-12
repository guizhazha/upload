// npm install axios --save
import axios from 'axios'
import { ElMessage } from 'element-plus'

axios.defaults.baseURL = 'http://127.0.0.1:8000/api/v1/'
// axios.defaults.baseURL = 'http://192.168.1.138:3000/api/v1/'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

// 请求拦截
axios.interceptors.request.use(
	config => {
		const token = localStorage.getItem("token") || ''
		if (config && config.headers) { //将token放到请求头发送给服务器
			config.headers['token'] = token
		}
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

// 响应拦截

// (0, "error")
// (1, "warn")
// (2, "info")
// (3, "debug")
// (4, "trace")
axios.interceptors.response.use(
	response => {
		if(response && response.data){
			switch(response.data.code){
				case 'error':
					ElMessage({
						message: response.data.message,
						type: 'error',
					})
					return response
				case 'warn':
					ElMessage({
						message: response.data.message,
						type: 'warning',
					})
					break;
				case 'info':
					ElMessage({
						message: response.data.message,
						type: 'success',
					})
					return response
				default:
					return response
			}
		}else{
			return response
		}
	},
    error => {
		if (error && error.response) {
			error.message =  error.response.data
		} else {
			error.message = 'other error!!!'
		}
		return Promise.reject(error)
    }
)

export default axios