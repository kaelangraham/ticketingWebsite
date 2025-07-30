import { useState, useEffect } from 'react'
import { MagnifyingGlassIcon, UserIcon } from '@phosphor-icons/react'

export default function navbar() {
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        
    }, [searchTerm])

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value)
    }
    const handleClearSearch = () => {
        setSearchTerm('')
    }

    return(
        <div className='py-8 flex gap-8'>
            <div className='relative w-13/15 rounded'>
                <input
                    className='bg-gray-100 rounded py-2 px-12 w-1/1 poppins-regular'
                    type="text"
                    placeholder="Search movies and more..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <MagnifyingGlassIcon weight='bold' size={16} className='absolute left-4 top-[50%] mt-[-8px] pointer-events-none' />
                <p onClick={handleClearSearch} className='absolute top-[50%] right-4 text-sm mt-[-10px] poppins-medium tracking-tighter text-(--primary-color) cursor-pointer'>Clear</p>
            </div>
            <a className='flex items-center gap-2 transition cursor-pointer'>
                <UserIcon weight='bold' size={24} />
                <p className='font-medium'>Log In</p>
            </a>
        </div>
    )
}