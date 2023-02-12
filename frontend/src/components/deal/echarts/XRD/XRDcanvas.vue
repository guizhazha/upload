<template>
	<specialEvent v-show="name !== ''" :raw="raw"/>
	<fieldset v-show="name !== ''" class="show-canvas">
		<legend>{{name}}</legend>
			<canvas id="ctxShow" width="647" height="400" />
			<canvas v-show="false" id="ctxUnshow" width="647" height="400" />
			<ImageInfo/>
	</fieldset>
	
	<fieldset v-show="name !== ''" v-for="yList, index in yLists" :key="index" class="subs">
		<legend>{{index + 1}}</legend>
		<div class="canvas">
			<canvas 
				:id="'xrdImage' + index"
				:height="yList.y1 - yList.y0"
				:width="x1 - x0"/>
		</div>
		<subImageInfo :index='index'/>
	</fieldset>
</template>

<script lang="ts" setup>
import specialEvent from '@/components/deal/echarts/XRD/specialEvent.vue'
import ImageInfo from '@/components/deal/echarts/XRD/imageInfo.vue'
import subImageInfo from '@/components/deal/echarts/XRD/subImageInfo.vue'

import {getXY,material,recognize,axisInterface,getSubData} from '@/utils/deal/dealHeader/dealXRD';
import { ref,watch } from 'vue'
import type { UploadFile, UploadFiles, UploadRawFile } from 'element-plus'
import bus from '@/utils/eventbus'

import { storeToRefs } from 'pinia'
import { changeXRD } from '@/pinia/xrd'

const XRDimage = ref<UploadFile>()
const raw = ref<UploadRawFile>()
const name = ref('')

const xrd = changeXRD()
const {number,x0,y0,x1,y1,yLists,bboxs,subData} = storeToRefs(xrd)

bus.on('uploadImage', uploadFile => {
	xrd.init()

	XRDimage.value  = uploadFile as UploadFile
	raw.value = XRDimage.value.raw as UploadRawFile
	name.value = raw.value.name

	putImage()
})
// bus.off('uploadImage')

for(const xy of [x0,y0,x1,y1]){
	watch(xy, (newValue, oldValue)=>{
		if(oldValue === 0) return 

		if(xy === y0) {
			xrd.setyListsy0(y0.value)
		}
		if(xy === y1) {
			xrd.setyListsy1(y1.value)
		}

		for(let i = 0; i<number.value; i++ ){
			setTimeout(()=>{
				putSubImage(i)
			})
		}
	})
}

const putImage = () => {
	if(name.value === '') return 

	const reader = new FileReader()
    reader.readAsDataURL(raw.value as Blob)
    reader.onload = (event) => {
        const image = new Image()
        image.src = event.target.result as string
		const url = image.src
        
        image.onload = () => {
			const canvasShow = document.getElementById('ctxShow') as HTMLCanvasElement
			const ctxShow: CanvasRenderingContext2D = canvasShow.getContext('2d') as CanvasRenderingContext2D
            ctxShow.drawImage(image, 0, 0, 647, 400)

			const canvasUnshow: HTMLCanvasElement = document.getElementById('ctxUnshow') as HTMLCanvasElement
			const ctxUnshow: CanvasRenderingContext2D = canvasUnshow.getContext('2d') as CanvasRenderingContext2D
            ctxUnshow.drawImage(image, 0, 0, 647, 400)

			if(number.value !== 0) return 
			// 处理数据
			const position_ = getXY(ctxUnshow)
			if(position_ === false){
				console.log('不能处理')
			}else{
				const {x0,y0,x1,y1} = position_
				xrd.setPosition(x0,y0,x1,y1)

				const mater = material(ctxUnshow,x0,y0,x1,y1)
				xrd.setNumber(mater.number)
				for(const [i, yList] of mater.yLists.entries()){
					xrd.setyList(i, yList)
				}

				const axis = recognize(canvasUnshow)
				axis.then((value:axisInterface)=>{
					const {xAxisName,yAxisName,xAxisBegin,xAxisEnd} = value
					xrd.setxAxisName(xAxisName)
					xrd.setyAxisName(yAxisName)
					xrd.setxAxisBegin(xAxisBegin)
					xrd.setxAxisEnd(xAxisEnd)
					
					for(let i = 0; i<number.value; i++ ){
						putSubImage(i)
					}
				})
			}
        }
    }
}
const putSubImage = (index: number) => {
	const canvas = document.getElementById('xrdImage' + index) as HTMLCanvasElement
	if (canvas == null) return 
	const subCtx = canvas.getContext('2d') as CanvasRenderingContext2D 

	const y0_ = yLists.value[index].y0
	const y1_ = yLists.value[index].y1

	// 先涂白
	if(bboxs.value[index] === undefined){
		xrd.setBbox(index,{
			x0: x1.value - 200,
			y0: y0_,
			width: 200,
			height: (y1_ - y0_)*0.7,
		})
	}
	const canvasUnshow: HTMLCanvasElement = document.getElementById('ctxUnshow') as HTMLCanvasElement
	const ctxUnshow: CanvasRenderingContext2D = canvasUnshow.getContext('2d') as CanvasRenderingContext2D
	ctxUnshow.fillStyle = 'white'
	ctxUnshow.fillRect(bboxs.value[index].x0, 
		bboxs.value[index].y0, 
		bboxs.value[index].width, 
		bboxs.value[index].height)

	// 再绘制
	const subImage = ctxUnshow.getImageData(x0.value, y0_, x1.value - x0.value, y1_ - y0_)
	subCtx.putImageData(subImage, 0, 0)
	
	if(subData.value[index] === undefined){
		const sub = getSubData(subCtx, x1.value - x0.value, y1_ - y0_)
		xrd.setSubData(index, sub)
	}
}
</script>

<style scoped lang="scss">
@import "@/assets/scss/h.scss"; 
@import "@/assets/scss/base/size.scss";

.show-canvas {
	border: solid #5a85c0 2px;
	margin: map-get($length, size-2);
}
.subs {
	border: solid #4f6077 2px;
	margin: map-get($length, size-2);
}
@media (min-width: 992px) {
    .show-canvas, .subs {
		display: flex;
	}
}

.image-info, .sub-image-info {
    display: flex;
    flex-direction: column;
	justify-content: center;
    ::v-deep h3 {
        margin: map-get($length, size-2) 0;
    }
}
</style>