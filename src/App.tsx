// External deps
import React, {FC} from 'react';
import { BrowserRouter } from 'react-router-dom';

// Internal deps
import MainRoutes from "@/routes/MainRoutes";

const App: FC = () => {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}>
      <MainRoutes />
    </BrowserRouter>
  );
};

export default App;
