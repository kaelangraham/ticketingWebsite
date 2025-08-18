import { useParams, NavLink, useNavigate } from 'react-router'
import React, { useEffect, useState, useRef } from 'react'
// icons import
import { PlayIcon, HeartIcon, CaretLeftIcon, PlusIcon, MinusIcon, TrashIcon, PencilSimpleIcon } from '@phosphor-icons/react'
import { Cookies } from 'react-cookie'

// type declerations
interface movieData {
    id: number
    coverImg: string
    name: string
    description: string
    runtime: string
    releaseDate: number
    showingDate: Date
    showingTime: string
    availableTickets: number
    ticketAdult: number
    ticketChild: number
    ticketStudent: number
    ticketSenior: number
    theatreName: string
    totalTickets: number
}
interface ticketData {
    ticketId: number
    ticketType: string
}

export default function movieInfo() {
    const [refresh, refreshData] = useState<any>()
    let navigate = useNavigate()
    let movieId = useParams().movieId
    const isAdmin = (new Cookies()).get('logIn') === 'admin' ? true : false 
    const [movieData, setMovieData] = useState<movieData>()
    const [ticketData, setTicketData] = useState<ticketData[]>([])
    const [showingDate, setShowingDate] = useState<Date>(new Date())
    // days/months for nice display formatting
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const months = ['Janurary', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const [showingTime, setShowingTime] = useState<string>('')
    const [selectedShowing, setSelectedShowing] = useState<number>()
    // number of each tickets ordered
    const [adultTickets, setAdultTickets] = useState<number>(0)
    const [childTickets, setChildTickets] = useState<number>(0)
    const [studentTickets, setStudentTickets] = useState<number>(0)
    const [seniorTickets, setSeniorTickets] = useState<number>(0)
    // for adming editing
    const [deletePressed, setDeletePressed] = useState<boolean>(false)
    const [editAdultTicket, setEditAdultTicket] = useState<boolean>(false)
    const [editChildTicket, setEditChildTicket] = useState<boolean>(false)
    const [editStudentTicket, setEditStudentTicket] = useState<boolean>(false)
    const [editSeniorTicket, setEditSeniorTicket] = useState<boolean>(false)
    // value references (admin editing)
    const adultInputRef = useRef<HTMLInputElement>(null)
    const childInputRef = useRef<HTMLInputElement>(null)
    const studentInputRef = useRef<HTMLInputElement>(null)
    const seniorInputRef = useRef<HTMLInputElement>(null)
    // ticket ordering variables
    const [remainingTickets, setRemainingTickets] = useState<number>(0)
    const [totalTickets, setTotalTickets] = useState<number>(0)
    const [totalCost, setTotalCost] = useState<string>('')
    const [buyersEmail, setBuyersEmail] = useState<string>('')
    const [validEmail, setValidEmail] = useState<boolean>(true)

    // database query on 'refresh' and change in movieId - /movies/id (fix for searchbar)
    useEffect(() => {
        fetch(`http://localhost:8081/movies?movieId=${movieId}`)
        .then(res => res.json())
        .then(data => {data.length > 0 ? setMovieData(data[0]) : ''})
        .catch(err => console.log(err))

        fetch(`http://localhost:8081/tickets?movieId=${movieId}`)
        .then(res => res.json())
        .then(data => {data.length > 0 ? setTicketData(data) : ''})
        .catch(err => console.log(err))
        
    }, [refresh, movieId])

    // data and time formating
    useEffect(() => {
        if(movieData) {
            let date = new Date(movieData.showingDate)
            setShowingDate(date)
            let time = new Date('2025-01-01T' + movieData.showingTime + 'Z').toLocaleTimeString('en-US', {timeZone:'UTC', hour:'numeric', minute:'numeric'})
            setShowingTime(time)
        }
    }, [movieData])

    // ticket ordering
    useEffect(() => {
        if(movieData) {
            setRemainingTickets(movieData.availableTickets - adultTickets - childTickets - studentTickets - seniorTickets)
            setTotalTickets(adultTickets + childTickets + studentTickets + seniorTickets)
            setTotalCost((adultTickets * movieData.ticketAdult + childTickets * movieData.ticketChild + studentTickets * movieData.ticketStudent + seniorTickets * movieData.ticketSenior).toFixed(2))
        }
    }, [movieData, adultTickets, childTickets, studentTickets, seniorTickets])

    const handleSelectShowing = (id: number) => {
        setSelectedShowing(id)
    }

    // change in tickets updater
    const handleChangeAdultTickets = (change: number) => {
        if(remainingTickets - change >= 0) {
        setAdultTickets(curr => curr + change)
        }
    }
    const handleChangeChildTickets = (change: number) => {
        if(remainingTickets - change >= 0) {
        setChildTickets(curr => curr + change)
        }
    }
    const handleChangeStudentTickets = (change: number) => {
        if(remainingTickets - change >= 0) {
        setStudentTickets(curr => curr + change)
        }
    }
    const handleChangeSeniorTickets = (change: number) => {
        if(remainingTickets - change >= 0) {
        setSeniorTickets(curr => curr + change)
        }
    }
    // sets email input as a variable for validating + db
    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBuyersEmail(event.target.value)
    }
    
    const handleCheckout = () => {
        // checks if email is valid
        if(validateEmail()) {
            setValidEmail(true)
            // gets list of ordered tickets
            const tickets = handleTickets()
            // sets post query
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
            // navigate to success page if successful
            .then(data => navigate('/success'))
            .catch(err => console.log(err))
        } else {
            setValidEmail(false)
        }
    }

    // creates list of ordered tickets
    const handleTickets = () => {
        let tickets = []
        // finds next id of selected showing
        let nextId =  (ticketData.at(-1)?.ticketId ?? 0) + 1
        // filters through each selected ticket and adds to list with id and type
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

    // checks if email is valid
    const validateEmail = () => {
        try {
        // checks if email has 1 '@' and 1 '.'
        if(buyersEmail.split('@').length - 1 !== 1 || buyersEmail.split('.').length - 1 !== 1 ) {return false}
        // checks if email has empty space 
        if(buyersEmail.split(' ').length - 1 !== 0) {return false}
        // splits into three parts, part1@part2.part3
        const parts = [buyersEmail.split('@')[0], buyersEmail.split('@')[1].split('.')[0], buyersEmail.split('@')[1].split('.')[1]]
        // checks if each part has a length of 0
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
    // deletes movie from db
    const handleDelete = () => {
        fetch(`http://localhost:8081/delete?movieId=${movieId}`)
        .then(res => res.json())
        .then(data => navigate('/'))
        .catch(err => console.log(err))
    }
    
    // ADULT
    const submitAdultTicketEdit = (
        e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        // checks if input is a click (from button) or enter keypress (from textbox)
        if (
            e.type === 'click' ||
            (e.type === 'keydown' && (e as React.KeyboardEvent<HTMLInputElement>).key === 'Enter')
        ) {
            // sets input to 2dp (0.00)
            let value = Number(adultInputRef.current?.value).toFixed(2)
            // gets data ready for post
            const pricesData = {
                movieId: movieId,
                ticketAdult: value,
                ticketChild: movieData?.ticketChild,
                ticketStudent: movieData?.ticketStudent,
                ticketSenior: movieData?.ticketSenior
            }
            // updates ticket price from db
            fetch('http://localhost:8081/updateTickets', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(pricesData)
                })
                .then(res => res.json())
                // changes refreshData useState to quickly refresh page (without actually refreshing)
                .then(data => refreshData(data))
                .catch(err => console.log(err))
            setEditAdultTicket(false)
        }
    }

    // CHILD
    const submitChildTicketEdit = (
        e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        // checks if input is a click (from button) or enter keypress (from textbox)
        if (
            e.type === 'click' ||
            (e.type === 'keydown' && (e as React.KeyboardEvent<HTMLInputElement>).key === 'Enter')
        ) {
            // sets input to 2dp (0.00)
            let value = Number(childInputRef.current?.value).toFixed(2)
            // gets data ready for post
            const pricesData = {
                movieId: movieId,
                ticketAdult: movieData?.ticketAdult,
                ticketChild: value,
                ticketStudent: movieData?.ticketStudent,
                ticketSenior: movieData?.ticketSenior
            }
            // updates ticket price from db
            fetch('http://localhost:8081/updateTickets', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(pricesData)
                })
                .then(res => res.json())
                // changes refreshData useState to quickly refresh page (without actually refreshing)
                .then(data => refreshData(data))
                .catch(err => console.log(err))
            setEditChildTicket(false)
        }
    }

    // STUDENT
    const submitStudentTicketEdit = (
        e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        // checks if input is a click (from button) or enter keypress (from textbox)
        if (
            e.type === 'click' ||
            (e.type === 'keydown' && (e as React.KeyboardEvent<HTMLInputElement>).key === 'Enter')
        ) {
            // sets input to 2dp (0.00)
            let value = Number(studentInputRef.current?.value).toFixed(2)
            // gets data ready for post
            const pricesData = {
                movieId: movieId,
                ticketAdult: movieData?.ticketAdult,
                ticketChild: movieData?.ticketChild,
                ticketStudent: value,
                ticketSenior: movieData?.ticketSenior
            }
            // updates ticket price from db
            fetch('http://localhost:8081/updateTickets', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(pricesData)
                })
                .then(res => res.json())
                // changes refreshData useState to quickly refresh page (without actually refreshing)
                .then(data => refreshData(data))
                .catch(err => console.log(err))
            setEditStudentTicket(false)
        }   
    }
    
    // SENIOR
    const submitSeniorTicketEdit = (
        e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        // checks if input is a click (from button) or enter keypress (from textbox)
        if (
            e.type === 'click' ||
            (e.type === 'keydown' && (e as React.KeyboardEvent<HTMLInputElement>).key === 'Enter')
        ) {
            // sets input to 2dp (0.00)
            let value = Number(seniorInputRef.current?.value).toFixed(2)
            // gets data ready for post
            const pricesData = {
                movieId: movieId,
                ticketAdult: movieData?.ticketAdult,
                ticketChild: movieData?.ticketChild,
                ticketStudent: movieData?.ticketStudent,
                ticketSenior: value
            }
            // updates ticket price from db
            fetch('http://localhost:8081/updateTickets', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(pricesData)
                })
                .then(res => res.json())
                // changes refreshData useState to quickly refresh page (without actually refreshing)
                .then(data => refreshData(data))
                .catch(err => console.log(err))
            setEditSeniorTicket(false)
        }
    }
    
    // if no data show error
    if(!movieData){
        return(
        <div className="h-screen">
            <title>404</title>
            <NavLink to="/" className='flex items-center group'>
                <CaretLeftIcon size={16} weight='bold' className='text-(--text-light-color) group-hover:text-(--primary-color) transition duration-200 poppins-regular' />
                <p className='text-(--text-light-color) group-hover:text-(--primary-color) transition duration-200 poppins-regular text-sm'>Back to Homepage</p>
            </NavLink>
            <h1 className='poppins-medium text-3xl mt-10'>Whoopsies! 😅</h1>
            <p className='text-xl poppins-light mt-1'>The page you were looking for cannot be found...</p>
        </div>
    )}
    return(
        <div className='mb-50'>
            {/* movie info */}
            <title>{movieData.name + ' | Tickets R Us'}</title>
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
                            {// movie delete option if admin
                            isAdmin ? (
                                !deletePressed ? (
                            <div onClick={() => setDeletePressed(true)} className='flex items-center gap-1 cursor-pointer group'>
                                <TrashIcon size={26} className='text-red-400 group-hover:text-red-600 transition duration-300'/>
                                <p className='text-red-400 group-hover:text-red-600 transition duration-300'>Delete</p>
                            </div>
                                ) : (
                            <div onClick={handleDelete} className='flex items-center gap-1 cursor-pointer group'>
                                <TrashIcon size={26} className='text-red-400 group-hover:text-red-600 transition duration-300'/>
                                <p className='text-red-400 group-hover:text-red-600 transition duration-300'>Confirm Delete?</p>
                            </div>
                                )
                            ) : ''}
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

            {/* showing info */}
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

            {// checks if a showing is selected
            selectedShowing !== undefined && 
            <div className='mx-6 mt-10'>
                <h1 className='poppins-medium text-xl pt-8'>Add Tickets</h1>
                <p className='poppins-light text-sm tracking-tight mb-4'>Available: {remainingTickets} / {movieData.totalTickets}</p>
                {/* ADULT TICKETS */}
                <div className='bg-white flex h-16 items-center w-110 px-2 border-1 mt-[-1px] border-gray-100'>
                    <h1 className='poppins-medium text-sm'>Adult</h1>
                    {isAdmin ? <PencilSimpleIcon onClick={() => setEditAdultTicket(!editAdultTicket)} size={18} className='ml-auto text-blue-400 cursor-pointer hover:text-blue-600'/> : ''}
                    {editAdultTicket ? (
                        <input 
                        ref={adultInputRef}
                        className='w-14 ml-1 mr-4 px-1 bg-gray-100 poppins-regular text-center rounded border-1 border-gray-200 text-sm text-(--text-light-color)'
                        type='text'
                        defaultValue={movieData.ticketAdult}
                        onKeyDown={submitAdultTicketEdit}
                        />
                    ) : (
                        <p className={['w-12 mr-4 poppins-medium text-sm text-(--text-light-color)', isAdmin ? 'ml-3': 'ml-auto'].join(' ')}>${movieData.ticketAdult}</p>
                    )}

                    {editAdultTicket ? (
                        <button onClick={submitAdultTicketEdit} className='cursor-pointer bg-gray-200 py-2 w-34 poppins-medium hover:border-blue-200 transition duration-300 rounded border-1 border-gray-100'>CONFIRM</button>
                    ) : (
                    adultTickets == 0 ? 
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
                    )}
                </div>

                {/* CHILD TICKETS */}
                <div className='bg-white flex h-16 items-center w-110 px-2 border-1 mt-[-1px] border-gray-100'>
                    <h1 className='poppins-medium text-sm'>Child</h1>
                    {isAdmin ? <PencilSimpleIcon onClick={() => setEditChildTicket(!editChildTicket)} size={18} className='ml-auto text-blue-400 cursor-pointer hover:text-blue-600'/> : ''}
                    {editChildTicket ? (
                        <input 
                        ref={childInputRef}
                        className='w-14 ml-1 mr-4 px-1 bg-gray-100 poppins-regular text-center rounded border-1 border-gray-200 text-sm text-(--text-light-color)'
                        type='text'
                        defaultValue={movieData.ticketChild}
                        onKeyDown={submitChildTicketEdit}
                        />
                    ) : (
                        <p className={['w-12 mr-4 poppins-medium text-sm text-(--text-light-color)', isAdmin ? 'ml-3': 'ml-auto'].join(' ')}>${movieData.ticketChild}</p>
                    )}
                    {editChildTicket ? (
                        <button onClick={submitChildTicketEdit} className='cursor-pointer bg-gray-200 py-2 w-34 poppins-medium hover:border-blue-200 transition duration-300 rounded border-1 border-gray-100'>CONFIRM</button>
                    ) : (
                    childTickets == 0 ? 
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
                    )}
                </div>
                {/* STUDENT TICKETS */}
                <div className='bg-white flex h-16 items-center w-110 px-2 border-1 mt-[-1px] border-gray-100'>
                    <h1 className='poppins-medium text-sm'>Student</h1>
                    {isAdmin ? <PencilSimpleIcon onClick={() => setEditStudentTicket(!editStudentTicket)} size={18} className='ml-auto text-blue-400 cursor-pointer hover:text-blue-600'/> : ''}
                    {editStudentTicket ? (
                        <input 
                        ref={studentInputRef}
                        className='w-14 ml-1 mr-4 px-1 bg-gray-100 poppins-regular text-center rounded border-1 border-gray-200 text-sm text-(--text-light-color)'
                        type='text'
                        defaultValue={movieData.ticketStudent}
                        onKeyDown={submitStudentTicketEdit}
                        />
                    ) : (
                        <p className={['w-12 mr-4 poppins-medium text-sm text-(--text-light-color)', isAdmin ? 'ml-3': 'ml-auto'].join(' ')}>${movieData.ticketStudent}</p>
                    )}
                    {editStudentTicket ? (
                        <button onClick={submitStudentTicketEdit} className='cursor-pointer bg-gray-200 py-2 w-34 poppins-medium hover:border-blue-200 transition duration-300 rounded border-1 border-gray-100'>CONFIRM</button>
                    ) : (
                    studentTickets == 0 ? 
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
                    )}
                </div>
                {/* SENIOR TICKETS */}
                <div className='bg-white flex h-16 items-center w-110 px-2 border-1 mt-[-1px] border-gray-100'>
                    <h1 className='poppins-medium text-sm'>Senior</h1>
                    {isAdmin ? <PencilSimpleIcon onClick={() => setEditSeniorTicket(!editSeniorTicket)} size={18} className='ml-auto text-blue-400 cursor-pointer hover:text-blue-600'/> : ''}
                    {editSeniorTicket ? (
                        <input 
                        ref={seniorInputRef}
                        className='w-14 ml-1 mr-4 px-1 bg-gray-100 poppins-regular text-center rounded border-1 border-gray-200 text-sm text-(--text-light-color)'
                        type='text'
                        defaultValue={movieData.ticketSenior}
                        onKeyDown={submitSeniorTicketEdit}
                        />
                    ) : (
                        <p className={['w-12 mr-4 poppins-medium text-sm text-(--text-light-color)', isAdmin ? 'ml-3': 'ml-auto'].join(' ')}>${movieData.ticketSenior}</p>
                    )}
                    {editSeniorTicket ? (
                        <button onClick={submitSeniorTicketEdit} className='cursor-pointer bg-gray-200 py-2 w-34 poppins-medium hover:border-blue-200 transition duration-300 rounded border-1 border-gray-100'>CONFIRM</button>
                    ) : (
                    seniorTickets == 0 ? 
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
                    )}
                </div>
                {/* checkout summary */}
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
    )
}