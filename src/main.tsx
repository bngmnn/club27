import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './InviteePage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
