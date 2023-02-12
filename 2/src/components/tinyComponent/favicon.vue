<template>
    <div class="favicon">
        <img src="../../assets/image/enter/003.svg" >
        <span>Solar2Chart</span>
    </div>
</template>

<script lang="ts" setup>
</script>

<style scoped lang="scss">
@import "@/assets/scss/base/size.scss";
@import "@/assets/scss/dark-bright-color.scss";

$length-fav: $header-height * 0.4;
.favicon {
    img {
        border-radius: 50%;
        width: $length-fav;
        margin-right: calc($length-fav / 2);
    }
    span {
        @include dark-bright-color;
        vertical-align: top;
        font-size: $length-fav;
    }
    margin: 0 map-get($length, size-2);
}
</style>