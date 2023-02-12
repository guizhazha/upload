<template>
	<el-config-provider :locale="language  === 'zh-cn' ? elementZhLocale: elementEnLocale">
		<router-view />
	</el-config-provider>
</template>

<script lang="ts" setup>
import { ElConfigProvider } from 'element-plus'
import { storeToRefs } from 'pinia'
import { clickButton } from '@/pinia/button'

import elementEnLocale from 'element-plus/lib/locale/lang/en'
import elementZhLocale from 'element-plus/lib/locale/lang/zh-cn'

const button = clickButton()
const { language } = storeToRefs(button)

</script>

<style scoped lang="scss">
</style>
