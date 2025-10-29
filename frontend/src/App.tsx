import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './Route/AppRoutes'

function App() {
  return (
    <div>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </div>
  )
}

export default App
