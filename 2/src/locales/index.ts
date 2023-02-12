import { createI18n } from 'vue-i18n'

import elementEnLocale from 'element-plus/lib/locale/lang/en'
import elementZhLocale from 'element-plus/lib/locale/lang/zh-cn'

import enLocale from '@/locales/en.json'
import zhLocale from '@/locales/zh-cn.json'

import { storeToRefs } from 'pinia'
import { clickButton } from '@/pinia/button'
const button = clickButton()
const { language } = storeToRefs(button)

const messages = {
	en: {
		...enLocale,
		...elementEnLocale
	},
	'zh-cn': {
		...zhLocale,
		...elementZhLocale
	}
}

const i18n = createI18n({
	legacy: false,
	globalInjection: true,
	locale: language.value,
	messages: messages
})

export default i18n
