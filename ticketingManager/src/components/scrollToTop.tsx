import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
    const { pathname } = useLocation()

    // on link change scrolls to top of the page
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])
    return null
}