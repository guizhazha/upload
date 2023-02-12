<template>
	<el-checkbox-group
		v-model="checkData[num]"
		@change="handleCheck"
		>
		<div v-for="echart, index in uploadData[num]" :key="index" class="response">
			<el-checkbox :label="index" border>
				{{index + 1}}
			</el-checkbox>
			<div v-if="echart.xAxisName !== undefined" :id="'echart' + index">
				{{ plot(echart, index) }}
				<el-table 
					v-show="num === 0"
					:data="echart.table"
					>
					<!-- <el-table-column prop="scan" width="110" :label="t('echarts.scan')"/> -->
					<el-table-column 
						width="120"
						:label="t('echarts.scan')"
						align="center"
						prop="scan">
						<template #default="props">
							{{ t(props.row.scan) }}
						</template>
					</el-table-column>
					<el-table-column prop="Jsc" width="70" label="Jsc"/>
					<el-table-column prop="Voc" width="70" label="Voc"/>
					<el-table-column prop="FF" width="60" label="FF"/>
					<el-table-column prop="Eff" width="70" label="Eff"/>
				</el-table>	
			</div>
			<div v-else>
				<img :id="'echart' + index" src="../../../assets/image/deal/24gl-pictureSplit.svg" >
			</div>
		</div>
	</el-checkbox-group>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { changeRoute } from '@/pinia/route'
import { changeDeal, result } from '@/pinia/deal'
import {getOption} from '@/utils/deal/option/option'

import { nextTick } from 'vue'
import * as echarts from 'echarts'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const deal = changeDeal()
const {uploadData,checkData} = storeToRefs(deal)
const route = changeRoute()
const { num } = storeToRefs(route)

const plot = (echart: result, index: number) => {
	if(echart.xAxisName === undefined) {
		// 输出一张 损坏图
		console.log('error', echart.message)
	}
	nextTick(() => {
		const myEcharts = echarts.init(document.getElementById('echart' + index), undefined, { renderer: 'svg' })
		const option = getOption(echart)
		myEcharts.setOption(option)
	})
}

const handleCheck = (value: number[]) => {
	// value的值是上方label的值
	const checkedCount = value.length
	const allCount = uploadData.value[num.value].length
	
	const isCheck = checkedCount === allCount
	const isInde = checkedCount > 0 && checkedCount < allCount
	deal.setCheck(num.value, isCheck)
	deal.setInde(num.value, isInde)
}
</script>

<style scoped lang="scss">
@import "@/assets/scss/base/size.scss";
@import "@/assets/scss/echart.scss";
.response {
	display: inline-block;
	padding-bottom: map-get($length, size-6);
}
</style>
