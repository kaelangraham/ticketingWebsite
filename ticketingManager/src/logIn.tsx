import logo from './assets/logo.png'
import { NavLink, useNavigate } from 'react-router'
import { useState, useEffect } from 'react'
import { useCookies, Cookies } from 'react-cookie'
export default function logIn() {
    let navigate = useNavigate()
    const logins = [
        {username: 'kaelan', email: 'kaelan@gmail.com', password: 'password123', access: 'admin'}, 
        {username: 'sam', email: 'sam@gmail.com', password: 'samiscool', access: 'user'}, 
    ]
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [inputError, setInputError ] = useState(false)
    const [cookies, setCookie, removeCookie] = useCookies()

    useEffect(() => {
        if(cookies.logIn === 'admin') {
            navigate('/admin')
        }
        if(cookies.logIn === 'user') {
            navigate('/')
        }
    }, [cookies])

    const handleLogIn = () => {
        for(let i = 0; i < logins.length; i++) {
            if(username === logins[i].username || username === logins[i].email && password === logins[i].password) {
                setCookie('logIn', logins[i].access, {path: '/', maxAge: 3600})
            }
        setInputError(true)
        }
    }
    const handleEnter = (e) => {
        if(e.key == 'Enter') {
            handleLogIn()
        }
    }
    return(
        <div className='flex flex-col h-screen items-center py-40 relative bg-linear-to-b from-white to-cyan-50'>
            <NavLink to='/' className='select-none w-45 absolute top-8 left-6'>
                <img src={logo} />
            </NavLink>
            <div className="bg-white w-140 border-1 border-gray-300 rounded-xl py-10 px-15">
                <h1 className='text-3xl poppins-medium mb-10'>Log in</h1>
                <div className='mb-5'>
                    <p className='text-sm poppins-medium mb-2'>Username or Email</p>
                    <input
                        className={['rounded py-2 w-full poppins-regular border-1 border-gray-400 px-2', inputError ? 'border-red-400' : ''].join(' ')}
                        type="text"
                        value={username}
                        onInput={event => setUsername(event.target.value)}
                    />
                </div>
                <div className={['mb-10', inputError ? '!mb-2' : ''].join(' ')}>
                    <p className='text-sm poppins-medium mb-2'>Password</p>
                    <input
                        className={['rounded py-2 w-full poppins-regular border-1 border-gray-400 px-2', inputError ? 'border-red-400' : ''].join(' ')}
                        type="password"
                        value={password}
                        onInput={event => setPassword(event.target.value)}
                        onKeyDown={handleEnter}
                    />
                </div>
                {inputError ? (
                    <p className='text-red-400 poppins-light text-xs mb-6 h-2'>Your e-mail/password combination is incorrect. Please try again.</p>
                ) : ''}
                <button onClick={handleLogIn} className='cursor-pointer bg-cyan-600 py-2 px-8 rounded-3xl text-white poppins-regular text-sm hover:bg-cyan-700 transition duration-300'>Log in</button>
            </div>
        </div>
    )
}