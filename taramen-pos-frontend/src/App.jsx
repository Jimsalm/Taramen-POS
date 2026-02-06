import { useMemo } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/custom/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { DASHBOARD, LOGIN, NOT_FOUND } from "./shared/constants/routes";
import NotFound from "./pages/NotFound";

export default function App() {
   const protectedRoutes = useMemo(() => [
      { path: DASHBOARD.path, element: <Dashboard /> },
   ], []);

   return (
      <Routes>
         <Route path="/" element={<Navigate to={DASHBOARD.path} replace />} />
         <Route path={LOGIN.path} element={<Login />} />
         <Route path={NOT_FOUND.path} element={<NotFound />} />

         {protectedRoutes.map(({ path, element }) => (
            <Route 
               key={path} 
               path={path} 
               element={<ProtectedRoute element={element} />} 
            />
         ))}
         
         <Route path="*" element={<Navigate to={NOT_FOUND.path} replace />} />
      </Routes>
   );
}