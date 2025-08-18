import { Outlet } from 'react-router'
import Sidebar from './components/sidebar'
import Navbar from './components/navbar'
import Footer from './components/footer'

export default function layout() {
    return(
        <>
        <Sidebar />
        <div className='bg-linear-to-b from-white to-cyan-50 to-[100vh]'>
            <div className='pl-[20%]'>
                <Navbar />
                {/* main content */}
                <Outlet />
            </div>
            <Footer /> 
        </div>
        </>
    )
}