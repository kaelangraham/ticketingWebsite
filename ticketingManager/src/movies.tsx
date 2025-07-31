import { useEffect, useState } from 'react'
import { ClockIcon, HeartIcon, PlayIcon, SlidersHorizontalIcon, ArrowsDownUpIcon, SquaresFourIcon, RowsIcon } from "@phosphor-icons/react"
import lrgImg1 from './assets/sorryBabyLrg.jpg'
import lrgImg2 from './assets/deepCoverLrg.jpg'

export default function movies() {
    const [moviesData, setMoviesData] = useState([])
    const [genreData, setGenreData] = useState([])
    const [displayList, setDisplayList] = useState(true)

    useEffect(() => {
        fetch(`http://localhost:8081/movies`)
        .then(res => res.json())
        .then(data => {setMoviesData(data[0]), setGenreData(data[1])})
        .catch(err => console.log(err))
    }, [])
    useEffect(() => {
        console.log(moviesData, genreData)
    }, [moviesData, genreData])
    return(
        <>
        <div className='flex overflow-hidden gap-3'>
            <div className='w-210 h-110 overflow-hidden shrink-0 rounded-lg'>
                <img src={lrgImg1} />
            </div>
            <div className='w-210 h-110 overflow-hidden shrink-0 rounded-lg'>
                <img src={lrgImg2} />
            </div>
        </div>

        <div className='py-10 flex gap-4 items-center justify-end w-210'>
            <div className='flex gap-2 border-1 border-(--text-light-color) w-fit rounded p-2 cursor-pointer hover:text-(--primary-color) transition duration-300'>
                <SlidersHorizontalIcon size={20} className='text-(--primary-color)'/>
                <p className='poppins-regular text-sm self-center'>Key & Filters</p>
            </div>
            <div className='flex gap-2 border-1 border-(--text-light-color) w-fit rounded p-2 cursor-pointer hover:text-(--primary-color) transition duration-300'>
                <ArrowsDownUpIcon size={20} className='text-(--primary-color)'/>
                <p className='poppins-regular text-sm self-center'>None</p>
            </div>
            <div className='flex gap-1'>
                <RowsIcon onClick={() => setDisplayList(true)} weight='light' size={32} className={['cursor-pointer hover:text-(--text-dark-color) transition duration-300', displayList ? 'text-(--primary-color)' : 'text-(--text-light-color)'].join(' ')} />
                <SquaresFourIcon onClick={() => setDisplayList(false)} weight='light' size={32} className={['cursor-pointer hover:text-(--text-dark-color) transition duration-300', !displayList ? 'text-(--primary-color)' : 'text-(--text-light-color)'].join(' ')} />
            </div>

        </div>

        {displayList ? (
        <div className='flex flex-col gap-10 pb-20'>
            {moviesData.map((d, i) => (
                <div className='flex items-end w-210'>
                    <img src={d.coverImg} className='h-60 rounded-lg cursor-pointer hover-dim transition duration-300'/>
                    <div className='pl-8 flex flex-col gap-2'>
                        <h1 className='hover-underline title cursor-pointer poppins-semibold text-2xl w-max'>{d.name}</h1>
                        <p className='text-xs poppins-light tracking-tight'>{d.runtime + ' | ' + d.releaseDate}</p>
                        <p className='poppins-light'>{d.description}</p>
                        <div className='flex gap-4'>
                            <a className='flex items-center gap-2 cursor-pointer hover-underline'>
                                <ClockIcon size={26} className='text-(--primary-color)'/>
                                <p>Times & Tickets</p>
                            </a>
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
        <div className='grid grid-cols-4 w-210 gap-12 pb-20'>
            {moviesData.map((d, i) => (
                <div className='text-pretty flex flex-col gap-2'>
                    <img src={d.coverImg} className='w-1/1 rounded-lg cursor-pointer hover-dim transition duration-300'/>
                    <h1 className='hover-underline title cursor-pointer poppins-semibold w-fit'>{d.name}</h1>
                    <p className='text-xs poppins-light tracking-tight'>{d.runtime + ' | ' + d.releaseDate}</p>
                    <a className='flex items-center gap-2 cursor-pointer hover-underline w-fit'>
                        <HeartIcon size={26} className='text-(--primary-color)'/>
                        <p>Watchlist</p>
                    </a>
                </div>
            ))}

        </div>
        )}
        
        </>
    )
}