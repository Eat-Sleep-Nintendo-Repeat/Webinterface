import Header from "./components/header"
import {BrowserRouter as Router, Route, Switch} from "react-router-dom"

function App() {
  return (
    <Router>
    <div className="App">
      <Header />

      <Switch>
      <Route exact path="/"><h1>Home</h1></Route>
      <Route exact path="/shop"><h1>Shop</h1></Route>
      <Route exact path="/turnements"><h1>Turniere</h1></Route>
      <Route exact path="/user/:id"><h1>Userpage</h1></Route>
      </Switch>
    
    </div>
    </Router>
  );
}

export default App;
