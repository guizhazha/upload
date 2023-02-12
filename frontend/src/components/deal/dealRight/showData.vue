<template>
	<el-collapse 
		v-model="activeName"
		@change="handleChange"
		accordion
		>
		<div v-for="(single, index) in uploadData[num]" :key="index">
			<el-collapse-item :title="single.dataName" :name="index">
				<h2>{{t("deal.dataState")}}</h2>
				<h3>{{t("deal.isSU")}}{{ single.isSuccess }}</h3>
				<div v-if="single.isSuccess">
					<h3>{{t("deal.testTime")}}{{ single.testTime }}</h3>
					<h3>{{t("deal.proId")}}{{ single.processId }}</h3>
					<h3>{{t("deal.samId")}}{{ single.sampleId }}</h3>
					<h3>
						{{t("deal.rank")}}
						<el-rate
							@change="sendRank(single.dataName, rank[index])"
							v-model="rank[index]"
							:texts="[t('deal.rank1'), t('deal.rank2'), t('deal.rank3'), t('deal.rank4'), t('deal.rank5')]"
							show-text/>
					</h3>
				</div>
				<div v-else>
					<h3>{{t("deal.error")}}{{ t(single.message) }}</h3>
				</div>
				<div v-if="single.xAxisName !== undefined">
					<h2>{{t("deal.expInfo")}}</h2>
					<h3>{{t("deal.xAxis")}}{{ single.xAxisName }}</h3>
					<h3>{{t("deal.yAxis")}}{{ single.yAxisName }}</h3>
				</div>
			</el-collapse-item>
		</div>
	</el-collapse>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { changeDeal } from '@/pinia/deal'
import { changeRoute } from '@/pinia/route'

import axios from '@/utils/axios/axios'

import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const deal = changeDeal()
const {uploadData} = storeToRefs(deal)
const route = changeRoute()
const { dataType, num } = storeToRefs(route)

const rank = ref<number[]>([])
function sendRank(name: string, rank: number) {
	axios.post(
		'data/updateRank/',
		{
			dataType: dataType.value,
			dataName: name,
			rank: rank
		}
	)
}
const activeName = ref(0)
const handleChange = (value: number) => {
	console.log('value', value)
}
</script>

<style scoped lang="scss">
@import "@/assets/scss/collapse.scss";
</style>
  