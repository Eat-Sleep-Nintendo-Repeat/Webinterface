import Header from "./components/header"
import Userpage from "./pages/User"
import Usersettings from "./pages/Home/Usersettings"
import {BrowserRouter as Router, Route, Switch} from "react-router-dom"
import {Link} from "react-router-dom"
import Submenu from "./components/sub-menu"
import Usemyvoice from "./pages/Home/Usemyvoice"

import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'




function App() {
  return (
    <Router>
    <div className="App">
      <Header />
      <ReactNotification />

      <Switch>
      <Route path="/home">
            <Submenu component={
            <div className="content">
              <Route exact path="/home/usersettings"><Usersettings /></Route>
              <Route exact path="/home/usemyvoice"><Usemyvoice /></Route>
            </div>} links={[<Link to="/home/usemyvoice">Use my Voice</Link>, <Link to="/home/usersettings">User Einstellungen</Link>]}/>
      </Route>
      <Route exact path="/shop"><h1>Shop</h1></Route>
      <Route exact path="/turnements"><h1>Turniere</h1></Route>

      <Route exact path="/user/:id"> <Userpage/> </Route>
      </Switch>
    
    </div>
    </Router>
  );
}

export default App;
