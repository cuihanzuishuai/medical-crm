import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'
import Icon from '@/components/icon'
import { on, off } from '@/util/dom'
import classNames from '@/common/classNamesBind'
import styles from './style/index.module.scss'

const cx = classNames.bind(styles)

export default defineComponent({
    setup () {
        const dom = document

        const fullest = ref(false)

        function onChange () {
            fullest.value = !fullest.value
        }

        function isFullscreen () {
            return !!(
                dom.fullscreenElement ||
                dom.mozFullScreenElement ||
                dom.webkitFullscreenElement ||
                dom.fullScreen ||
                dom.mozFullScreen ||
                dom.webkitIsFullScreen
            )
        }

        function onExit () {
            if (dom.exitFullscreen) {
                dom.exitFullscreen()
            } else if (dom.mozCancelFullScreen) {
                dom.mozCancelFullScreen()
            } else if (dom.webkitCancelFullScreen) {
                dom.webkitCancelFullScreen()
            } else if (dom.msExitFullscreen) {
                dom.msExitFullscreen()
            }
        }

        function onRequest () {
            if (dom.body.requestFullscreen) {
                dom.body.requestFullscreen()
            } else if (dom.body.mozRequestFullScreen) {
                dom.body.mozRequestFullScreen()
            } else if (dom.body.webkitRequestFullScreen) {
                dom.body.webkitRequestFullScreen()
            } else if (dom.body.msRequestFullscreen) {
                dom.body.msRequestFullscreen()
            }
        }

        function handleFullscreen () {
            if (fullest.value) {
                onExit()
            } else {
                onRequest()
            }
        }

        onMounted(() => {
            fullest.value = isFullscreen()
            on(dom, 'fullscreenchange', onChange, false)
            on(dom, 'mozfullscreenchange', onChange, false)
            on(dom, 'webkitfullscreenchange', onChange, false)
            on(dom, 'msfullscreenchange', onChange, false)
        })

        onBeforeUnmount(() => {
            off(dom, 'fullscreenchange', onChange, false)
            off(dom, 'mozfullscreenchange', onChange, false)
            off(dom, 'webkitfullscreenchange', onChange, false)
            off(dom, 'msfullscreenchange', onChange, false)
        })

        return () => {
            const iconType = fullest.value ? 'icon-exit-fullscreen' : 'icon-fullscreen'
            return (
                <div class={ cx('fullscreen') }>
                    <Icon
                        class={ cx('fullscreen__icon') }
                        type={ iconType }
                        onClick={ handleFullscreen }
                    />
                </div>
            )
        }
    }
})
