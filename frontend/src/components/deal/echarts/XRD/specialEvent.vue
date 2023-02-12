<template>
    <el-row>
        <div class="left">
            <el-popover
                placement="top-start"
                width="50"
                trigger="hover"
                :content='t("deal.reset")'
                >
                <template #reference>
                    <el-button 
                        icon="Refresh" 
                        circle
                        @click="refresh" />
                </template>
            </el-popover>

            <el-popover
                placement="top-start"
                width="50"
                trigger="hover"
                :content='t("deal.border")'
                >
                <template #reference>
                    <el-button 
                        icon="Location" 
                        circle
                        color="#3E8CD3"
                        @click="showPosition" />
                </template>
            </el-popover>

            <div class="sub-button" v-for="index in number" :key="index">
                <span>{{ t("deal.sub") }} {{index}}</span>
                <el-popover
                    placement="top-start"
                    width="50"
                    trigger="hover"
                    :content='t("deal.subPicP")'
                    >
                    <template #reference>
                        <el-button 
                            icon="Place" 
                            circle
                            color="#EBFDFF"
                            @click="showSubPosition(index - 1)" />
                    </template>
                </el-popover>
                
                <el-popover
                    placement="top-start"
                    width="50"
                    trigger="hover"
                    :content='t("deal.matText")'
                    >
                    <template #reference>
                        <el-button 
                            icon="Aim" 
                            circle
                            color="#95B0B4"
                            @click="showSubTestPosition(index - 1)" />
                    </template>
                </el-popover>
                
            </div>
        </div>
    </el-row>
</template>
                                        
<script lang="ts" setup>
import { defineProps } from 'vue'
import { storeToRefs } from 'pinia'
import { changeXRD } from '@/pinia/xrd'
import { drawBorder } from '@/utils/deal/drawBorder'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props = defineProps({
    raw: {
        required: true
    }
})

const xrd = changeXRD()
const {number,x0,y0,x1,y1,yLists,bboxs} = storeToRefs(xrd)
const refresh = () => {
    const canvasShow = document.getElementById('ctxShow') as HTMLCanvasElement
    const ctxShow = canvasShow.getContext('2d') as CanvasRenderingContext2D
    
    const reader = new FileReader()
    reader.readAsDataURL(props.raw as Blob)
    reader.onload = (event) => {
        const image: HTMLImageElement = new Image()
        const target = event.target as FileReader 
        image.src = target.result as string
        
        image.onload = () => {
            ctxShow.drawImage(image, 0, 0, 647, 400)
        }
    }
}

const showPosition = () => {
    const canvasShow: HTMLCanvasElement = document.getElementById('ctxShow') as HTMLCanvasElement
    const ctxShow: CanvasRenderingContext2D = canvasShow.getContext('2d') as CanvasRenderingContext2D
    drawBorder(ctxShow, x0.value, y0.value, x1.value-x0.value, y1.value-y0.value)
}
const showSubPosition = (index: number) => {
    const canvasShow: HTMLCanvasElement = document.getElementById('ctxShow') as HTMLCanvasElement
    const ctxShow: CanvasRenderingContext2D = canvasShow.getContext('2d') as CanvasRenderingContext2D
    
    const y0_ = yLists.value[index].y0
	const y1_ = yLists.value[index].y1

    drawBorder(ctxShow, x0.value, y0_, x1.value-x0.value, y1_-y0_)
}
const showSubTestPosition = (index: number) => {
    const canvasShow: HTMLCanvasElement = document.getElementById('ctxShow') as HTMLCanvasElement
    const ctxShow: CanvasRenderingContext2D = canvasShow.getContext('2d') as CanvasRenderingContext2D

    drawBorder(ctxShow, bboxs.value[index].x0, 
		bboxs.value[index].y0, 
		bboxs.value[index].width, 
		bboxs.value[index].height)
}
</script>

<style scoped lang="scss">
@import "@/assets/scss/header.scss";
@import "@/assets/scss/button.scss";
@import "@/assets/scss/base/size.scss";
@import "@/assets/scss/base/color.scss";
.left {
    @include button-circle;
    ::v-deep .el-icon {
        font-size: map-get($length, size-5);
    }

    .sub-button {
        border: solid map-get($around-color-blue, two) map-get($length, size-1);
        margin: 0 map-get($length, size-2);
        padding: map-get($length, size-1) map-get($length, size-2);
    }
}
</style>