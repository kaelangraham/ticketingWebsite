import { BrowserRouter, Routes, Route } from 'react-router'
import { createRoot } from 'react-dom/client'
import { CookiesProvider } from 'react-cookie'
import './index.css'
import Layout from './layout'
import Movies from './movies'
import MovieInfo from './movieInfo'
import ScrollToTop from './components/scrollToTop'
import Success from './success'
import LogIn from './logIn'

createRoot(document.getElementById('root')!).render(
  <CookiesProvider defaultSetOptions={{path: '/'}}>
  <BrowserRouter>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Movies />} />
        <Route path="/movies/:movieId" element={<MovieInfo />} />
        <Route path="/success" element={<Success />} />
      </Route>
      <Route path='/logIn' element={<LogIn />} />
    </Routes>
  </BrowserRouter>
  </CookiesProvider>
)
