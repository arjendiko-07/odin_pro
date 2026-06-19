import { StrictMode } from 'react'
//imports strictmode from react, a wrapper that activates extra warnings and checks during development(no effect in production)
import { createRoot } from 'react-dom/client'//is the way to mount the app into the html page
import './index.css'//global css sstyles(the file isnt uploaded but vite handels this)
import App from './App.jsx'


createRoot(document.getElementById('root')).render(//finds the <div id="root"> in index.html and tells React to render inside it.
  <StrictMode>
    <App />
  </StrictMode>,
)//the root of the cv application
