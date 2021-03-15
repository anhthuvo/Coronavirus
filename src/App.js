import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.scss';
import Home from './Components/Home/Home';

function App() {
  return (
    <BrowserRouter>
      <Switch>
      <Route exact path='/' component={Home}/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
