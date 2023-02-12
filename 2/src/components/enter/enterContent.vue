<template>
    <el-row>
        <el-col :xs="0" :sm="0" :md="0" :lg="16" :xl="16">
            <leftContent class="leftContent" />
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
            <favicon class="favicon" />
            <rightHeader class="right-header" />
            
            <loginForm v-if="useRoute().path === '/login'" class="form" />
            <registerForm v-if="useRoute().path === '/register'" class="form" />
        </el-col>
    </el-row>
</template>

<script lang="ts" setup>
import leftContent from '@/components/enter/leftContent.vue';
import favicon from '@/components/tinyComponent/favicon.vue'
import rightHeader from '@/components/enter/rightHeader.vue';
import loginForm from '@/components/enter/loginForm.vue';
import registerForm from '@/components/enter/registerForm.vue';

import { useRoute } from 'vue-router'
</script>

<style scoped lang="scss">
@import "@/assets/scss/base/size.scss";
@import "@/assets/scss/dark-bright-color.scss";
.el-row {
    height: calc(100vh);

    .leftContent {
        margin-top: 28vh;
        text-align: center;
    }
    .right-header {
        position: fixed;
        top: 2vh;
        right: 2vw;
    }
    .favicon {
        position: fixed;
        top: 2vh;
        left: 2vw;
    }

    .form {
        margin-top: 30vh;
    }
}

//lg=1200px
@media (max-width: 1200px) {
    .favicon {
        display: block;
        ::v-deep span {
            @include dark-bright-reverse-color;
        }
    }
    .form {
        margin: auto;
    }
}
@media (min-width: 1200px) {
    .favicon {
        display: none;
    }
}
</style>
