//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import "./styles/global.css"
import "./styles/comment.css"
import "./styles//layout.css"
import "./styles//scrollbar.css"
import "./styles//navbar.css"
import "./styles//btn.css"
import "./styles//dropdown.css"
import "./styles//dialog.css"
import "./styles//form.css"
import "./styles//fld.css"
import "./styles//tooltip.css"
import "./styles//util.css"
import "./styles//card.css"
import "./styles//icons.css"

import App from './App.tsx'

//createRoot(document.getElementById('root')!).render(
createRoot(document.body).render(
  //<StrictMode>
    <App />
  //</StrictMode>,
)
