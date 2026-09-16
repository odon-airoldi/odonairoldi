import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import IndexPage from './pages/IndexPage'
import CurriculumPage from './pages/CurriculumPage'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/cv" element={<CurriculumPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
