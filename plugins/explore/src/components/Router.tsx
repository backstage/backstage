import React from 'react';
import { Route, Routes } from 'react-router';
import { ExplorePluginPage } from './ExplorePluginPage';
import { rootRouteRef } from '../plugin';

export const Router = () => (
  <Routes>
    <Route path={`/${rootRouteRef.path}`} element={<ExplorePluginPage />} />
  </Routes>
);
