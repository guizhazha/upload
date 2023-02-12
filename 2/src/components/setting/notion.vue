<template>
    <el-collapse v-model="activeNames">
        <!-- 发送消息 -->
        <el-collapse-item :title="t('setting.sendMessage')" name="1">
            <div class="send-message">
                <span>
                    To:
                </span>
                <el-cascader
                    :options="all"
                    @change="handleChange"
                    :show-all-levels="false"
                    filterable
                    clearable>
                    <template #default="{ node, data }">
                        <span>{{ t(data.label) }}</span>
                        <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                    </template>
                </el-cascader>
                <el-button
                    icon="Promotion"
                    circle
                    @click="sendMessage" />
            </div>
            
            <el-input
                v-model="textarea"
                maxlength="100"
                placeholder="Please input"
                show-word-limit
                type="textarea"
                />
        </el-collapse-item>

        <!-- 获得消息和通知 -->
        <el-collapse-item :title="t('setting.myNot')" name="2">
            <div v-for="not, index in nots" :key="index">
                <span>{{not.time}}</span>
                <span>{{not.content}}</span>
                <el-divider v-show="index + 1 !== nots.length" />
            </div>

            <div v-for="message, index in messages" :key="index">
                <h5>from: {{message.send_id}}</h5>
                <span>{{message.time}}</span>
                <span>{{message.content}}</span>
                <el-divider v-show="index + 1 !== messages.length" />
            </div>
        </el-collapse-item>
    </el-collapse>

    
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import axios from '@/utils/axios/axios'
import type { AxiosResponse, AxiosError } from 'axios'
import {getAll,studentInterface} from '@/utils/setting/allStudents'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const activeNames = ref(['1', '2'])

// 获取全部成员
const all = ref<studentInterface[]>([])
onMounted(() => {
    const p = getAll()
    p.then((allBack:studentInterface[])=>{
        all.value = allBack
    })
})

const toEmail = ref('')
interface backInterface{
    // 学校
    0: number,
    // 邮箱
    1: string
}
const handleChange = (single: backInterface) => {
    toEmail.value = single[1]
}

const textarea = ref('')
const sendMessage = () => {
    if(toEmail.value === '' || textarea.value === '') return 

    axios.post(
        'message/sendMessage/',
        {
            to_id: toEmail.value,
            content: textarea.value
        }
    )
}

const nots = ref<{[key:string]: string}[]>([])
const messages = ref<{[key:string]: string}[]>([])

onMounted(() => {
    axios.post(
        'message/getAllNotionView/'
    ).then(
        (response: AxiosResponse) => {
            nots.value = response.data.responses
        }
    )

    axios.post(
        'message/getMyMessage/'
    ).then(
        (response: AxiosResponse) => {
            messages.value = response.data.responses
        }
    )
})
</script>

<style scoped lang="scss">
@import "@/assets/scss/base/size.scss";

.send-message{
    height: map-get($length, size-7);
    .el-button{
        font-size: map-get($length, size-4);
        color: rgb(238, 184, 113);
        float: right;
        margin-right: map-get($length, size-6);
    }
}

::v-deep .el-collapse-item__header{
    background-color: rgb(133, 166, 166);
    padding-left: map-get($length, size-4);
}

::v-deep .el-collapse-item__content{
    padding-top: map-get($length, size-4);

    padding-left: map-get($length, size-6);
    padding-right: map-get($length, size-8);
}
</style>
