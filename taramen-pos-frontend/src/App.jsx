import { useMemo } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/custom/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MenuCategories from "./pages/MenuCategories";
import MenuItems from "./pages/MenuItems";
import Staff from "./pages/Staff";
import TakeOrder from "./pages/TakeOrder";
import {
   DASHBOARD,
   LOGIN,
   MENU_CATEGORIES,
   MENU_ITEMS,
   NOT_FOUND,
   STAFF,
   TAKE_ORDER,
} from "./shared/constants/routes";
import NotFound from "./pages/NotFound";

export default function App() {
   const protectedRoutes = useMemo(() => [
      { path: DASHBOARD.path, element: <Dashboard /> },
      { path: TAKE_ORDER.path, element: <TakeOrder /> },
      { path: MENU_CATEGORIES.path, element: <MenuCategories /> },
      { path: MENU_ITEMS.path, element: <MenuItems /> },
      { path: STAFF.path, element: <Staff /> },
   ], []);

   return (
      <Routes>
         <Route path="/" element={<Navigate to={LOGIN.path} replace />} />
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
