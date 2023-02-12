<template>
    <div>
        <router-link v-if="useRoute().path === '/login'" to="/register">
            {{t("enter.isNot")}}
        </router-link>
        <router-link v-if="useRoute().path === '/register'" to="/login">
            {{t("enter.isHas")}}
        </router-link>
        <SkinLanguageVue />
    </div>
</template>

<script lang="ts" setup>
import SkinLanguageVue from '@/components/tinyComponent/skinLanguage.vue'
import { useRoute } from 'vue-router'
import { useI18n } from "vue-i18n"
const { t } = useI18n()
</script>

<style scoped lang="scss">
@import "@/assets/scss/dark-bright-color.scss";
a {
    @include dark-bright-reverse-color;
    text-decoration: none;
}
</style>