import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import IndexPage from './pages/IndexPage'
import CurriculumPage from './pages/CurriculumPage'
import AppIntro from './components/AppIntro'
import { AppProvider } from './contexts/AppContext'

function App() {
  const [showSplash, setShowSplash] = useState(true)

  return (
    <>
      {showSplash && <AppIntro onDone={() => setShowSplash(false)} />}
      <BrowserRouter>
        <AppProvider skipIntroDelay={!showSplash}>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<IndexPage />} />
              <Route path="/cv" element={<CurriculumPage />} />
            </Route>
          </Routes>
        </AppProvider>
      </BrowserRouter>
    </>
  )
}

export default App
