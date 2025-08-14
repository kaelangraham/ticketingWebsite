import { Cookies } from 'react-cookie'
import { useEffect } from 'react'
import { useNavigate, NavLink } from 'react-router'
import logo from './assets/logo.png'
export default function admin() {
    let navigate = useNavigate()
    const isAdmin = (new Cookies()).get('logIn') === 'admin' ? true : false 
    useEffect(() => {
        if (!isAdmin) {
            navigate('/login')
        }
    }, [])

    return (
        <>
            {!isAdmin ? <></> 
            : 
            <NavLink to='/' className='select-none w-45 absolute top-8 left-6'>
                <img src={logo} />
            </NavLink>
            }
        </>
    );
}