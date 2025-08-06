import { BrowserRouter, Routes, Route } from 'react-router'
import { createRoot } from 'react-dom/client'
import './index.css'
import Layout from './layout'
import Movies from './movies'
import MovieInfo from './movieInfo'
import ScrollToTop from './components/scrollToTop'



createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Movies />} />
        <Route path="/movies/:movieId" element={<MovieInfo />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
