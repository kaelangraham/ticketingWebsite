// genre filter pop up (doesnt work)
import { useEffect, useState } from 'react'
// import icons
import { XIcon } from '@phosphor-icons/react'

// type declerations
interface popUpProps{
    onClosePopUp?: () => void
}

interface Genre {
    id: number
    genre: string
}

export default function genreFiltersPopUp({onClosePopUp}: popUpProps) {
    // useState variables
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [genres, setGenres] = useState<Genre[]>([])
    
    // db query on genre search change
    useEffect(() => {
        const querySearch = searchTerm
        fetch(`http://localhost:8081/genres?search=${querySearch}`)
        .then(res => res.json())
        .then(data => setGenres(data))
        .catch(err => console.log(err))
    }, [searchTerm])

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // sets search term as var for queries
        setSearchTerm(event.target.value)
    }
    return(
        <div className='bg-gray-100 fixed right-0 w-130 h-1/1 top-0 shadow-2xl z-50 py-10 px-6'>
            <div className='flex flex-col gap-5'>
                {/* header */}
                <div className='flex justify-items-end relative px-2'>
                    <h1 className='poppins-medium text-(--text-dark-color)'>Key & Filters</h1>
                    <XIcon onClick={onClosePopUp} weight='bold' size={24} className='text-(--text-light-color) hover:text-(--primary-color) cursor-pointer z-10 transition duration-300 absolute right-0' />
                </div>
                {/* search input */}
                <input
                    className='bg-white rounded p-2 w-1/1 poppins-regular text-sm'
                    type="text"
                    placeholder="Search by genre..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>
            {/* genres from database */}
            <div className='flex flex-col overflow-y-scroll gap-3 h-1/1 hide-scrollbar mt-5 pb-50'>
                {genres.length > 0? genres.map((d) => (
                        <label className='poppins-medium tracking-tight relative py-3 px-6 rounded border-1 border-gray-200 shadow-sm hover:shadow-none hover:bg-blue-50 transition duration-200'>
                            <input
                                type='checkbox'
                                name='genres'
                                value={d.id}
                                className='absolute right-6 top-1/2 w-4 h-4 mt-[-8px]'
                            />
                            {d.genre}
                        </label>
                )) : (
                    // error catching if no results
                    <div className='pb-20 pointer-events-none select-none justify-center flex pt-5'>
                        <h1 className='poppins-medium text-xl'>No Results!</h1>
                    </div>
                )}
            </div>
            {/* apply/cancel buttons */}
            <div className='bg-white absolute left-0 bottom-0 w-1/1 py-4 px-6 flex flex-col gap-4 items-center border-t-1 border-gray-300 shadow-2xl'>
                <button onClick={onClosePopUp} className='bg-(--primary-color) w-1/1 py-3 rounded cursor-pointer hover:bg-(--text-light-color) transition duration-300'>
                    <p className='poppins-semibold tracking-tight text-white'>Apply Filters</p>
                </button>
                <p className='cursor-pointer text-(--primary-color) hover:text-(--text-light-color) transition duration-300 poppins-regular text-sm'>Clear selection</p>
            </div>
        </div>
    )
}