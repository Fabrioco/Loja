import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home/Home";
import Header from "../components/Header";
import { Register } from "../pages/Register/Register";
import { Login } from "../pages/Login/Login";
import { Private } from "./private";
import { Mail } from "../pages/Mail/Mail";
import { NotFound } from "../pages/NotFound";
import { Context } from "../context/auth";

export function RoutesApp() {
  return (
    <BrowserRouter>
      <Context>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/Login" element={<Login />} />

          <Route
            path="/mail"
            element={
              <Private>
                <Mail />
              </Private>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Context>
    </BrowserRouter>
  );
}
