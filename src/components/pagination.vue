<template>
    <div class="control">
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :pager-count="subs" :page-size="pager" layout="prev,pager,next" :total="total" v-show="total>0">
        </el-pagination>
        <div class="total" v-show="total>0&&showTotal">第{{currentPage}}/{{Math.ceil(total/$const.base.PAGESIZE)}}页, 共 {{total}}条
        </div>
    </div>
</template>
<script>
export default {
    props: {
        total: {
            type: Number
        },
        showTotal: {
            type: Boolean,
            default: true
        },
        crtPage: {
            type: Number
        }
    },
    data() {
        return {
            currentPage: 1,
            pager: this.$const.base.PAGESIZE,
            subs: 5
        };
    },
    mounted() {
        if (this.$route.query.current_page) {
            this.currentPage = parseInt(this.$route.query.current_page);
        } else if (this.crtPage) {
            this.currentPage = this.crtPage;
        }
    },
    methods: {
        handleCurrentChange(val) {
            // console.log(val);
            this.$emit('pagination', val);
            if (document.querySelector('.study-center-main')) {
                document.documentElement.scrollTop = document.body.scrollTop = document.querySelector('.study-center-main').offsetTop;
            }
        }
    }
};
</script>
<style lang="scss">
.control {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .total {
        padding: 0 15px;
        background: #eee;
        height: 30px;
        line-height: 28px;
        border: 1px solid#000;
    }
    .el-pager .number {
        box-sizing: border-box;
        -moz-box-sizing: border-box;
        height: 30px;
        width: 30px;
        background: #eee;
        border: 1px solid #000;
        margin-left: 10px;
        color: #999;
        font-size: 14px;
    }
    .el-pager li:first-child {
        margin-left: 0;
    }
    .el-pager li.active {
        background: #666;
        color: #fff;
    }
    .el-pager li.active + li {
        border-left: 1px solid #000;
    }
    .el-pagination .btn-next {
        width: 30px;
        height: 30px;
        background: #eee;
        margin-left: 10px;
        padding-left: 5px;
    }
    .el-pagination .btn-prev {
        width: 30px;
        height: 30px;
        background: #eee;
        margin-right: 10px;
        padding-left: 10px;
    }
    .el-pagination button:disabled {
        background: #fff;
    }
}
</style>
