import Header from "./components/header"
import Userpage from "./pages/User"
import Usersettings from "./pages/Usersettings"
import {BrowserRouter as Router, Route, Switch} from "react-router-dom"

import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'


function App() {
  return (
    <Router>
    <div className="App">
      <Header />
      <ReactNotification />

      <Switch>
      <Route exact path="/"><h1>Home</h1></Route>
      <Route exact path="/shop"><h1>Shop</h1></Route>
      <Route exact path="/turnements"><h1>Turniere</h1></Route>

      <Route exact path="/user/:id"> <Userpage/> </Route>
      <Route exact path="/usersettings"> <Usersettings/> </Route>
      </Switch>
    
    </div>
    </Router>
  );
}

export default App;
