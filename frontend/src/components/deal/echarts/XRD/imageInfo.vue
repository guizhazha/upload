<template>
    <div class="image-info">
        <h3>
            {{t("deal.leftTop")}}
            <span @click="isIn=true">
                <span v-if="isIn">
                    <el-input @blur="isIn=false" v-model="x0"></el-input>
                </span>
                <span v-else>
                    {{x0}}
                </span>
            </span>
            , 
            <span @click="isIn=true">
                <span v-if="isIn">
                    <el-input @blur="isIn=false" v-model="y0"></el-input>
                </span>
                <span v-else>
                    {{y0}}
                </span>
            </span>
        </h3>
        <h3>
            {{t("deal.rightBottom")}}
            <span @click="isIn=true">
                <span v-if="isIn">
                    <el-input @blur="isIn=false" v-model="x1"></el-input>
                </span>
                <span v-else>
                    {{x1}}
                </span>
            </span>
            , 
            <span @click="isIn=true">
                <span v-if="isIn">
                    <el-input v-model="y1"></el-input>
                </span>
                <span v-else>
                    {{y1}}
                </span>
            </span>
        </h3>
    
        <h3>
            {{t("deal.number")}}{{ number }}
        </h3>
        
        <h3>
            {{t("deal.yAxis")}}
            <el-input 
                v-model="yAxisName" 
                :placeholder="t('deal.yAxis')" 
                clearable 
                />
        </h3>
        
        <h3>
            {{t("deal.xAxisBegin")}}
            <el-input 
                style="border: 1px solid red"
                v-model="xAxisBegin" 
                :placeholder="t('deal.xAxisBegin')" 
                clearable 
                />
        </h3>
        <h3>
            {{t("deal.xAxisEnd")}}
            <el-input 
                style="border: 1px solid red"
                v-model="xAxisEnd" 
                :placeholder="t('deal.xAxisEnd')"
                clearable 
                />
        </h3>
        <h3>
            {{t("deal.xAxis")}}
            <el-input 
                v-model="xAxisName" 
                :placeholder="t('deal.xAxis')" 
                clearable 
                />
        </h3>
    </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { changeXRD } from '@/pinia/xrd'
import { ref} from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const xrd = changeXRD()
const {x0,y0,x1,y1,number,yAxisName,xAxisBegin,xAxisEnd,xAxisName} = storeToRefs(xrd)

const isIn = ref(false)
</script>

<style scoped lang="scss">
</style>


<!-- import { defineProps,defineEmits } from 'vue'
// prop为单向数据流 不能使用v-model
const imageInfoTypeHelper = function (): imageInfoType {
    return {} as imageInfoType
}
const props  = defineProps({ 
    imageInfo: imageInfoTypeHelper
}) -->