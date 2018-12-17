<template>
    <div class="login">
        <router-link to="/">
            <span>index页面</span>
            {{$store.state.user.id}}
        </router-link>
    </div>
</template>
<script>
export default {
    data() {
        return {};
    },
    created() {},
    mounted: function() {},
    methods: {}
};
</script>
<style lang="scss">
.login {
    width: 1200px;
    margin: 0 auto;
    margin-bottom: 40px;
    .site {
        height: 50px;
        line-height: 50px;
        font-size: 16px;
        color: #004e97;
        text-align: left;
        a {
            color: #004e97;
        }
    }
    .login-main {
        background-color: #fafafa;
        padding: 25px;
        .login-main-title {
            width: 100%;
            height: 40px;
            line-height: 40px;
            color: #fff;
            background: #004e97;
            text-indent: 10px;
            font-size: 18px;
        }
        .login-main-box {
            overflow: hidden;
            .login-main-box-left {
                // float: left;
                width: 575px;
                margin: 0 auto;
                padding: 45px 100px 18px 100px;
                .el-form-item__label {
                    font-size: 18px;
                    letter-spacing: 2px;
                }
                .el-form-item__content {
                    width: 250px;
                    transform: translateX(10px);
                    border-radius: 0;
                }
                .code {
                    width: 160px;
                    float: left;
                }
                .error-text {
                    height: 33px;
                    width: 100%;
                    padding-left: 110px;
                    color: #f3a13f;
                    font-size: 14px;
                    line-height: 33px;
                    margin-bottom: 22px;
                }
                .login-submit {
                    border-radius: 0;
                    background-color: #004e97;
                    font-size: 16px;
                    padding: 9px 18px;
                    color: #dfe9f2;
                    letter-spacing: 2px;
                }
                .login-reset {
                    border-radius: 0;
                    background-color: #333333;
                    font-size: 16px;
                    padding: 9px 18px;
                    color: #dfe9f2;
                    letter-spacing: 2px;
                }
                .code-img {
                    float: right;
                    display: inline-block;
                    width: 80px;
                    height: 35px;
                    vertical-align: top;
                    margin-left: 5px;
                    cursor: pointer;
                    // background: #004e97;
                    img {
                        width: 100%;
                        height: 100%;
                        vertical-align: top;
                    }
                }
                .left-bottom-text {
                    height: 33px;
                    width: 100%;
                    padding-left: 110px;
                    font-size: 14px;
                    line-height: 33px;
                }
                .find-pwd {
                    float: left;
                    color: #000;
                }
                .go-res {
                    float: right;
                    a {
                        color: #004e97;
                    }
                }
            }
            .login-main-box-right {
                float: left;
                width: 575px;
                padding: 45px 85px 18px 95px;
                .login-main-box-right-item {
                    margin-bottom: 50px;
                }
                h4 {
                    color: #004e97;
                    margin-top: 0;
                    margin-bottom: 13px;
                    line-height: 16px;
                    font-size: 16px;
                    font-weight: normal;
                }
                p {
                    color: #000;
                    font-size: 14px;
                    line-height: 20px;
                }
            }
        }
    }
}
</style>

