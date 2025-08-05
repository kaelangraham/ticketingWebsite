import logo from '../assets/logo.png'
import { NavLink } from 'react-router'
import { FilmStripIcon, ClockIcon, VideoCameraIcon, CalendarDotsIcon, StarIcon } from '@phosphor-icons/react'

export default function sidebar() {
    return(
        <div className='w-1/5 p-6 pt-8 fixed flex flex-col gap-15' style={{height: window.innerHeight}}>
            <NavLink to='/' className='select-none w-4/5'>
                <img src={logo} />
            </NavLink>
            
            <div className='flex flex-col gap-6 pl-2'>
                <NavLink to='/' className='flex items-center gap-3 w-fit transition duration-300 tracking-tight'>
                    <FilmStripIcon size={26} width={26} />
                    <h1 className='poppins-medium'>MOVIES</h1>
                </NavLink>
                <a href='#' className='flex items-center gap-3 w-fit transition duration-300 tracking-tight'>
                    <ClockIcon size={26} width={26}/>
                    <h1 className='poppins-medium w-max'>SESSION TIMES</h1>
                </a>
                <a href='#' className='flex items-center gap-3 w-fit transition duration-300 tracking-tight'>
                    <VideoCameraIcon size={26} width={26}/>
                    <h1 className='poppins-medium'>CINEMAS</h1>
                </a>
                <a href='#' className='flex items-center gap-3 w-fit transition duration-300 tracking-tight'>
                    <CalendarDotsIcon size={26} width={26}/>
                    <h1 className='poppins-medium'>Events & Festivals</h1>
                </a>
                <a href='#' className='flex items-center gap-3 w-fit transition duration-300 tracking-tight'>
                    <StarIcon size={26} width={26}/>
                    <h1 className='poppins-medium'>Tickets'R'Us Rewards</h1>
                </a>
            </div>
            <div className='flex flex-col gap-4 pl-2'>
                <a href="#" className='w-fit transition duration-300 tracking-tight poppins-regular text-sm'>Offers & Promotions</a>
                <a href="#" className='w-fit transition duration-300 tracking-tight poppins-regular text-sm'>Experiences</a>
                <a href="#" className='w-fit transition duration-300 tracking-tight poppins-regular text-sm'>Food & Drink</a>
                <a href="#" className='w-fit transition duration-300 tracking-tight poppins-regular text-sm'>Gift Shop</a>
                <a href="#" className='w-fit transition duration-300 tracking-tight poppins-regular text-sm'>Functions & Parties</a>
                <a href="#" className='w-fit transition duration-300 tracking-tight poppins-regular text-sm'>Accessibility</a>
            </div>
        </div>
    )
}