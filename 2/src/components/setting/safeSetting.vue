<template>
    <el-descriptions
        :title="t('setting.safe')"
        direction="vertical "
        column="1"
        border
        >
        <el-descriptions-item>
            <template #label>
                <div class="cell-item">
                    {{t('enter.password')}}
                    <el-tooltip 
                        effect="dark"
                        :content="t('setting.seePassword')"
                        placement="top-start">
                        
                        <el-button type="text" @click="showPassword = !showPassword">
                            <img src="../../assets/image/staff/seePassword.svg" />
                        </el-button>

                        <!-- <el-button type="text" @click="changePassword">
                            <img src="../../assets/image/staff/seePassword.svg" />
                        </el-button> -->
                    </el-tooltip>
                </div>
            </template>
            <div v-if="showPassword">
                {{ password }}
            </div>
            <div v-else>
                <img src="../../assets/image/staff/unshowPassword.svg" />
            </div>
        </el-descriptions-item>
    </el-descriptions>
</template>

<script lang="ts" setup>
import axios from '@/utils/axios/axios'
import type { AxiosResponse, AxiosError } from 'axios'

import {ref,onMounted} from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const password = ref()
const showPassword = ref(false)
onMounted(() => {
    axios.post(
        'user/getPassword/'
    ).then(
        (response: AxiosResponse) => {
            password.value = response.data.password
        }
    )
})

// const isChange = ref(false)
// const changePassword = () => {
//     showPassword.value = true
//     isChange.value = true
//     axios.post(
//         'user/setPassword/',
//         {
//             password: password.value
//         }
//     )
// }
</script>

<style scoped lang="scss">
@import "@/assets/scss/base/size.scss";

.el-descriptions{
    width: map-get($length, size-14);
    ::v-deep .el-descriptions__label{
        width: map-get($length, size-10);
    }
}

</style>