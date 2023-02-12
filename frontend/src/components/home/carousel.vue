<template>
    <el-carousel height="256px">
        <el-carousel-item>
            <h2>{{t('home.title')}}</h2>
            <el-steps align-center>
                <el-step :title="t('components.home')" :description="t('home.home')" />
                <el-step :title="t('components.deal')" :description="t('home.deal')" />
                <el-step :title="t('components.show')" :description="t('home.show')" />
                <el-step :title="t('components.baseInfo')" :description="t('home.baseInfo')" />
            </el-steps>
        </el-carousel-item>
        <el-carousel-item>
            <el-card shadow="hover">
                <h4>{{t('home.person')}} {{number.userNumber}}</h4>
                <el-divider content-position="right">{{t('home.personIn')}}</el-divider>
                <div>
                    <h5>{{t('home.manager')}}{{number.managerNumber}}</h5>
                    <h5>{{t('home.teacher')}}{{number.teacherNumber}}</h5>
                    <h5>{{t('home.student')}}{{ number.userNumber - number.teacherNumber }}</h5>
                </div>
            </el-card>
            <el-card shadow="hover">
                <h4>{{t('home.data')}}</h4>
                <el-divider content-position="right">{{t('home.dataIn')}}</el-divider>
                <div>
                    <h5>{{t('home.expris')}}{{number.exprisNumber}}</h5>
                    <h5>{{t('home.pros')}}{{number.prosNumber}}</h5>
                    <h5>{{t('home.onlines')}}{{number.onlinesNumber}}</h5>
                </div>
           </el-card>
        </el-carousel-item>
    </el-carousel>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from 'vue'
import axios from '@/utils/axios/axios'
import type { AxiosResponse, AxiosError } from 'axios'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const number = reactive({
    userNumber: 0,
    managerNumber: 0,
    teacherNumber: 0,
    exprisNumber: 0,
    prosNumber: 0,
    onlinesNumber: 0,
})
onMounted(() => {
    axios.post(
        'user/getNumber/'
    ).then(
        (response: AxiosResponse) => {
            number.userNumber = response.data.response['userNumber']
            number.managerNumber = response.data.response['managerNumber']
            number.teacherNumber = response.data.response['teacherNumber']
            number.exprisNumber = response.data.response['exprisNumber']
            number.prosNumber = response.data.response['prosNumber']
            number.onlinesNumber = response.data.response['onlinesNumber']
        }
    )
})
</script>

<style scoped lang="scss">
@import "@/assets/scss/base/size.scss";

h2 {
    text-align: center;
}
h4, h5 {
    margin: map-get($length, size-3);
}
.el-carousel__item {
    ::v-deep .el-card__body {
        padding: map-get($length, size-2);
    }
    &:last-child {
        display: flex;
        justify-content: space-around;
    }

    .el-card {
        width: 40%;
    }
}
</style>