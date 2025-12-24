import { Routes, Route } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import Tags from './Pages/Tags';

function App() {
  return (
    <>
      <Toaster position="bottom-right" />
      <Routes>
        <Route path="/" element={<Tags />} />
      </Routes>
    </>
  );
}

export default App;
