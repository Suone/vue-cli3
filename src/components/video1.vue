<template>
    <div class="video1">
        <video-player class="video-player-box" ref="videoPlayer" :options="playerOptions" :playsinline="true" customEventName="customstatechangedeventname" @play="onPlayerPlay($event)" @pause="onPlayerPause($event)" @ended="onPlayerEnded($event)" @waiting="onPlayerWaiting($event)" @playing="onPlayerPlaying($event)" @ready="playerReadied">
        </video-player>
        <div class="black-box" v-if="show"></div>
    </div>
 <!--    调用
    <video1 :playAuth="JSON.stringify(play_auth)" v-if="isVideo" @currentTime="getCurrentTime" @end="end"></video1>
    play_auth: {
        videoId: '',
        playInfo: '',
        videoCover: '',
        recordId: '',
        currentTime: ''
    },
    获取视频
    async get_play_auth() {
        const res = await this.$api.practice.get_play_url({
            video_id: this.play_auth.videoId
        });
        if (parseInt(res.code) === 200) {
            this.play_auth.playInfo = res.data.play_info_list.PlayInfo;
            this.play_auth.videoCover = res.data.video_base.CoverURL;  // videoCover在这里cover
            this.isVideo = true;
        } else if (parseInt(res.code) === 403) {
        } else {
            swal(res.msg, '', 'error').then(() => {});
        }
    },
     // 获取视频信息
        async chapter_detail() {
            const res = await this.$api.practice.chapter_detail({
                chapter_id: this.$route.query.chapter_id
            });
            if (parseInt(res.code) === 200) {
                this.play_auth.videoId = res.data.detail.video_url;
                this.play_auth.recordId = res.data.detail.record_id;
                this.play_auth.currentTime =
                    parseInt(res.data.detail.current_time) < parseInt(res.data.detail.video_time) ? res.data.detail.current_time : '0';
                this.current = this.play_auth.currentTime;
                this.chapter_list('0', res.data.detail.course_id);
                this.get_play_auth();
                this.ask_list();
            } else if (parseInt(res.code) === 403) {
            } else if (parseInt(res.code) === 500 && parseInt(res.data.code) === 307) {
                window.location.href = `/tips.html?code=${res.data.code}`;
            } else {
                swal(res.msg, '', 'error').then(() => {});
            }
        },
    package.js
        "videojs-contrib-hls": "^5.15.0",
        "vue-video-player": "^5.0.2", -->
</template>

<script>
// import videojs from 'video.js';
import 'videojs-contrib-hls';
// require styles
import 'video.js/dist/video-js.css';

import { videoPlayer } from 'vue-video-player';
import swal from 'sweetalert2';

// import 'videojs-contrib-hls';
export default {
    components: {
        videoPlayer
    },
    props: ['playAuth'],
    data() {
        return {
            videoContent: {},
            zIndex: 0, // 默认清晰度为2 流畅
            currentTime: 0,
            playerOptions: {
                // videojs options
                muted: false,
                preload: 'auto',
                playbackRates: [0.5, 1.0, 1.5, 2.0],
                poster: JSON.parse(this.playAuth).videoCover,
                width: '750',
                height: '450',
                notSupportedMessage: '此视频暂无法播放，请稍后再试',
                controlBar: {
                    durationDisplay: true,
                    progressControl: true
                }
            },
            m3u8Arr: [],
            show: false
        };
    },
    created() {},
    mounted() {
        clearInterval(window.videoTimer);
        let me = this;
        this.videoContent = JSON.parse(this.playAuth);
        console.log(JSON.parse(this.playAuth));
        this.getQXD();

        window.jQuery('.video1').on('click', '.definition', function() {
            var index = window.jQuery(this).index();
            if (index !== me.zIndex) {
                // 0-高清 1-标清 2-流畅
                me.zIndex = index;
                console.log(index, me.zIndex);

                window
                    .jQuery(this)
                    .addClass('actQxd')
                    .siblings()
                    .removeClass('actQxd');
                let currentTime = me.player.currentTime();
                me.player.src(me.m3u8Arr[me.zIndex] + 1);
                me.player.load(); // 加载视频文件后才可以设置时间
                me.player.currentTime(currentTime);
                me.player.play();
            }
        });
        this.player.on('error', function() {
            me.erroring(me.player.error());
        });
    },
    computed: {
        player() {
            return this.$refs.videoPlayer.player;
        }
    },
    methods: {
        // 视频播放，包括缓冲
        onPlayerPlay(player) {
            // this.currentTime = player.currentTime();
            console.log('player play!', player);
        },
        // 暂停
        onPlayerPause(player) {
            clearInterval(window.videoTimer);
            this.handle();
        },
        // 结束调用
        onPlayerEnded(player) {
            console.log('player end!', player);
            clearInterval(window.videoTimer);
            let duration = this.videoContent.playInfo[this.zIndex].Duration;
            this.handle(duration);
            this.$emit('end', true);
        },
        // 缓冲等待
        onPlayerWaiting(player) {
            console.log('player onPlayerWaiting!', player);
        },
        // 视频播放
        onPlayerPlaying(player) {
            console.log('player onPlayerPlaying!', player);
            window.videoTimer = setInterval(() => {
                if (this.$route.path !== '/practice/video_lesson') {
                    clearInterval(window.videoTimer);
                } else {
                    this.handle();
                }
            }, 10000);
            this.handle();
        },
        // player is ready
        playerReadied(player) {
            console.log('the player is readied', player);
            // you can use it to do something...
            // player.[methods]
        },
        erroring(err) {
            this.show = true;
            swal(`${err.message}`, '', 'error').then(async () => {
                await this.$api.practice.aliyun_log({
                    chapter_id: this.$route.query.chapter_id,
                    fail_time: this.player.currentTime(),
                    aliyun_response_code: err.code,
                    aliyun_response: err.message,
                    resolution_ratio: `${window.screen.width}x${window.screen.height}`
                });
                window.location.reload();
            });
        },
        async handle(duration) {
            this.$emit('currentTime', this.player.currentTime());
            const res = await this.$api.practice.save_chapter_study({
                record_id: this.videoContent.recordId,
                chapter_id: this.$route.query.chapter_id,
                start_time: this.$scripts.zTime.format(new Date()),
                current_time: duration ? '0' : this.player.currentTime(),
                finish_speed: duration || this.player.currentTime()
            });
            if (parseInt(res.code) === 200) {
                this.videoContent.recordId = res.data.record_id;
            }
        },
        getQXD() {
            let playInfo = this.videoContent.playInfo;
            let str = '';
            let arr = ['FD', 'SD', 'LD'];
            let arrClone = ['FD', 'SD', 'LD'];

            let arrGoal = [];
            let arrM3u8 = [];
            for (let i = 0; i < playInfo.length; i++) {
                arrGoal.push(playInfo[i].Definition);
            }
            // 总数为3
            for (let j = 0; j < arrClone.length; j++) {
                if (arrGoal.indexOf(arrClone[j]) === -1) {
                    arr.splice(j, 1);
                } else {
                    arrM3u8.push(playInfo[arrGoal.indexOf(arrClone[j])].PlayURL);
                }
            }
            for (let k = 0; k < arr.length; k++) {
                if (arr[k] === 'FD') {
                    str += `<li class="vjs-menu-item definition " tabindex="-1" role="menuitemcheckbox">
                                流畅
                            </li>`;
                } else if (arr[k] === 'SD') {
                    str += `<li class="vjs-menu-item definition " tabindex="-1" role="menuitemcheckbox">
                                标清
                            </li>`;
                } else if (arr[k] === 'LD') {
                    str += `<li class="vjs-menu-item definition " tabindex="-1" role="menuitemcheckbox">
                                高清
                            </li>`;
                }
            }
            this.m3u8Arr = arrM3u8;
            var videoPanelMenu = window.jQuery('.vjs-fullscreen-control');
            videoPanelMenu.before(
                `<div
                    class="vjs-subs-caps-button  vjs-menu-button vjs-menu-button-popup vjs-control vjs-button"
                    aria-live="polite"
                    aria-expanded="false"
                    aria-haspopup="true"
                >
                    <div class="vjs-menu" role="presentation">
                        <ul class="vjs-menu-content" role="menu">
                            ${str}
                        </ul>
                    </div>
                    <button
                        class="vjs-subs-caps-button vjs-control vjs-button"
                        type="button"
                        aria-live="polite"
                        title="清晰度切换"
                        aria-disabled="false"
                    >
                        <span aria-hidden="true" class="vjs-icon-placeholder" />
                        <span class="vjs-control-text">清晰度切换</span>
                    </button>
                </div>`
            );
            window
                .jQuery('.video1 .definition')
                .eq(0)
                .addClass('actQxd');
            this.playVideo();
        },
        // 配置播放
        playVideo() {
            // 设置开始时间
            this.player.src(this.m3u8Arr[0]);
            this.player.currentTime(this.videoContent.currentTime);
            this.player.volume(0.5); // 默认音量
        }
    }
};
</script>

<style lang="scss">
.video1 {
    width: 100%;
    .vjs-big-play-button {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -1.5em;
        margin-top: -0.75em;
    }
    .vjs-control-text-qxd {
        color: #fff;
        display: block;
        line-height: 36px;
    }
    .definition.actQxd {
        background-color: rgba(115, 133, 159, 0.5);
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
