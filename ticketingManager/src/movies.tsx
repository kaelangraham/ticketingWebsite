import { useEffect, useState } from 'react'
// icons import
import { ClockIcon, HeartIcon, PlayIcon, SlidersHorizontalIcon, ArrowsDownUpIcon, SquaresFourIcon, RowsIcon } from "@phosphor-icons/react"
import GenresPopUp from './components/genreFiltersPopUp'
// main images
import lrgImg1 from './assets/sorryBabyLrg.jpg'
import lrgImg2 from './assets/deepCoverLrg.jpg'
import { NavLink } from 'react-router'

// type declaration
interface movieData {
    id: number
    coverImg: string
    name: string
    description: string
    runtime: string
    releaseDate: number
}

export default function movies() {
    const [moviesData, setMoviesData] = useState<movieData>()
    const [displayList, setDisplayList] = useState<boolean>(true)
    // displayed types and matching query types
    const sortingTypesList = ['None', 'A-Z', 'Runtime', 'Release Date']
    const queryTypesList = ['id', 'name', 'runtime', 'releaseDate']
    const [sortingType, setSortingType] = useState<string>(sortingTypesList[0])
    const [popUpActive, setPopUpActive] = useState<boolean>(false)

    // database query on sorting type change
    useEffect(() => {
        const queryType = queryTypesList[sortingTypesList.indexOf(sortingType)]
        fetch(`http://localhost:8081/movies?sortType=${queryType}`)
        .then(res => res.json())
        .then(data => {setMoviesData(data)})
        .catch(err => console.log(err))
    }, [sortingType])

    const handleChangeSortType = () => {
        const currentIndex = sortingTypesList.indexOf(sortingType)
        const nextIndex = currentIndex == sortingTypesList.length - 1 ? 0 : currentIndex + 1
        setSortingType(sortingTypesList[nextIndex])
    }

    return(
        <>
        <title>Tickets R Us</title>
        {/* genre search popup */}
        {popUpActive && (
            <div>
            <div onClick={() => popUpActive && setPopUpActive(false)} className='backdrop-blur-xs brightness-25 fixed h-1/1 w-[calc(100%-520px)] top-0 left-0 z-50'/>
            <GenresPopUp onClosePopUp={() => setPopUpActive(false)} />
            </div>
            )}
        <div className='flex overflow-hidden gap-3'>
            <div className='w-210 h-110 overflow-hidden shrink-0 rounded-lg'>
                <img src={lrgImg1} />
            </div>
            <div className='w-210 h-110 overflow-hidden shrink-0 rounded-lg'>
                <img src={lrgImg2} />
            </div>
        </div>

        <div className='py-10 flex gap-4 items-center justify-end w-210'>
            <div onClick={() => setPopUpActive(true)} className='flex gap-2 border-1 border-(--text-light-color) w-fit rounded p-2 cursor-pointer hover:text-(--primary-color) transition duration-300'>
                <SlidersHorizontalIcon size={20} className='text-(--primary-color)'/>
                <p className='select-none poppins-regular text-sm self-center'>Key & Filters</p>
            </div>
            <div onClick={handleChangeSortType} className='flex gap-2 border-1 border-(--text-light-color) w-fit rounded p-2 cursor-pointer hover:text-(--primary-color) transition duration-300'>
                <ArrowsDownUpIcon size={20} className='text-(--primary-color)'/>
                <p className='select-none poppins-regular text-sm self-center'>{sortingType}</p>
            </div>
            <div className='flex gap-1'>
                <RowsIcon onClick={() => setDisplayList(true)} weight='light' size={32} className={['cursor-pointer hover:text-(--text-dark-color) transition duration-300', displayList ? 'text-(--primary-color)' : 'text-(--text-light-color)'].join(' ')} />
                <SquaresFourIcon onClick={() => setDisplayList(false)} weight='light' size={32} className={['cursor-pointer hover:text-(--text-dark-color) transition duration-300', !displayList ? 'text-(--primary-color)' : 'text-(--text-light-color)'].join(' ')} />
            </div>

        </div>

        {moviesData && moviesData.length > 0 ?
        //list display
        displayList ? (
        <div className='flex flex-col gap-10 pb-20'>
            {moviesData?.map((d: movieData) => (
                // movie displayinfo
                <div className='flex items-end w-210'>
                    <NavLink to={`/movies/${d.id}`} className='shrink-0'>
                        <img src={d.coverImg} className='h-60 rounded-lg cursor-pointer hover-dim transition duration-300'/>
                    </NavLink>
                    <div className='pl-8 flex flex-col gap-2'>
                        <NavLink to={`/movies/${d.id}`}>
                            <h1 className='hover-underline title cursor-pointer poppins-semibold text-2xl w-max'>{d.name}</h1>
                        </NavLink>
                        <p className='text-xs poppins-light tracking-tight'>{d.runtime + ' | ' + d.releaseDate}</p>
                        <p className='poppins-light'>{d.description}</p>
                        <div className='flex gap-4'>
                            <NavLink to={`/movies/${d.id}`} className='flex items-center gap-2 cursor-pointer hover-underline'>
                                <ClockIcon size={26} className='text-(--primary-color)'/>
                                <p>Times & Tickets</p>
                            </NavLink>
                            <a className='flex items-center gap-2 cursor-pointer hover-underline'>
                                <PlayIcon size={26} className='text-(--primary-color)'/>
                                <p>Trailer</p>
                            </a>
                            <a className='flex items-center gap-2 cursor-pointer hover-underline'>
                                <HeartIcon size={26} className='text-(--primary-color)'/>
                                <p>Watchlist</p>
                            </a>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        ) : (
            // grid display
        <div className='grid grid-cols-4 w-210 gap-12 pb-20'>
            {moviesData?.map((d: movieData) => (
                // movie dipslay info
                <div className='text-pretty flex flex-col gap-2'>
                    <NavLink to={`/movies/${d.id}`}>
                        <img src={d.coverImg} className='w-1/1 rounded-lg cursor-pointer hover-dim transition duration-300'/>
                    </NavLink>
                    <NavLink to={`/movies/${d.id}`}>
                        <h1 className='hover-underline title cursor-pointer poppins-semibold w-fit'>{d.name}</h1>
                    </NavLink>
                    <p className='text-xs poppins-light tracking-tight'>{d.runtime + ' | ' + d.releaseDate}</p>
                    <a className='flex items-center gap-2 cursor-pointer hover-underline w-fit'>
                        <HeartIcon size={26} className='text-(--primary-color)'/>
                        <p>Watchlist</p>
                    </a>
                </div>
            ))}

        </div>
        ) : (
        <div className='pb-20 pointer-events-none select-none'>
            <h1 className='poppins-medium text-2xl'>Our server is down!</h1>
            <p className='poppins-light text-sm'>Try again in a few minutes...</p>
        </div>
        )}
        </>
    )
}