import { useState, useEffect } from 'react'
// icons import
import { MagnifyingGlassIcon, UserIcon, SignOutIcon } from '@phosphor-icons/react'
import { useNavigate } from 'react-router'
import { Cookies, useCookies } from 'react-cookie'
// searchbar dropdown import
import Dropdown from './movieSearchDropdown'

export default function navbar() {
    let navigate = useNavigate()
    const isLoggedIn = (new Cookies()).get('logIn') ? true : false
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [cookies, setCookie, removeCookie] = useCookies()
    const [searchData, setSearchData] = useState([])
    const [dropdownFocused, setDropdownFocused] = useState<boolean>(false)

    // get data on searchterm change
    useEffect(() => {
        if(searchTerm.trim()) {
            fetch(`http://localhost:8081/moviesSearch?searchParam=${searchTerm.trim()}`)
            .then(res => res.json())
            .then(data => setSearchData(data))
            .catch(err => console.log(err))
        } else {
            setSearchData([])
        }
    }, [searchTerm])

    // sets searchbar input as variable for querying
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value)
    }
    // clears searchbar input
    const handleClearSearch = () => {
        setSearchTerm('')
        setDropdownFocused(false)
    }
    // login/logout logic
    const handleLogInClicked = () => {
        if (isLoggedIn) {
            removeCookie('logIn')
            window.location.reload()
        } else {
            navigate('/login')
        }
    }

    return(
        <>
        {// blurred background + dropdown toggle
        dropdownFocused ? <div onClick={() => setDropdownFocused(false)} className='h-full w-full fixed left-0 backdrop-blur-xs brightness-25  z-20' /> : ''}
        <div className='py-8 flex gap-8'>
            <div className='relative w-26/30 rounded z-30'>
            {/* searchbar */}
                <input
                    className='bg-gray-100 rounded py-2 px-12 w-1/1 poppins-regular'
                    type="text"
                    placeholder="Search movies and more..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onClick={() => setDropdownFocused(true)}
                />
                <MagnifyingGlassIcon weight='bold' size={16} className='absolute left-4 top-[50%] mt-[-8px] pointer-events-none' />
                <p onClick={handleClearSearch} className='select-none absolute top-[50%] right-4 text-sm mt-[-10px] poppins-medium tracking-tighter text-(--primary-color) cursor-pointer transition duration-300 hover:text-(--text-dark-color)'>Clear</p>
            </div>
            {/* login/logout */}
            <div onClick={handleLogInClicked} className='select-none flex items-center gap-2 cursor-pointer group'>
                { isLoggedIn ? (
                    <SignOutIcon weight='bold' size={24} className='text-red-400 group-hover:text-red-500 transition duration-300'/>
                ) : (
                    <UserIcon weight='bold' size={24} className='text-(--primary-color) group-hover:text-(--text-dark-color) transition duration-300'/>
                )}
                <p className='font-medium text-(--text-light-color) group-hover:text-(--text-dark-color) transition duration-300'>{isLoggedIn ? "Log Out" : "Log In"}</p>
            </div>
        </div>
        {/* searchbar dropdown */}
        <div className='absolute'>
        <Dropdown searchData={searchData} searchTerm={searchTerm} dropdownFocused={dropdownFocused} clearSearch={handleClearSearch}/>
        </div>
        </>
    )
}