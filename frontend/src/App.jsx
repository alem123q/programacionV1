import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";


import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CreateEventPage from "./pages/CreateEventPage";
import EventDetailPage from "./pages/EventDetailPage";
import GuestManagementPage from "./pages/GuestManagementPage";
import NotFound from "./pages/NotFound";


const queryClient = new QueryClient();


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />


        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/eventos" element={<DashboardPage />} />
            <Route path="/eventos/nuevo" element={<CreateEventPage />} />
            <Route path="/eventos/:id" element={<EventDetailPage />} />
            <Route path="/invitados" element={<GuestManagementPage />} />
            <Route path="/invitaciones" element={<DashboardPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>


      </TooltipProvider>
    </QueryClientProvider>
  );
}


export default App;