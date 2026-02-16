import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './hooks/useAppContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PracticeAreaPage from './pages/PracticeAreaPage';
import ChatPage from './pages/ChatPage';
import HistoryPage from './pages/HistoryPage';

export default function App() {
  return (
    <AppProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/practice/:areaId" element={<PracticeAreaPage />} />
          <Route path="/chat/:skillId" element={<ChatPage />} />
          <Route path="/chat/:skillId/:conversationId" element={<ChatPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </Layout>
    </AppProvider>
  );
}
