import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import 'bootstrap-icons/font/bootstrap-icons.css';

import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import { PrivateRoute } from './components/PrivateRoute';
import { PublicRoute } from './components/PublicRoute';
import { AuthProvider } from './contexts/AuthContext';
import CreateOrder from './pages/CreateOrder';
import Login from './pages/Login';
import MyOrders from './pages/MyOrders';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="d-flex flex-column min-vh-100">
          <Header />
          <main className="flex-grow-1">
            <Routes>
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/my-orders"
                element={
                  <PrivateRoute>
                    <MyOrders />
                  </PrivateRoute>
                }
              />
              <Route
                path="/create-order"
                element={
                  <PrivateRoute>
                    <CreateOrder />
                  </PrivateRoute>
                }
              />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <div className="container mt-5">
                      <h1>Главная страница</h1>
                    </div>
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
