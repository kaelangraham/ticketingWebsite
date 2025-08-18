import { useNavigate } from "react-router"
export default function movieSearchDropdown({searchData, searchTerm, dropdownFocused, clearSearch}) {
    let navigate = useNavigate()
    const handleClick = (d) => {
        navigate(`/movies/${d.id}`)
        clearSearch()
    }

    
    // if no data doesnt show
    if(searchTerm.length === 0 || !dropdownFocused ) return(<></>)
    return(
        <div className='bg-white w-[68vw] rounded mt-[-25px] mx-1 relative p-10 z-30'>
            {searchData.map((d,i) => (
                <div className='flex py-3 gap-4'>
                    <img onClick={() => handleClick(d)} src={d.coverImg} className="h-30 rounded cursor-pointer hover-dim transition duration-300" />
                    <div className="">
                        <h1 onClick={() => handleClick(d)} className='hover-underline title cursor-pointer poppins-medium text-xl w-max'>{d.name}</h1>
                        <p className='text-(--text-light-color) poppins-light text-sm tracking-tight mt-5'>{d.description}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}