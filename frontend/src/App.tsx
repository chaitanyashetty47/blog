import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Signup } from './pages/Signup'
import { Signin } from './pages/Signin'
import { Blog } from './pages/Blog'
import { Blogs } from './pages/Blogs'
import { Publish } from './pages/Publish'
import { ProtectedRoute } from './components/ProtectedRoutes'
import axios from 'axios';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Signin />} />
          <Route path="/blog/:id" element={<ProtectedRoute><Blog /></ProtectedRoute>} />
          <Route path="/blogs" element={<ProtectedRoute><Blogs /></ProtectedRoute>} />
          <Route path="/publish" element={<ProtectedRoute><Publish /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App