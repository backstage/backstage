import React from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { CatalogRouter } from '@backstage/plugin-catalog';
import { EntityPage } from './catalog/EntityPage';

export const AppRoutes = () => (
  <Routes>
    <Route
      path="/catalog/*"
      element={<CatalogRouter EntityPage={EntityPage} />}
    />
    <Route path="/" element={<Navigate to="/catalog" />} />
  </Routes>
);
