// import icons
import { FacebookLogoIcon, XLogoIcon, InstagramLogoIcon, YoutubeLogoIcon, TiktokLogoIcon } from '@phosphor-icons/react'

export default function footer() {
    return(
        <div className='p-6 flex border-t-1 border-gray-200'>
            <div className='w-[calc(20%-24px)]'>
                <h1 className='poppins-semibold tracking-tight pb-2'>Follow Us</h1>
                {/* icon links */}
                <div className='flex gap-2'>
                    <FacebookLogoIcon size={26} className='hover:text-(--primary-color) cursor-pointer z-10 transition duration-300'/>
                    <XLogoIcon size={26} className='hover:text-(--primary-color) cursor-pointer z-10 transition duration-300'/>
                    <InstagramLogoIcon size={26} className='hover:text-(--primary-color) cursor-pointer z-10 transition duration-300'/>
                    <YoutubeLogoIcon size={26} className='hover:text-(--primary-color) cursor-pointer z-10 transition duration-300'/>
                    <TiktokLogoIcon size={26} className='hover:text-(--primary-color) cursor-pointer z-10 transition duration-300'/>
                </div>
            </div>

            <div className=''>
                <h1 className='poppins-semibold tracking-tight pb-2'>About Us</h1>
                {/* text links */}
                <div className='flex gap-3'>
                    <a href='#' className='poppins-regular tracking-tight text-sm hover:text-(--primary-color) cursor-pointer transition duration-300'>FAQ</a>
                    <a href='#' className='poppins-regular tracking-tight text-sm hover:text-(--primary-color) cursor-pointer transition duration-300'>Careers</a>
                    <a href='#' className='poppins-regular tracking-tight text-sm hover:text-(--primary-color) cursor-pointer transition duration-300'>About Tickets'R'Us</a>
                    <a href='#' className='poppins-regular tracking-tight text-sm hover:text-(--primary-color) cursor-pointer transition duration-300'>Accessibility</a>
                    <a href='#' className='poppins-regular tracking-tight text-sm hover:text-(--primary-color) cursor-pointer transition duration-300'>Gift Card Balance</a>
                    <a href='#' className='poppins-regular tracking-tight text-sm hover:text-(--primary-color) cursor-pointer transition duration-300'>Contact Us</a>
                </div>
            </div>
        </div>
    )
}