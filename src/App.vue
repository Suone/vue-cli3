<template>
    <div class="app-study-center">
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    data() {
        return {
            show: false
        };
    }
};
</script>

<style lang="scss">
.app-study-center {
    box-sizing: border-box;
    width: 100%;
    // overflow: hidden;
    position: relative;
    background-color: #f2f2f2;
}
</style>
