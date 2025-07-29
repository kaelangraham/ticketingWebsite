import { Outlet } from 'react-router'
import Sidebar from './components/sidebar'

export default function layout() {
    return(
        <>
        <Sidebar />
        <div className='pl-[20%] bg-linear-to-b from-white to-cyan-100'>
            <Outlet />
        </div>
        </>
    )
}