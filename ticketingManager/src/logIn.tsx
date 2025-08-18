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
    const [rememberMe, setRememberMe] = useState(false)

    useEffect(() => {
        if(cookies.logIn) {
            console.log(rememberMe)
            navigate('/')
        }
    }, [cookies])

    const handleLogIn = () => {
        for(let i = 0; i < logins.length; i++) {
            if(username === logins[i].username || username === logins[i].email && password === logins[i].password) {
                setCookie('logIn', logins[i].access, {path: '/', maxAge: rememberMe? 100000000 : 3600})
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
            <title>Log In | Tickets R Us</title>
            <NavLink to='/' className='select-none w-45 absolute top-8 left-6'>
                <img src={logo} />
            </NavLink>
            <div className="bg-white w-140 rounded-xl py-10 px-15 flex flex-col items-start shadow-2xl  border-1 border-gray-200">
                <h1 className='text-3xl poppins-medium mb-10'>Log in</h1>
                <div className='mb-5 w-full'>
                    <p className='text-sm poppins-medium mb-2'>Username or Email</p>
                    <input
                        className={['rounded py-2 w-full poppins-regular border-1 border-gray-400 px-2', inputError ? 'border-red-400' : ''].join(' ')}
                        type="text"
                        value={username}
                        onInput={event => setUsername(event.target.value)}
                    />
                </div>
                <div className='w-full mb-2'>
                    <p className='text-sm poppins-medium mb-2'>Password</p>
                    <input
                        className={['rounded py-2 w-full poppins-regular border-1 border-gray-400 px-2', inputError ? 'border-red-400' : ''].join(' ')}
                        type="password"
                        value={password}
                        onInput={event => setPassword(event.target.value)}
                        onKeyDown={handleEnter}
                    />
                </div>
                <div className={['w-full flex flex-row gap-2 group', inputError ? 'mb-2' : 'mb-10'].join(' ')}>
                    <input
                        className='cursor-pointer'
                        id='rememberMe'
                        type="checkbox"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                    />
                    <label className='cursor-pointer select-none poppins-regular text-sm mb-[-1px] group-hover:text-(--text-light-color) transition duration-300' htmlFor="rememberMe">Remember Me</label>
                </div>
                {inputError ? (
                    <p className='text-red-400 poppins-light text-xs mb-6 h-2'>Your e-mail/password combination is incorrect. Please try again.</p>
                ) : ''}
                <button onClick={handleLogIn} className='cursor-pointer bg-cyan-600 py-2 px-8 rounded-3xl text-white poppins-regular text-sm hover:bg-cyan-700 transition duration-300'>Log in</button>
            </div>
        </div>
    )
}