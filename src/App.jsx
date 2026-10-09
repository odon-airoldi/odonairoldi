import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import IndexPage from './pages/IndexPage'
import CurriculumPage from './pages/CurriculumPage'
import CurriculumPagePrint from './pages/CurriculumPagePrint'
import { AppProvider } from './contexts/AppContext'

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<IndexPage />} />
            <Route path="/cv" element={<CurriculumPage />} />
          </Route>
          <Route path="/print" element={<CurriculumPagePrint />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  )
}

export default App
