<template>
	<el-container>
		<el-header>
			<Header />
		</el-header>
		<el-container>
			<el-aside :class="isFold ? 'el-aside-fold': 'el-aside-unfold'"  >
				<Sider />
			</el-aside>
			<el-main>
				<router-view v-slot="{ Component }">
					<!-- <keep-alive> -->
						<component :is="Component" />
					<!-- </keep-alive> -->
				</router-view>
			</el-main>
		</el-container>
	</el-container>
</template>

<script lang="ts" setup>
import Header from '@/components/component/header.vue';
import Sider from '@/components/component/sider.vue';

import { storeToRefs } from 'pinia'
import { clickButton } from '@/pinia/button'

const button = clickButton()
const { isFold } = storeToRefs(button)

</script>

<style scoped lang="scss">
@import "@/assets/scss/base/size.scss";

.el-header {
	padding: 0;
	height: $header-height;
}
.el-aside-fold {
	width: $sider-fold-width;
}
.el-aside-unfold {
	width: $sider-unfold-width;
}
.el-main {
	padding: 0;
}
</style>
  