import { useState } from 'react'
import './App.css' 
import Tutorial from './components/Tutorial/tutorial.jsx'
import PathfindingVisualizer from './PathfindingVisualizer/PathfindingVisualizer.jsx'
function App() {

  const [showTutorial, setShowTutorial] = useState(true);

  const handleTutorialComplete = () => {
    setShowTutorial(false);
  };

  return (
    <div className="App">
      {showTutorial && <Tutorial onComplete={handleTutorialComplete} />}
      <PathfindingVisualizer />
    </div>
  );
};


export default App
