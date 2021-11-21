import Header from "./components/header"
import Userpage from "./pages/User"
import Usersettings from "./pages/Home/Usersettings"
import Members from "./pages/Home/Members"
import TWartung from "./pages/Turnements/Wartung"
import {BrowserRouter as Router, Route, Switch} from "react-router-dom"
import {Link} from "react-router-dom"
import Submenu from "./components/sub-menu"
import Usemyvoice from "./pages/Home/Usemyvoice"
import { Redirect } from "react-router"

import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import './files/css/Placeholders.css'




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
              <Route exact path="/home/members"><Members /></Route>
              <Route exact path="/home/usersettings"><Usersettings /></Route>
              <Route exact path="/home/usemyvoice"><Usemyvoice /></Route>
            </div>} links={[<Link to="/home/members">Members</Link>, <Link to="/home/ranklist">Rangliste</Link>, <Link to="/home/usemyvoice">Use my Voice</Link>, <Link to="/home/usersettings">User Einstellungen</Link>]}/>
      </Route>
      <Route exact path="/shop">
          <Submenu component={
            <div className="content">

            </div>} links={[<Link to="/shop">Shop</Link>, <Link to="/shop/bought">Meine Käufe</Link>]}/>
</Route>
      <Route exact path="/turnements"><TWartung /></Route>

      <Route exact path="/user/:id"> <Userpage/> </Route>
      <Route exact path="/"> <Redirect exact from="/" to="home/members" /></Route>
      </Switch>
    
    </div>
    </Router>
  );
}

export default App;
