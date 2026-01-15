import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/custom/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { DASHBOARD, LOGIN, NOT_FOUND } from "./shared/constants/routes";
import NotFound from "./pages/NotFound";

export default function App() {
   const protectedRoutes = [
      { path: DASHBOARD.path, element: <Dashboard /> },
   ];

   return (
      <Routes>
         {/* public route */}
         <Route path={LOGIN.path} element={<Login />} />

         <Route path={NOT_FOUND.path} element={<NotFound />} />

         {/* protected routes */}
         {protectedRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={<ProtectedRoute element={element} />} />
         ))}
      </Routes>
   );
}
