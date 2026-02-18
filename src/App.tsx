import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SessionProvider } from "./components/auth/SessionProvider";
import Index from "./pages/Index";
import Explorar from "./pages/Explorar";
import Profile from "./pages/Profile";
import Premium from "./pages/Premium";
import Sobre from "./pages/Sobre";
import Contato from "./pages/Contato";
import FAQ from "./pages/FAQ";
import Perfis from "./pages/Perfis";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import ParaProfissionais from "./pages/ParaProfissionais";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SessionProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/explorar" element={<Explorar />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/perfis" element={<Perfis />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/para-profissionais" element={<ParaProfissionais />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SessionProvider>
  </QueryClientProvider>
);

export default App;