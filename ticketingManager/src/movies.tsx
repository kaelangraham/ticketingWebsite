import { useEffect, useState } from 'react'
import { ClockIcon, HeartIcon, PlayIcon } from "@phosphor-icons/react"
import lrgImg1 from './assets/sorryBabyLrg.jpg'
import lrgImg2 from './assets/deepCoverLrg.jpg'

export default function movies() {
    const [moviesData, setMoviesData] = useState([])
    const [genreData, setGenreData] = useState([])
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
        {moviesData.map((d, i) => (
            <div>
                <img src={d.coverImg}/>
                <div>
                    <h1>{d.name}</h1>
                    <p>{d.runtime + ' | ' + d.releaseDate}</p>
                    <p>{d.description}</p>
                    <div className='flex gap-4'>
                        <a className='flex items-center gap-2 cursor-pointer hoverUnderline'>
                            <ClockIcon size={26} className='text-(--primary-color)'/>
                            <p>Times & Tickets</p>
                        </a>
                        <a className='flex items-center gap-2 cursor-pointer hoverUnderline'>
                            <PlayIcon size={26} className='text-(--primary-color)'/>
                            <p>Trailer</p>
                        </a>
                        <a className='flex items-center gap-2 cursor-pointer hoverUnderline'>
                            <HeartIcon size={26} className='text-(--primary-color)'/>
                            <p>Watchlist</p>
                        </a>
                    </div>
                </div>
            </div>
        ))}
        </>
    )
}