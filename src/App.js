import { Routes, Route } from "react-router-dom"
import PlexGPT from "./pages/plexgpt";
import SourcingTool from "./pages/sourcing";

function App() {
  return (
    <div className='App'>
      <Routes>
          <Route path='/' element={<PlexGPT />} />
          <Route path='/sourcing-tool' element={<SourcingTool />} />
      </Routes>
    </div>
  );
}

export default App;