<template>
    <div>
        <div class="prism-player" id="J_prismPlayer"></div>
        <div class="black-box" v-if="show"></div>
    </div>
</template>
<script>
import swal from 'sweetalert2';
export default {
    props: ['playAuth'],
    data() {
        return {
            play: '',
            record_id: '',
            playVideo: false,
            show: false
        };
    },
    created() {},
    mounted: function() {
        clearInterval(window.videoTimer);
        this.setVideo();
    },
    methods: {
        setVideo() {
            var me = this;
            this.play = new window.Aliplayer(
                {
                    id: 'J_prismPlayer',
                    width: '750px',
                    height: '450px',
                    autoplay: false,
                    preload: true,
                    // loadDataTimeout: 40000,
                    // waitingTimeout: 120000,
                    showBuffer: true,
                    // useFlashPrism: true,
                    format: 'm3u8',
                    // 播放方式一：推荐
                    vid: me.playAuth.videoId,
                    playauth: me.playAuth.playauth,
                    cover: me.playAuth.videoCover
                },
                function(player) {
                    player.seek(me.playAuth.currentTime);
                }
            );
            this.play.on('play', this.playing);
            this.play.on('pause', this.pause);
            this.play.on('ended', this.ended);
            this.play.on('error', this.erroring);
            var _video = document.querySelector('video');
            // _video.addEventListener('click', pause);
            _video.onclick = function() {
                if (me.playVideo) {
                    me.play.pause();
                } else {
                    me.play.play();
                }
            };
        },
        erroring(code) {
            this.show = true;
            swal(`${code.paramData.display_msg}`, '', 'error').then(async () => {
                await this.$api.practice.aliyun_log({
                    chapter_id: this.$route.query.chapter_id,
                    fail_time: this.play.getCurrentTime(),
                    aliyun_response_code: code.paramData.error_code,
                    aliyun_response: code.paramData.display_msg,
                    resolution_ratio: `${window.screen.width}x${window.screen.height}`
                });
                window.location.reload();
            });
        },
        playing() {
            clearInterval(window.videoTimer);
            window.videoTimer = setInterval(() => {
                if (this.$route.path !== '/practice/video_lesson' && this.$route.path !== '/pdu/video_lesson') {
                    clearInterval(window.videoTimer);
                } else {
                    this.handle();
                }
            }, 10000);
            this.playVideo = true;
            this.handle();
        },
        pause() {
            clearInterval(window.videoTimer);
            this.playVideo = false;
            this.handle();
        },
        ended() {
            clearInterval(window.videoTimer);
            this.handle('end');
            this.$emit('end', true);
        },
        async handle(end) {
            this.$emit('currentTime', this.play.getCurrentTime());
            const res = await this.$api.practice.save_chapter_study({
                record_id: this.playAuth.recordId,
                chapter_id: this.$route.query.chapter_id,
                start_time: this.$scripts.zTime.format(new Date()),
                current_time: end ? '0' : this.play.getCurrentTime(),
                finish_speed: this.play.getCurrentTime()
            });
            if (parseInt(res.code) === 200) {
                this.playAuth.recordId = res.data.record_id;
            }
        }
    }
};
</script>
<style lang="scss">
.player_wrap {
    video {
        cursor: pointer;
    }
    .black-box {
        position: absolute;
        top: 0;
        left: 0;
        width: 750px;
        height: 450px;
        z-index: 100;
        background-color: #000;
    }
}
</style>
