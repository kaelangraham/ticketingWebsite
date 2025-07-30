import logo from '../assets/logo.png'
import { NavLink } from 'react-router'
import { FilmStripIcon, ClockIcon, VideoCameraIcon } from '@phosphor-icons/react'

export default function sidebar() {
    return(
        <div className='w-1/5 p-6 pt-8 fixed flex flex-col gap-15' style={{height: window.innerHeight}}>
            <NavLink to='/' className='w-4/5'>
                <img src={logo} />
            </NavLink>
            
            <div className='flex flex-col gap-6 pl-2'>
                <NavLink to='/' className='flex items-center gap-3 w-min transition duration-300'>
                    <FilmStripIcon size={26} width={26} />
                    <h1 className='poppins-medium'>MOVIES</h1>
                </NavLink>
                <NavLink to='/sessions' className='flex items-center gap-3 w-min transition duration-300'>
                    <ClockIcon size={26} width={26}/>
                    <h1 className='poppins-medium w-max'>SESSION TIMES</h1>
                </NavLink>
                <NavLink to='/cinemas' className='flex items-center gap-3 w-min transition duration-300'>
                    <VideoCameraIcon size={26} width={26}/>
                    <h1 className='poppins-medium'>CINEMAS</h1>
                </NavLink>
            </div>
        </div>
    )
}