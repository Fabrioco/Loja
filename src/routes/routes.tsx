import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home/Home";
import Header from "../components/Header";
import { Register } from "../pages/Register/Register";
import { Login } from "../pages/Login/Login";
import { Private } from "./private";
import { Mail } from "../pages/Mail/Mail";
import { NotFound } from "../pages/NotFound";
import { Context } from "../context/auth";
import { Product } from "../pages/Product/Product";
import { Admin } from "../pages/Admin/Admin";
import { Settings } from "../pages/Settings/Settings";
import { Cart } from "../pages/Cart/Cart";

export function RoutesApp() {
  return (
    <BrowserRouter>
      <Context>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mail" element={<Mail />} />
          <Route path="/item/:name" element={<Product />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/admin"
            element={
              <Private>
                <Admin />
              </Private>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Context>
    </BrowserRouter>
  );
}
