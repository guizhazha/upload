<template>
    <!-- 添加学生 -->
    <el-button 
        size="large"
        icon="Connection"
        round
        @click="dialogVisible = true">
            {{ t('setting.addStudent') }}
    </el-button>


    <el-dialog 
        v-model="dialogVisible"
        width="700px"
        draggable
        modal="false"
        append-to-body
        >
        <template #header>
            <el-button
                @click="submit">
                {{t('setting.submit')}}
            </el-button>
        </template>

        <el-cascader-panel
            :options="allStudents"
            :props="props"
            @change="handleChange"
            :show-all-levels="false"
            filterable
            clearable>
            <template #default="{ node, data }">
                <span>{{ t(data.label) }}</span>
                <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
        </el-cascader-panel>
        
    </el-dialog>

    <!-- 我的学生 -->
    <div v-for="(student, index) in myStudents" :key="index">
        <el-row>
            <el-col :lg="12" :md="14" :xs="24">
                <el-descriptions
                    :column="2"
                    border>
                    <template #title>
                        {{ t('setting.myStudents') }}
                        <el-tooltip 
                            placement="top-start"
                            :content="t('setting.noRole')" 
                            v-if="student.is_check == 0">
                            <img class="check" src="../../assets/image/staff/uncheck.svg" />
                        </el-tooltip >
                        <el-tooltip 
                            placement="top-start"
                            :content="t('setting.isRole')" 
                            v-if="student.is_check == 1">
                            <img class="check" src="../../assets/image/staff/check.svg" />
                        </el-tooltip >
                        {{ student.name }}
                    </template>

                    <el-descriptions-item>
                        <template #label>
                        <el-icon><User /></el-icon>
                        {{ t('setting.name') }}
                        </template>
                        {{student.name}}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template #label>
                        <el-icon><School /></el-icon>
                        {{ t('setting.school') }}
                        </template>
                        {{t(getSchool(student.school))}}
                    </el-descriptions-item>

                    <el-descriptions-item>
                        <template #label>
                        <el-icon><Phone /></el-icon>
                        {{ t('setting.phone') }}
                        </template>
                        {{student.phone}}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template #label>
                        <el-icon><Message /></el-icon>
                        {{ t('setting.email') }}
                        </template>
                        {{student.email}}
                    </el-descriptions-item>
                    
                    

                    <el-descriptions-item>
                        <template #label>
                        {{ t('setting.pro') }}
                        </template>
                        {{student.processNumber}}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template #label>
                        {{ t('setting.exp') }}
                        </template>
                        <table>
                            <thead>
                                <tr>
                                    <th>
                                        <router-link :to="`/show/JV/` + student.email">
                                            JV
                                        </router-link>
                                    </th>
                                    <th>
                                        <router-link :to="`/show/XRD/` + student.email">
                                            XRD
                                        </router-link>
                                    </th>
                                    <th>
                                        <router-link :to="`/show/IPCE/` + student.email">
                                            IPCE
                                        </router-link>
                                    </th>
                                    <th>
                                        <router-link :to="`/show/PL/` + student.email">
                                            PL
                                        </router-link>
                                    </th>
                                    <th>
                                        <router-link :to="`/show/ABS/` + student.email">
                                            ABS
                                        </router-link>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td v-for="typeNumber in student.typeNumber" :key="typeNumber">
                                        {{ typeNumber }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </el-descriptions-item>
                </el-descriptions>
            </el-col>
    
            <el-col :lg="2" :md="1" :xs="0"></el-col>
    
            <el-col :lg="8" :md="7" :xs="24">
                <table class="today-table">
                    <thead>
                    <tr>
                        <th>{{t('setting.todayData')}}</th>
                        <th>JV</th>
                        <th>XRD</th>
                        <th>IPCE</th>
                        <th>PL</th>
                        <th>ABS</th>
                    </tr>
                    </thead>
                    <tbody>
        
                    <tr>
                        <td>{{t('setting.online')}}</td>
                        <td v-for="onlineTodayNumber in student.onlineTodayNumber" :key="onlineTodayNumber">
                            <span :style="onlineTodayNumber === 0 ? 'color: gray' : 'color: black'">{{ onlineTodayNumber }}</span>
                        </td>
                    </tr>
        
                    <tr>
                        <td>{{t('setting.exp')}}</td>
                        <td v-for="experiTodayNumber in student.experiTodayNumber" :key="experiTodayNumber">
                            <span :style="experiTodayNumber === 0 ? 'color: gray' : 'color: black'">{{ experiTodayNumber }}</span>
                        </td>
                    </tr>
        
                    <tr>
                        <td>{{t('setting.pro')}}</td>
                        <td colspan="5">
                            <span :style="student.processTodayNumber === 0 ? 'color: gray' : 'color: black'">
                                {{ student.processTodayNumber }}
                            </span>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </el-col>
        </el-row>
    </div>

    <div class="bottom-compare">
        <div class="show-info">
            <div class="show-detail">{{ t(show) }}</div>
            <div>{{ start_date }}</div>
            <div>-</div>
            <div>{{ end_date }}</div>
        </div>

        <div class="button-group">
            <el-button @click="compareStudent(weekData), show='setting.week'">{{t('setting.week')}}</el-button>
            <el-button @click="compareStudent(monthData), show='setting.month'">{{t('setting.month')}}</el-button>
            <el-button @click="compareStudent(yearData), show='setting.year'">{{t('setting.year')}}</el-button>
        </div>
        
        <div class="compare-student" ref="compareStu" />
    </div>
    
</template>

<script lang="ts" setup>
import { onMounted, ref, nextTick } from 'vue'   
import axios from '@/utils/axios/axios'
import {getMystudent,myStudentInterface} from '@/utils/setting/mystudent'
import {getAllstudents,studentInterface} from '@/utils/setting/allStudents'
import {getWeekData,getMonthData,getYearData,timeInterface} from '@/utils/setting/timeData'
import {getOption} from '@/utils/setting/echarts'

import * as echarts from 'echarts'
import { ElMessage, ElMessageBox } from 'element-plus'
import {getSchool} from '@/utils/setting/school'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const dialogVisible = ref(false)
const props = { multiple: true }

const myStudents = ref<myStudentInterface[]>([])
const allStudents = ref<studentInterface[]>([])
onMounted(() => {
    const p = getMystudent()
    p.then((myStu:myStudentInterface[])=>{
        myStudents.value = myStu

        // 老师的学生 : 邮箱
        const emailList: string[] = []
        if(myStudents.value !== undefined){
            myStudents.value.forEach((item)=>{
                emailList.push(item.email)
            })
        }

        getTimeData(myStudents.value)

        const p_ = getAllstudents(emailList)
        p_.then((allStu: studentInterface[])=>{
            allStudents.value = allStu
        })
    })
})

interface backInterface{
    // 学校
    0: number,
    // 邮箱
    1?: string
}
let emailArr: string[] = []
const handleChange = (student: backInterface[] | undefined) => {
    if(student !== undefined){
        emailArr = []
        for(const stu of student){
            if(stu[1] !== undefined){
                emailArr.push(stu[1])
            }
        }
    }
}
const submit = () => {
    ElMessageBox.confirm(
        t("notice.isAdd"),
        t("notice.warn"),
        {
            confirmButtonText: t("notice.sure"),
            cancelButtonText: t("notice.cancel"),
            type: 'warning',
        })
        .then(() => {
            axios.post(
                'user/addStudent/',
                {
                    emailArr: emailArr
                }
            )
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: t("notice.cancel"),
            })
    })
}


// 本周：0，上周：1
const week = ref(0)
const month = ref(0)
const year = ref(0)
const weekData = ref<timeInterface[]>([])
const monthData = ref<timeInterface[]>([])
const yearData = ref<timeInterface[]>([])
function getTimeData(myStudents: myStudentInterface[]) {
    for(const stu of myStudents){
        const pw = getWeekData(stu.email, stu.name, week.value)
        pw.then((result:timeInterface)=>{
            weekData.value.push(result)

            if(weekData.value.length === myStudents.length){
                compareStudent(weekData.value)
            }
        })

        const pm = getMonthData(stu.email, stu.name, month.value)
        pm.then((result:timeInterface)=>{
            monthData.value.push(result)
        })

        const py = getYearData(stu.email, stu.name, year.value)
        py.then((result:timeInterface)=>{
            yearData.value.push(result)
        })
    }
}

const compareStu = ref()
const show = ref('setting.week')
const start_date = ref()
const end_date = ref()
function compareStudent(timeData: timeInterface[]){
    start_date.value = timeData[0].start_date
    end_date.value = timeData[0].end_date

    nextTick(() => {
        const myEcharts = echarts.init(compareStu.value, undefined, { renderer: 'svg' })
        
        if(myStudents.value === undefined) return 
        const xAxisData = []
        for(const stu of myStudents.value){
            xAxisData.push(stu.name)
        }
        
        const seriesData: number[][] = []
        for(const data of timeData){
            for(const [index, exp] of data.experiNumber.entries()){
                if(seriesData[index] === undefined){
                    seriesData[index] = []
                    seriesData[index].push(exp)
                }else{
                    seriesData[index].push(exp)
                }
            }
        }
        const option = getOption(xAxisData, seriesData)
        myEcharts.setOption(option)
    })
}
</script>

<style scoped lang="scss">
@import "@/assets/scss/base/size.scss";

.today-table {
    margin: map-get($length, size-4) 0;
    width: map-get($length, size-13);
    border:1px solid #bcdaeb;
    td{
        text-align: center;
    }
    th,td {
        border: 0.5px dotted #d4d6d7;
    }
}
@media (min-width: 992px) {
    .today-table {
        margin: 0;
        width: 100%;
        position: relative;
        top: map-get($length, size-8);
    }
}

.check {
    width: map-get($length, size-5);
    height: map-get($length, size-5);
    position: relative;
    top: map-get($length, size-2);
}

.bottom-compare{
    display: flex;
    .show-info{
        text-align: center;
        
        line-height: map-get($length, size-5);

        .show-detail{
            color: rgb(60, 70, 103);
            margin: map-get($length, size-4) 0;
        }
    }
    .button-group{
        display: flex;
        flex-direction: column;
        .el-button {
            margin: map-get($length, size-2);
        }
    }
    .show-info, .button-group{
        margin: map-get($length, size-6) 0;
    }

    .compare-student {
        width: map-get($length, size-14);
        height: map-get($length, size-12);
    }
    
}

</style>