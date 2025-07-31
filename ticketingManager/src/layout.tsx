import { Outlet } from 'react-router'
import Sidebar from './components/sidebar'
import Navbar from './components/navbar'

export default function layout() {
    return(
        <>
        <Sidebar />
        <div className='pl-[20%] bg-linear-to-b from-white to-cyan-50 to-[100vh]'>
            <Navbar />
            <Outlet />
        </div>
        </>
    )
}