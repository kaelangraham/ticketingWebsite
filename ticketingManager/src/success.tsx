import { useNavigate } from 'react-router'
import { useEffect } from 'react'

export default function success() {
    let navigate = useNavigate()
    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/')
        }, 5000)
        return () => clearTimeout(timer)
    }, [])
    return(
        <div className='h-screen'>
            <h1 className='poppins-medium text-2xl'>Your payment has been confirmed!</h1>
            <p className='poppins-light text-(--text-light-color) text-sm'>You will be automatically redirected in 5s</p>
        </div>
    )
}