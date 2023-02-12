<template>
    <el-table
        :data="responce"
        border 
		stripe 
        table-layout="fixed"
        default-expand-all
        @selection-change="handleSelectionChange"
        >
        <el-table-column>
			<template #header>
				<plotAll :isShow="true" :checkDATA="checkDATA"/>
			</template>

            <el-table-column type="selection" />
            
            <el-table-column 
				type="expand" 
				:label="t('show.add')"
                width="120">
				<template #default="props">
                    <el-row>
                        <el-col :lg="8" :sm="12" :xs="24" class="upload-xrd">
                            <div :id="'echart' + props.row.id" class="echart"/>
                            {{ plot(props.row, props.row.id) }}
                        </el-col>
                        <el-col :lg="8" :sm="12" :xs="24" v-if="dataType === 'JV'">
                            <el-table :data="props.row.table">
                                <!-- <el-table-column prop="scan" width="120" :label="t('echarts.scan')"/> -->
                                <el-table-column 
                                    width="120"
                                    :label="t('echarts.scan')"
                                    align="center"
                                    prop="scan">
                                    <template #default="props">
                                        {{ t(props.row.scan) }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="Jsc" label="Jsc"/>
                                <el-table-column prop="Voc" label="Voc"/>
                                <el-table-column prop="FF" label="FF"/>
                                <el-table-column prop="Eff" label="Eff"/>
                            </el-table>
                        </el-col>
                        <el-col :lg="dataType === 'JV' ? 8: 16" :sm="12" v-show="props.row.file !== false">
                            <el-scrollbar height="300px">
                                {{ props.row.file }}
                            </el-scrollbar>
                        </el-col>
                    </el-row>
				</template>
			</el-table-column>
        </el-table-column>
		
        <el-table-column 
            :label="t('show.info')">
            <el-table-column 
                prop="email" 
                :label="t('enter.email')"
                sortable 
                />

            <el-table-column 
                prop="processId" 
                :label="t('show.processId')"
                sortable 
                align="right"
                />
            <el-table-column 
                prop="sampleId" 
                :label="t('show.sampleId')"
                sortable 
                align="right"
                />
        </el-table-column>

        
        <el-table-column 
            v-if="id == '0'"
            :label="t('show.operation')">

            <el-table-column 
                :label="t('show.rank')"
                prop="rank" 
                sortable>
                <template #default="props">
                    <el-rate
                        @change="sendRank(props.row.id, props.row.rank)"
                        v-model="props.row.rank"
                        :texts="[t('deal.rank1'), t('deal.rank2'), t('deal.rank3'), t('deal.rank4'), t('deal.rank5')]"
                        :disabled="email !== props.row.email"
                        show-text/>
                </template>
            </el-table-column>

            <el-table-column 
                :label="t('show.isPublic')"
                prop="isPublic" 
                sortable
                align="center">
                <template #default="props">
                    <el-switch
                        :disabled="email !== props.row.email"
                        @change="changePublicStatus(props.row.id, props.row.isPublic)"
                        v-model="props.row.isPublic"
                        inline-prompt
                        style="--el-switch-on-color: #84E898; --el-switch-off-color: #F9F871"
                        active-text="Y"
                        inactive-text="N"/>
                </template>
            </el-table-column>
            <el-table-column 
                fixed="right"
                :label="t('show.delete')"
                align="center">

                <template #default="props">
                    <el-button 
                        :disabled="email !== props.row.email"
                        type="danger"
                        @click="handleDelete(props.row.id)">
                        {{t('show.delete')}}
                    </el-button>
                </template>
            </el-table-column>
        </el-table-column>
        
    </el-table>
</template>

<script lang="ts" setup>
import axios from '@/utils/axios/axios'
import type { AxiosResponse, AxiosError } from 'axios'

import { storeToRefs } from 'pinia'
import { changeRoute } from '@/pinia/route'
import {result} from '@/pinia/deal'
import { getEmail } from '@/utils/cookies/cookies'

import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import plotAll from '@/components/deal/dealCheck/plotAll.vue'
import {getOption} from '@/utils/deal/option/option'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const email = getEmail()

const route = changeRoute()
const { dataType, id } = storeToRefs(route)

const responce = ref<result[]>([])
if(id.value === 'all'){
    onMounted(() => {
        axios.post(
            'data/getResponseData/',
            {
                dataType: dataType.value
            }
        ).then(
            (response: AxiosResponse) => {
                responce.value = response.data.responses
            }
        )
    })
}else if(id.value === '0'){
    onMounted(() => {
        axios.post(
            'data/getMyResponseData/',
            {
                dataType: dataType.value,
                email: email
            }
        ).then(
            (response: AxiosResponse) => {
                responce.value = response.data.responses
            }
        )
    })
}else{
    onMounted(() => {
        axios.post(
            'data/getMyResponseData/',
            {
                dataType: dataType.value,
                email: id.value
            }
        ).then(
            (response: AxiosResponse) => {
                responce.value = response.data.responses
            }
        )
    })
}

const plot = (echart: result, index: number) => {
    nextTick(() => {
		const myEcharts = echarts.init(document.getElementById('echart' + index), null, { renderer: 'svg' })
		const option = getOption(echart)

		myEcharts.setOption(option)
	})
}

function sendRank(id: number, rank: number) {
	axios.post(
		'data/updateRank/',
		{
			id: id,
            rank: rank
		}
	)
}
function changePublicStatus (id: number, isPublic: boolean) {
    axios.post(
		'data/updatePublic/',
		{
			id: id,
            isPublic: isPublic
		}
	)
}

const handleDelete = (id: number) => {
    ElMessageBox.confirm(
        t("notice.isDelete"),
        t("notice.warn"),
        {
            confirmButtonText: t("notice.sure"),
            cancelButtonText: t("notice.cancel"),
            type: 'warning',
        })
        .then(() => {
            axios.post(
                'data/delete/',
                {
                    id: id
                }
            )

            ElMessage({
                type: 'success',
                message: t("notice.delete"),
            })
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: t("notice.cancel"),
            })
    })
}

const checkDATA = ref<result[]>()
const handleSelectionChange = (value: result[]) => {
    checkDATA.value = value
    console.log('checkData.value', checkDATA.value)
}
</script>
<style scoped lang="scss">
@import "@/assets/scss/echart.scss";
</style>