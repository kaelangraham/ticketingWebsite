import { useParams, NavLink, useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import { PlayIcon, HeartIcon, CaretLeftIcon, PlusIcon, MinusIcon } from '@phosphor-icons/react'

export default function movieInfo() {
    let navigate = useNavigate()
    let movieId = useParams().movieId
    const [movieData, setMovieData] = useState([])
    const [ticketData, setTicketData] = useState([])
    const [showingDate, setShowingDate] = useState<Date>(new Date())
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const months = ['Janurary', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const [showingTime, setShowingTime] = useState('')
    const [selectedShowing, setSelectedShowing] = useState()
    const [adultTickets, setAdultTickets] = useState(0)
    const [childTickets, setChildTickets] = useState(0)
    const [studentTickets, setStudentTickets] = useState(0)
    const [seniorTickets, setSeniorTickets] = useState(0)
    const [remainingTickets, setRemainingTickets] = useState(0)
    const [totalTickets, setTotalTickets] = useState(0)
    const [totalCost, setTotalCost] = useState(0)
    const [buyersEmail, setBuyersEmail] = useState('')
    const [validEmail, setValidEmail] = useState(true)

    useEffect(() => {
        fetch(`http://localhost:8081/movies?movieId=${movieId}`)
        .then(res => res.json())
        .then(data => {data.length > 0 ? setMovieData(data[0]) : ''})
        .catch(err => console.log(err))

        fetch(`http://localhost:8081/tickets?movieId=${movieId}`)
        .then(res => res.json())
        .then(data => {data.length > 0 ? setTicketData(data) : ''})
        .catch(err => console.log(err))
        
    }, [])

    useEffect(() => {
        if(movieData.id) {
            let date = new Date(movieData.showingDate)
            setShowingDate(date)
            let time = new Date('2025-01-01T' + movieData.showingTime + 'Z').toLocaleTimeString('en-US', {timeZone:'UTC', hour:'numeric', minute:'numeric'})
            setShowingTime(time)
        }
    }, [movieData])

    useEffect(() => {
        if(movieData.id) {
            setRemainingTickets(movieData.availableTickets - adultTickets - childTickets - studentTickets - seniorTickets)
            setTotalTickets(adultTickets + childTickets + studentTickets + seniorTickets)
            setTotalCost((adultTickets * movieData.ticketAdult + childTickets * movieData.ticketChild + studentTickets * movieData.ticketStudent + seniorTickets * movieData.ticketSenior).toFixed(2))

        }
    }, [movieData, adultTickets, childTickets, studentTickets, seniorTickets])

    const handleSelectShowing = (id) => {
        setSelectedShowing(id)
    }

    const handleChangeAdultTickets = (change) => {
        if(remainingTickets - change >= 0) {
        setAdultTickets(curr => curr + change)
        }
    }
    const handleChangeChildTickets = (change) => {
        if(remainingTickets - change >= 0) {
        setChildTickets(curr => curr + change)
        }
    }
    const handleChangeStudentTickets = (change) => {
        if(remainingTickets - change >= 0) {
        setStudentTickets(curr => curr + change)
        }
    }
    const handleChangeSeniorTickets = (change) => {
        if(remainingTickets - change >= 0) {
        setSeniorTickets(curr => curr + change)
        }
    }
    const handleEmailChange = (event) => {
        setBuyersEmail(event.target.value)
    }
    const handleCheckout = () => {
        if(validateEmail()) {
            setValidEmail(true)
            const tickets = handleTickets()
            const ticketData = {
                movieId: movieId,
                availableTickets: remainingTickets,
                buyerEmail: buyersEmail,
                tickets: tickets
            }
            // add to ticketsDB ++ update moviesDB
            fetch('http://localhost:8081/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ticketData)
            })
            .then(res => res.json())
            .then(data => navigate('/success'))
            .catch(err => console.log(err))
            
        } else {
            setValidEmail(false)
        }
    }

    const handleTickets = () => {
        let tickets = []
        let nextId = ticketData.length ? ticketData.at(-1).ticketId + 1 : 1
        for(let i = 0; i < adultTickets; i++) {
            tickets.push({ ticketId: nextId, ticketType: "adult" })
            nextId++
        }
        for(let i = 0; i < childTickets; i++) {
            tickets.push({ ticketId: nextId, ticketType: "child" })
            nextId++
        }
        for(let i = 0; i < studentTickets; i++) {
            tickets.push({ ticketId: nextId, ticketType: "student" })
            nextId++
        }
        for(let i = 0; i < seniorTickets; i++) {
            tickets.push({ ticketId: nextId, ticketType: "senior" })
            nextId++
        }
        return(tickets)
    }

    const validateEmail = () => {
        try {
        if(buyersEmail.split('@').length - 1 !== 1 || buyersEmail.split('.').length - 1 !== 1 ) {return false}
        
        if(buyersEmail.split(' ').length - 1 !== 0) {return false}

        const parts = [buyersEmail.split('@')[0], buyersEmail.split('@')[1].split('.')[0], buyersEmail.split('@')[1].split('.')[1]]
        for(let i = 0; i < parts.length; i++) {
            if(parts[i].length == 0) {
                return false
            }
        }
        } catch (error) {
            return false
        }
        return true
    }

    if(movieData.id){
    return(
        <div className='mb-50'>
            <div className='bg-gradient-to-b from-blue-100 to-transparent to-90% h-105 px-6 flex justify-end flex-col gap-4 mr-10 rounded'>
                <div className='flex gap-6'>
                    <img src={movieData.coverImg} className='h-60 rounded-lg shadow-lg'/>  
                    <div className='flex flex-col justify-end gap-2'>
                        <h1 className='poppins-medium text-3xl'>{movieData.name}</h1>
                        <p className='text-sm poppins-light tracking-tight'>{movieData.runtime + ' | ' + movieData.releaseDate}</p>
                        <div className='flex gap-4 ml-[-6px] pt-2'>
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
                <p className='poppins-light'>{movieData.description}</p>
            </div>
            
            <div className='px-6 mt-4'>
                <h1 className='poppins-medium text-2xl pt-8'>Times & Tickets</h1>
                <h2 className='poppins-medium mt-8 tracking-tight'>{movieData.theatreName}</h2>
                <p className='poppins-light text-xs pt-1 tracking-tight'>{[days[showingDate.getDay()], showingDate.getDate(), months[showingDate.getMonth()]].join(' ')}</p>
            </div>


            <div onClick={() => handleSelectShowing(0)} className={['mx-6 h-20 w-90 bg-(--primary-color) rounded pl-1 group mt-4 cursor-pointer border-1 border-white', selectedShowing == 0 && '!border-blue-400'].join(' ')}>
                <div className={['bg-white h-7/10 pl-2 pt-1 group-hover:bg-gray-50 rounded-tr-xs transition duration-300', selectedShowing == 0 && '!bg-gray-50'].join(' ')}>
                    <h1 className='poppins-medium'>{showingTime}</h1>
                    <p className='text-xs poppins-medium'>RECLINERS</p>
                </div>
                <div className='flex bg-gray-200 h-3/10 gap-2 pl-2 rounded-br-xs'>
                    <p className='poppins-medium text-(--text-light-color) text-sm self-center'>AD</p>
                    <p className='poppins-medium text-(--text-light-color) text-sm self-center'>CC</p>
                </div>
            </div>

            {selectedShowing !== undefined && 
            <div className='mx-6 mt-10'>
                <h1 className='poppins-medium text-xl pt-8'>Add Tickets</h1>
                <p className='poppins-light text-sm tracking-tight mb-4'>Available: {remainingTickets} / {movieData.totalTickets}</p>
                {/* ADULT TICKETS */}
                <div className='bg-white flex h-16 items-center w-110 px-2 border-1 mt-[-1px] border-gray-100'>
                    <h1 className='poppins-medium text-sm'>Adult</h1>
                    <p className='ml-auto mr-4 poppins-medium text-sm text-(--text-light-color)'>${movieData.ticketAdult}</p>
                    {adultTickets == 0 ? 
                    <button onClick={() => handleChangeAdultTickets(1)} className='cursor-pointer bg-gray-200 py-2 w-34 poppins-medium hover:border-blue-200 transition duration-300 rounded border-1 border-gray-100'>ADD</button>
                    :
                    <div className='w-34 flex items-center justify-center gap-2'>
                        <div onClick={() => handleChangeAdultTickets(-1)} className='border-1 p-0.5 bg-gray-50 rounded-full cursor-pointer'><MinusIcon weight='bold'/></div>
                        <input 
                        className='w-10 bg-gray-100 text-center rounded border-1 border-gray-200'
                        type='text'
                        value={adultTickets}
                        readOnly
                        />
                        <div onClick={() => handleChangeAdultTickets(1)} className='border-1 p-0.5 bg-gray-50 rounded-full cursor-pointer'><PlusIcon weight='bold'/></div>
                    </div>
                    }
                </div>

                {/* CHILD TICKETS */}
                <div className='bg-white flex h-16 items-center w-110 px-2 border-1 mt-[-1px] border-gray-100'>
                    <h1 className='poppins-medium text-sm'>Child</h1>
                    <p className='ml-auto mr-4 poppins-medium text-sm text-(--text-light-color)'>${movieData.ticketChild}</p>
                    {childTickets == 0 ? 
                    <button onClick={() => handleChangeChildTickets(1)} className='cursor-pointer bg-gray-200 py-2 w-34 poppins-medium hover:border-blue-200 transition duration-300 rounded border-1 border-gray-100'>ADD</button>
                    :
                    <div className='w-34 flex items-center justify-center gap-2'>
                        <div onClick={() => handleChangeChildTickets(-1)} className='border-1 p-0.5 bg-gray-50 rounded-full cursor-pointer'><MinusIcon weight='bold'/></div>
                        <input 
                        className='w-10 bg-gray-100 text-center rounded border-1 border-gray-200'
                        type='text'
                        value={childTickets}
                        readOnly
                        />
                        <div onClick={() => handleChangeChildTickets(1)} className='border-1 p-0.5 bg-gray-50 rounded-full cursor-pointer'><PlusIcon weight='bold'/></div>
                    </div>
                    }
                </div>
                {/* STUDENT TICKETS */}
                <div className='bg-white flex h-16 items-center w-110 px-2 border-1 mt-[-1px] border-gray-100'>
                    <h1 className='poppins-medium text-sm'>Student</h1>
                    <p className='ml-auto mr-4 poppins-medium text-sm text-(--text-light-color)'>${movieData.ticketStudent}</p>
                    {studentTickets == 0 ? 
                    <button onClick={() => handleChangeStudentTickets(1)} className='cursor-pointer bg-gray-200 py-2 w-34 poppins-medium hover:border-blue-200 transition duration-300 rounded border-1 border-gray-100'>ADD</button>
                    :
                    <div className='w-34 flex items-center justify-center gap-2'>
                        <div onClick={() => handleChangeStudentTickets(-1)} className='border-1 p-0.5 bg-gray-50 rounded-full cursor-pointer'><MinusIcon weight='bold'/></div>
                        <input 
                        className='w-10 bg-gray-100 text-center rounded border-1 border-gray-200'
                        type='text'
                        value={studentTickets}
                        readOnly
                        />
                        <div onClick={() => handleChangeStudentTickets(1)} className='border-1 p-0.5 bg-gray-50 rounded-full cursor-pointer'><PlusIcon weight='bold'/></div>
                    </div>
                    }
                </div>
                {/* SENIOR TICKETS */}
                <div className='bg-white flex h-16 items-center w-110 px-2 border-1 mt-[-1px] border-gray-100'>
                    <h1 className='poppins-medium text-sm'>Senior</h1>
                    <p className='ml-auto mr-4 poppins-medium text-sm text-(--text-light-color)'>${movieData.ticketSenior}</p>
                    {seniorTickets == 0 ? 
                    <button onClick={() => handleChangeSeniorTickets(1)} className='cursor-pointer bg-gray-200 py-2 w-34 poppins-medium hover:border-blue-200 transition duration-300 rounded border-1 border-gray-100'>ADD</button>
                    :
                    <div className='w-34 flex items-center justify-center gap-2'>
                        <div onClick={() => handleChangeSeniorTickets(-1)} className='border-1 p-0.5 bg-gray-50 rounded-full cursor-pointer'><MinusIcon weight='bold'/></div>
                        <input 
                        className='w-10 bg-gray-100 text-center rounded border-1 border-gray-200'
                        type='text'
                        value={seniorTickets}
                        readOnly
                        />
                        <div onClick={() => handleChangeSeniorTickets(1)} className='border-1 p-0.5 bg-gray-50 rounded-full cursor-pointer'><PlusIcon weight='bold'/></div>
                    </div>
                    }
                </div>
                {totalTickets > 0 && 
                <div className='ml-1 flex flex-col'>
                    <p className='poppins-medium text-sm text-(--text-light-color) mt-2'>{totalTickets} tickets selected</p>
                    <input
                        className={[' bg-gray-100 rounded py-2 px-2 w-110 poppins-regular text-sm border-1 focus:outline-none', validEmail ? ' border-gray-200' : 'border-red-400'].join(' ')}
                        type="email"
                        placeholder="Email address"
                        value={buyersEmail}
                        onChange={handleEmailChange}
                    />
                    <p className='poppins-medium text-lg text-(--text-dark-color) mt-10'>Total ${totalCost}</p>
                    <button onClick={handleCheckout} className='cursor-pointer w-fit bg-white py-3 px-8 poppins-medium text-sm hover:border-blue-200 transition duration-300 rounded border-1 border-gray-100'>CHECKOUT</button>
                </div>
                }

            </div>
            }
        </div>
    )}
    return(
        <div className="h-screen">
            <NavLink to="/" className='flex items-center group'>
                <CaretLeftIcon size={16} weight='bold' className='text-(--text-light-color) group-hover:text-(--primary-color) transition duration-200 poppins-regular' />
                <p className='text-(--text-light-color) group-hover:text-(--primary-color) transition duration-200 poppins-regular text-sm'>Back to Homepage</p>
            </NavLink>
            <h1 className='poppins-medium text-3xl mt-10'>Whoopsies! 😅</h1>
            <p className='text-xl poppins-light mt-1'>The page you were looking for cannot be found...</p>
        </div>
    )
}