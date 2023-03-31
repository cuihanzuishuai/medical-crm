import { onBeforeUnmount, ref, watchEffect } from 'vue'

export const MediaQueryEnum = {
    xs: {
        maxWidth: 575,
        matchMedia: '(max-width: 575px)'
    },
    sm: {
        minWidth: 576,
        maxWidth: 767,
        matchMedia: '(min-width: 576px) and (max-width: 767px)'
    },
    md: {
        minWidth: 768,
        maxWidth: 991,
        matchMedia: '(min-width: 768px) and (max-width: 991px)'
    },
    lg: {
        minWidth: 992,
        maxWidth: 1199,
        matchMedia: '(min-width: 992px) and (max-width: 1199px)'
    },
    xl: {
        minWidth: 1200,
        maxWidth: 1599,
        matchMedia: '(min-width: 1200px) and (max-width: 1599px)'
    },
    xxl: {
        minWidth: 1600,
        matchMedia: '(min-width: 1600px)'
    }
}

function getScreenClassName () {
    let className = 'md'
    if (typeof window === 'undefined') {
        return className
    }
    className = Object.keys(MediaQueryEnum).find((key) => {
        const { matchMedia } = MediaQueryEnum[key]
        return window.matchMedia(matchMedia).matches
    })
    return className
}

function useMediaQuery (mediaQuery) {
    const mediaQueryList = window.matchMedia(mediaQuery)

    const matches = ref(mediaQueryList.matches)

    const listener = (e) => {
        matches.value = e.matches
    }

    mediaQueryList.addListener(listener)

    onBeforeUnmount(() => {
        mediaQueryList.removeListener(listener)
    })

    return matches
}

function useMedia () {
    const isMd = useMediaQuery(MediaQueryEnum.md.matchMedia)
    const isLg = useMediaQuery(MediaQueryEnum.lg.matchMedia)
    const isXxl = useMediaQuery(MediaQueryEnum.xxl.matchMedia)
    const isXl = useMediaQuery(MediaQueryEnum.xl.matchMedia)
    const isSm = useMediaQuery(MediaQueryEnum.sm.matchMedia)
    const isXs = useMediaQuery(MediaQueryEnum.xs.matchMedia)

    const className = getScreenClassName()

    const colSpan = ref(className)

    function setColSpan (value) {
        colSpan.value = value
    }

    watchEffect(() => {
        if (isXxl.value) {
            return setColSpan('xxl')
        }
        if (isXl.value) {
            return setColSpan('xl')
        }
        if (isLg.value) {
            return setColSpan('lg')
        }
        if (isMd.value) {
            return setColSpan('md')
        }
        if (isSm.value) {
            return setColSpan('sm')
        }
        if (isXs.value) {
            return setColSpan('xs')
        }
        setColSpan('md')
    })

    return colSpan
}

export default useMedia
