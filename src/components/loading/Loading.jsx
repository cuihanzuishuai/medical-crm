import { defineComponent, ref, Transition } from 'vue'
import classNames from '@/common/classNamesBind'
import styles from './style/index.module.scss'

const cx = classNames.bind(styles)

export default defineComponent({
    props: {
        doClose: Function
    },
    setup (props) {
        const spinning = ref(true)

        function doClose () {
            props.doClose && props.doClose()
        }

        function onHide () {
            spinning.value = false
        }

        return {
            spinning,
            doClose,
            onHide
        }
    },
    render () {
        const { spinning } = this

        const spinProps = {
            size: 'large',
            spinning: spinning
        }

        return (
            <Transition name="x-mask" appear={ true } onAfterLeave={ this.doClose }>
                <div class={ cx('loading') } v-show={ spinning }>
                    <div class={ cx('loading-container') }>
                        <svg viewBox="25 25 50 50" class={ cx('circular') }>
                            <circle cx="50" cy="50" r="20" fill="none" class={ cx('path') }/>
                        </svg>
                    </div>
                </div>
            </Transition>
        )
    }
})
