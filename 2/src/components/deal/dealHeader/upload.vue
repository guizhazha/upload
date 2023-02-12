<template>
    <el-scrollbar height="192px">
        <el-row v-if="dataType === 'XRD'">
            <el-col :lg="1" :sm="1" :xs="0" ></el-col>
            <el-col :lg="4" :sm="4" :xs="24" class="upload-xrd">
                <uploadXRD />
            </el-col>
            <el-col :lg="2" :sm="1" :xs="0" ></el-col>
            <el-col :lg="6" :sm="8" :xs="24">
                <uploadData />
            </el-col>
            <el-col :lg="3" :sm="1" :xs="0" ></el-col>
            <el-col :lg="6" :sm="8" :xs="24">
                <uploadFile />
            </el-col>
            <el-col :lg="2" :sm="1" :xs="0" ></el-col>
        </el-row>
    
        <el-row v-else>
            <el-col :lg="4" :sm="2" :xs="0" ></el-col>
            <el-col :lg="6" :sm="9" :xs="24">
                <uploadData />
            </el-col>
            <el-col :lg="4" :sm="2" :xs="0" ></el-col>
            <el-col :lg="6" :sm="9" :xs="24">
                <uploadFile />
            </el-col>
            <el-col :lg="4" :sm="2" :xs="0" ></el-col>
        </el-row>
    </el-scrollbar>
</template>

<script lang="ts" setup>
import uploadXRD from '@/components/deal/dealHeader/uploadXRD.vue';
import uploadData from '@/components/deal/dealHeader/uploadData.vue';
import uploadFile from '@/components/deal/dealHeader/uploadFile.vue';

import { storeToRefs } from 'pinia'
import { changeRoute } from '@/pinia/route'

const route = changeRoute()
const { dataType } = storeToRefs(route)
</script>

<style scoped lang="scss">
@import "@/assets/scss/base/size.scss";

// .el-scrollbar 上方设置了高度
.el-row, .el-col {
    height: $upload-height;
}
</style>