import './App.css';
import {Route, Routes} from "react-router";
import NavigationComponent from "./routes/navigation/navigation.component";
import HomeComponent from "./routes/home/home.component";
import { hot } from 'react-hot-loader'
import SignIn from "./routes/authentication/sign-in.component";
import SignUp from "./routes/authentication/sign-up.component";
import UserList from "./routes/users/users.component";
import UserProfileComponent from "./components/user-profile/user-profile.component";
import PrivateRoute from "./routes/private-route/private-route";
import UserEditComponent from "./components/user-edit/user-edit.component";
import MenuComponent from "./routes/navigation/menu";

function App() {
  return (
    <Routes>
      <Route path='/' element={<MenuComponent />}>
          <Route index element={<HomeComponent/>} />
          <Route exact path='/users' element={<UserList/>}/>
          <Route path='/users/:userId' element={<UserProfileComponent/>}/>
          <Route path='/signin' element={<SignIn/>}/>
          <Route
              path="/user/edit/:userId"
              element={
                  <PrivateRoute>
                      <UserEditComponent></UserEditComponent>
                  </PrivateRoute>
              }
          />
          <Route path='/signup' element={<SignUp/>}/>
      </Route>
    </Routes>
  );
}

export default hot(module)(App);
