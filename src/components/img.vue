<template>
    <div class="">
        <el-upload class="avatar-uploader" :action="endpoint" name="file" :show-file-list="false" :data="imageUpdate" :before-upload="beforeAvatarUpload" :on-success="sethandleSuccess">
            <img v-if="url[0].url" :src="url[0].url+'!300x300'" class="avatar">
            <img v-else src="http://cdn-oss.51pm.cn/assets/images/empty.jpg" class="avatar">
            <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
        </el-upload>
    </div>
</template>

<script>
import swal from 'sweetalert2';

export default {
    name: 'uploadImg',
    props: ['img_url', 'operation'],
    data() {
        return {
            // 上传参数
            imageUpdate: {
                name: '',
                OSSAccessKeyId: '',
                policy: '',
                Signature: '',
                key: '',
                success_action_status: 200
            },
            // 图片地址
            domain: '',
            // 上传地址
            endpoint: '',
            // 上传路径
            key: '',
            url: [
                {
                    name: '',
                    url: ''
                }
            ]
        };
    },
    mounted() {
        this.fetchUpUrl();
    },
    methods: {
        // 获取上传地址
        async fetchUpUrl() {
            const res = await this.$api.personal_info.fetchUpUrl({
                dir: 'header',
                type: 1
            });
            if (res.success) {
                this.imageUpdate.OSSAccessKeyId = res.data.aliyun_form_conf.accseeid;
                this.imageUpdate.policy = res.data.aliyun_form_conf.policy;
                this.imageUpdate.Signature = res.data.aliyun_form_conf.signature;
                this.imageUpdate.key = res.data.aliyun_form_conf.save_path;
                this.key = res.data.aliyun_form_conf.save_path;
                this.domain = res.data.aliyun_form_conf.domain;
                this.endpoint = res.data.aliyun_form_conf.endpoint;
            } else if (parseInt(res.code) === 403) {
            } else {
                swal('' + res.msg + '', '', 'error');
            }
        },
        // 图片上传之前
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
            const isLt200M = file.size / 1024 / 1024 < 200;
            const url = this.domain;
            if (!url) {
                this.$message.error('获取上传地址失败请稍后重试或刷新页面!');
                this.fetchUpUrl();
                return url;
            }
            let timestamp = Date.parse(new Date());
            let number = this.random(1000, 9999);
            let position = file.type.indexOf('/');
            let length = file.type.length;
            let type = file.type.substring(position + 1, length);
            this.imageUpdate.key = '';
            this.imageUpdate.name = file.name;
            this.imageUpdate.key = JSON.parse(JSON.stringify(this.key));
            this.imageUpdate.key = this.imageUpdate.key + timestamp + number + '.' + type;
            if (!isJPG) {
                this.$message.error('上传图片只能是 JPG/JPEG/PNG 格式!');
            }
            if (!isLt200M) {
                this.$message.error('上传图片大小不能超过 200MB!');
            }
            return isJPG && isLt200M;
        },
        // 图片列表上传成功时的钩子
        sethandleSuccess() {
            let url = {
                name: this.imageUpdate.name,
                url: this.domain + this.imageUpdate.key
            };
            this.$set(this.url, 0, url);
            this.$emit('message', this.url, this.operation);
        },
        // 随机数
        random: function(end, start) {
            return start + ~~(Math.random() * (end - start));
        }
    },
    watch: {
        img_url: function() {
            if (this.img_url.length === 0) {
                this.url = [{ name: '', url: '' }];
            } else {
                this.url = [{ name: '', url: this.img_url }];
            }
        }
    }
};
</script>

<style lang="scss">
</style>
