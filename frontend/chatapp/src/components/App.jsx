import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Signup from './auth/Signup'
import Homepage from './home/Homepage';
import Login from './auth/Login';

function App() {

  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route path='/' element={<Login/>}></Route>
          <Route path='/home' element={<Homepage/>}></Route>
          <Route path='/signup' element={<Signup/>}></Route>
        </Routes>
        </UserProvider>
    </Router>
  )
}

export default App
