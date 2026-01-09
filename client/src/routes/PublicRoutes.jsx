import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import CelebrationPage from '../pages/CelebrationPage'

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:slug" element={<CelebrationPage />} />
    </Routes>
  )
}

export default PublicRoutes



