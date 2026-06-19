import './App.css'//loads the shared styles for the whole app
import Education from "./Education";
import GeneralInfo from "./GeneralInfo";
import Experience from "./Experience";

function App() {
//defines the root components, the shell that holds all sections
  return (
    <div className='app'>
      <h1>CV Applictaion</h1>
      <GeneralInfo/>
      <Education />
      <Experience />
    </div>
  );
}

export default App//makes app available to import in other files(used in main.jsx)
