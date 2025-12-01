import { StrictMode } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import RecommendPage from './pages/Recommend.jsx'
import KnowledgeBasePage from './pages/KnowledgeBasePage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />}/>
      <Route path='/recommend' element={<RecommendPage />}/>
      <Route path='/knowledge-base' element={<KnowledgeBasePage />}/>
    </Routes>

    </BrowserRouter>
  </StrictMode>,
)
