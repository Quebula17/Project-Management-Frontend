import './App.css';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';

import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import PrivateRoutes from './utils/PrivateRoutes';
import Authenticating from './components/Authenticating';
import UserProfile from './pages/UserProfile';
import AddProjectForm from './pages/AddProjectForm';
import UserDashboard from './pages/UserDashboard';
import ProjectPage from './pages/ProjectPage';
import AddList from './pages/AddList';
import AddCard from './pages/AddCard';
import Members from './pages/Members';
import UpdateCard from './pages/UpdateCard';
import UpdateProject from './pages/UpdateProject';
import UpdateList from './pages/UpdateList';

function App() {
  
  const location = useLocation();
  const normalizedPathname = location.pathname.replace(/\/$/, '');
  const showNavbar = normalizedPathname !== '/login';

  return (
    <main className="App">
      <AuthProvider>
      {showNavbar && <Navbar />}
      <Routes>
            <Route path="/authenticating" element={ <Authenticating /> } />
            <Route path="/login" element={ <SignInPage /> } />
            <Route element = { <PrivateRoutes /> }>
              <Route path="/" element={ <HomePage /> } />
              <Route path="/profile" element={ <UserProfile/> } />
              <Route path="/add/project" element={ <AddProjectForm/> } />
              <Route path="/dashboard" element={ <UserDashboard/> } />
              <Route path="/project/:projectId" element={ <ProjectPage /> } />
              <Route path="/add/list/:projectId" element={ <AddList/> } />
              <Route path="/add/card/:projectId" element={ <AddCard/> } />
              <Route path="/members" element={ <Members/> } />
              <Route path="/project/:projectId/card/:cardId" element={ <UpdateCard/> } />
              <Route path="/project/:projectId/update" element={ <UpdateProject/> } />
              <Route path="/project/:projectId/list/:listId" element={ <UpdateList/> } />
            </Route>
      </Routes>
      </AuthProvider>
    </main>
  );
}
export default App;
