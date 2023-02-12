import { getEmail, removeEmail } from "@/utils/cookies/cookies";

import { createRouter, createWebHistory } from 'vue-router'
import { enterRouter } from '@/routers/enter'
import { componentRouter } from '@/routers/component'

import { clickButton } from '@/pinia/button'
import { changeDeal } from '@/pinia/deal'
import { changeRoute } from '@/pinia/route'
import { addData } from '@/pinia/uploadData'

const routers = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes: [...enterRouter, ...componentRouter]
})

// 路由前导
routers.beforeEach((to, from, next) => {
	if (to.path == '/login') {
		removeEmail()
		localStorage.removeItem('token')
		localStorage.removeItem('admin')

		const button = clickButton()
		button.initButton()
		const deal = changeDeal()
		deal.initDeal()
		const route = changeRoute()
		route.initRoute()
		const data = addData()
		data.initUpload()

		next()
	} else if (to.path == '/register') {
		next()
	} else if (getEmail()) {
		next()
	} else {
		next('/login')
	}
})

export default routers;

