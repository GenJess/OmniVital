import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import CollectiveLayout from "./layouts/CollectiveLayout";
import CollectiveDashboard from "./pages/collective/CollectiveDashboard";
import CollectiveCommunity from "./pages/collective/CollectiveCommunity";
import CollectiveProtocol from "./pages/collective/CollectiveProtocol";

const queryClient = new QueryClient();

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!session) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

/* Scroll to hash fragment after client-side navigation */
function ScrollToHash() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.replace("#", ""));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 80);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/product/:slug" element={<ProductDetail />} />

      {/* The Collective Portal — protected */}
      <Route
        path="/collective"
        element={
          <RequireAuth>
            <CollectiveLayout>
              <CollectiveDashboard />
            </CollectiveLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/collective/community"
        element={
          <RequireAuth>
            <CollectiveLayout>
              <CollectiveCommunity />
            </CollectiveLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/collective/protocol"
        element={
          <RequireAuth>
            <CollectiveLayout>
              <CollectiveProtocol />
            </CollectiveLayout>
          </RequireAuth>
        }
      />

      {/* Legacy redirects */}
      <Route path="/dashboard" element={<Navigate to="/collective" replace />} />
      <Route path="/advisor" element={<Navigate to="/collective" replace />} />
      <Route path="/community" element={<Navigate to="/collective/community" replace />} />
      <Route path="/checkout" element={<Navigate to="/collective/protocol" replace />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ScrollToHash />
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
