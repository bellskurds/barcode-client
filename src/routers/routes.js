import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// importing all the themes
import ExploreOne from "../themes/explore-one";
import ExploreTwo from "../themes/explore-two";
import Create from "../themes/create";
import Login from "../themes/login";
import config from '../config';
const session_key = config.session_key;
class MyRouts extends React.Component {
  AuthRequire(){
    let auth = window.localStorage.getItem(session_key)
    if(auth){
      return true;
    }else{
      return false;
    }
  }
  render() {
    return (
      <div>
        <Router>
            {
              this.AuthRequire()?
              (<Switch>
                 <Route exact path="/" component={ExploreOne} />
                 <Route exact path="/barcode_scan" component={ExploreOne} />
                 <Route exact path="/barcode_list" component={ExploreTwo} />
                 <Route exact path="/data" component={Create} />
                 <Route exact path="/login" component={Login} />
             </Switch>):
             (
             <Switch>
                 <Route exact path="*" component={Login} />
             </Switch>)
            }
         </Router>
      </div>
    );
  }
}
export default MyRouts;