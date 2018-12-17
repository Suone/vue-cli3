<template>
    <div class="index">
        <router-link to="/about">
            <p class="tc">about页面</p>
        </router-link>
    </div>
</template>

<script>
export default {
    data() {
        return {
            show: true
        };
    },
    mounted: function() {
        this.$store.dispatch('setId', 15);
    },
    computed: {
        changeId() {
            return this.$store.state.user.id;
        }
    },
    watch: {
        changeId: function(now, prev) {
            console.log('改变了id');
        }
    }
};
</script>

<style lang="scss">
.index {
    box-sizing: border-box;
    width: 100%;
}
</style>
