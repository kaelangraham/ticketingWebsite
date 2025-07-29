import { BrowserRouter, Routes, Route } from 'react-router'
import { createRoot } from 'react-dom/client'
import './index.css'
import Layout from './layout'
import Movies from './movies'
import Sessions from './sessions'
import Cinemas from './cinemas'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Movies />} />
        <Route path="sessions" element={<Sessions />} />
        <Route path="cinemas" element={<Cinemas />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
