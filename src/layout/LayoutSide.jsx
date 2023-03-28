import { defineComponent, Fragment } from 'vue'
import { Menu } from 'ant-design-vue'
import { showChildren } from './util'
import Icon from '@/components/icon'
import classNames from '@/common/classNamesBind'
import styles from './style/side.module.scss'

const MenuItem = Menu.Item
const SubMenu = Menu.SubMenu

const cx = classNames.bind(styles)

function createMenuItem (item) {
    if (item.children && item.children.length === 1) {
        const menuItemSlots = {
            icon: item.children[0].icon ? () => <Icon type={ item.children[0].icon }/> : undefined,
            default: () => <span>{ item.children[0].meta.title }</span>
        }
        return <MenuItem key={ item.children[0].name } v-slots={ menuItemSlots }/>
    } else {
        const menuItemSlots = {
            icon: item.icon ? () => <Icon type={ item.icon }/> : undefined,
            default: () => <span>{ item.meta.title }</span>
        }
        return showChildren(item) ? (
            <XSubMenu option={ item } key={ item.name }/>
        ) : (
            <MenuItem key={ item.name } v-slots={ menuItemSlots }/>
        )
    }
}

const XSubMenu = defineComponent({
    props: {
        ...SubMenu.props,
        option: {
            type: Object,
            default: () => ({})
        }
    },
    setup (props) {
        return () => {
            const subMenuSlots = {
                title: () => {
                    return (
                        <Fragment>
                            <Icon type={ props.option.icon }/>
                            <span>{ props.option.meta.title }</span>
                        </Fragment>
                    )
                },
                default: () => {
                    return props.option.children.map((item) => {
                        return createMenuItem(item)
                    })
                }
            }
            return <SubMenu key={ props.option.key } { ...props } v-slots={ subMenuSlots }/>
        }
    }
})

export default defineComponent({
    props: {
        collapsed: {
            type: Boolean,
            default: false
        },
        menus: {
            type: Array,
            default: () => ([])
        }
    },
    setup (props) {
        return () => {
            const sideStyles = {
                width: props.collapsed ? '77px' : '238px'
            }
            const sideSlots = {
                default: () => {
                    return props.menus.map((item) => {
                        return createMenuItem(item)
                    })
                }
            }
            const menuProps = {
                inlineCollapsed: props.collapsed,
                theme: 'dark',
                mode: 'inline'
            }
            return (
                <div class={ cx('layout-side') } style={ sideStyles }>
                    <div class={ cx('side') }>
                        <div class={ cx('side-logo') }/>
                        <Menu { ...menuProps } style={ sideStyles } v-slots={ sideSlots }/>
                    </div>
                </div>
            )
        }
    }
})
