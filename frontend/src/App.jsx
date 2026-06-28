import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import Spinner from './components/ui/Spinner';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const TasksPage = lazy(() => import('./pages/TasksPage'));
const PlannerPage = lazy(() => import('./pages/PlannerPage'));
const ReflectionPage = lazy(() => import('./pages/ReflectionPage'));
const FocusPage = lazy(() => import('./pages/FocusPage'));
const GoalsPage = lazy(() => import('./pages/GoalsPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const DecisionAdvisorPage = lazy(() => import('./pages/DecisionAdvisorPage'));
const KnowledgePage = lazy(() => import('./pages/KnowledgePage'));
const LifeBalancePage = lazy(() => import('./pages/LifeBalancePage'));
const ProductivityDNAPage = lazy(() => import('./pages/ProductivityDNAPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-stone-50">
    <Spinner size="lg" />
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Authenticated app routes (pathless layout) */}
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="planner" element={<PlannerPage />} />
              <Route path="goals" element={<GoalsPage />} />
              <Route path="reflection" element={<ReflectionPage />} />
              <Route path="focus" element={<FocusPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="decision" element={<DecisionAdvisorPage />} />
              <Route path="knowledge" element={<KnowledgePage />} />
              <Route path="life-balance" element={<LifeBalancePage />} />
              <Route path="dna" element={<ProductivityDNAPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
