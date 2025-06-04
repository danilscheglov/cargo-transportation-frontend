import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import 'bootstrap-icons/font/bootstrap-icons.css';

import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute.tsx';
import RoleBasedRedirect from './components/RoleBasedRedirect.tsx';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/auth/Login.tsx';
import Register from './pages/auth/Register.tsx';
import Unauthorized from './pages/auth/Unauthorized.tsx';
import CreateOrder from './pages/client/CreateOrder.tsx';
import MyOrders from './pages/client/MyOrders.tsx';
import ReferencesPage from './pages/dispatcher/ReferencesPage.tsx';
import ReportsPage from './pages/dispatcher/ReportsPage.tsx';
import RequestsPage from './pages/dispatcher/RequestsPage.tsx';
import AssignedTrips from './pages/driver/AssignedTrips.tsx';
import AddVehicle from './pages/mechanic/AddVehicle.tsx';
import CreateMaintenanceRequest from './pages/mechanic/CreateMaintenanceRequest.tsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="d-flex flex-column min-vh-100">
          <Header />

          <main className="flex-grow-1">
            <Routes>
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route element={<PrivateRoute />}>
                <Route path="/" element={<RoleBasedRedirect />} />
              </Route>

              <Route element={<PrivateRoute allowedRoles={['CLIENT']} />}>
                <Route path="/my-orders" element={<MyOrders />} />r
                <Route path="/create-order" element={<CreateOrder />} />
              </Route>

              <Route element={<PrivateRoute allowedRoles={['MECHANIC']} />}>
                <Route path="/create-maintenance-request" element={<CreateMaintenanceRequest />} />
                <Route path="/add-vehicle" element={<AddVehicle />} />
              </Route>

              <Route element={<PrivateRoute allowedRoles={['DRIVER']} />}>
                <Route path="/assigned-orders" element={<AssignedTrips />} />
              </Route>

              <Route element={<PrivateRoute allowedRoles={['DISPATCHER']} />}>
                <Route path="/requests" element={<RequestsPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/references" element={<ReferencesPage />} />
              </Route>
            </Routes>
          </main>

          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
