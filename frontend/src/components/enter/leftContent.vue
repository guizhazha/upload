<template>
    <div class="left-content">
        <favicon class="favicon" />
        <h2>{{t('enter.title')}}</h2>
    </div>
</template>

<script lang="ts" setup>
import favicon from '@/components/tinyComponent/favicon.vue'
import { useI18n } from "vue-i18n"
const { t } = useI18n()
</script>

<style scoped lang="scss">
@import "@/assets/scss/base/size.scss";
@import "@/assets/scss/enter-left-background.scss";
@import "@/assets/scss/dark-bright-color.scss";
@import "@/assets/scss/animation.scss";

$animation: left-2-right 1s;
$new-length: map-get($length, size-9);
.left-content {
    &::before {
        content: '';
        @include left-content-background;
    }

    .favicon {
        ::v-deep img {
            width: $new-length;
            margin-right: calc($new-length / 2);
        }
        ::v-deep span {
            font-size: $new-length;
        }
        margin-right: 10vw;
    }

    h2 {
        @include dark-bright-color;
        width: 38vw;
        margin-left: 12vw;
        margin-top: 8vh;
    }
}
.left-content::before, .favicon{
    animation: $animation;
}
</style>
  