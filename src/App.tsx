import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Block from './pages/Block';
import Transaction from './pages/Transaction';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/block/:height" element={<Block />} />
          <Route path="/tx/:hash" element={<Transaction />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;