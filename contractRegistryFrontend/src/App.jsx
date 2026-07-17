import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import CustomerListPage from './pages/customers/CustomerListPage.jsx';
import CustomerFormPage from './pages/customers/CustomerFormPage.jsx';
import LotListPage from './pages/lots/LotListPage.jsx';
import LotFormPage from './pages/lots/LotFormPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />

        <Route path="customers" element={<CustomerListPage />} />
        <Route path="customers/new" element={<CustomerFormPage mode="create" />} />
        <Route path="customers/:code/edit" element={<CustomerFormPage mode="edit" />} />

        <Route path="lots" element={<LotListPage />} />
        <Route path="lots/new" element={<LotFormPage mode="create" />} />
        <Route path="lots/:lotName/edit" element={<LotFormPage mode="edit" />} />
      </Route>
    </Routes>
  );
}
