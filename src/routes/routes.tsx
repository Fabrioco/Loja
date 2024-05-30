import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home/Home";
import Header from "../components/Header";
import { Register } from "../pages/Register/Register";

export function RoutesApp() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />s
      </Routes>
    </BrowserRouter>
  );
}
