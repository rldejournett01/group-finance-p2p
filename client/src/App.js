
import './App.css';

//components
import InputNotes from './components/InputNotes';
import ListNotes from './components/ListNotes';
import ListUsers from './components/ListUsers';

function App() {
  return (
    <>
      <div className='container'>
      <ListUsers />
      <InputNotes />
      <ListNotes />
      </div>
      
    </>
  );
}

export default App;
