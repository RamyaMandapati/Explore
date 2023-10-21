import React from "react";

import "./Login.css";
import logo from "../../logo.png";

export const Login = ({ history }) => {
  // const dispatch= useDispatch();
  // const {isAuthenticated,user} = useSelector((state)=> state.auth);
  // console.log(isAuthenticated)
  // const [formData, setFormData] = useState({
  //     email: '',
  //     password: ''
  // });
  // //const successlogin = '';
  // const {email,password} = formData;

  // const onChange = e => setFormData({ ...formData, [e.target.name] : e.target.value});
  // const onSubmit = () => {
  //     //e.preventDefault();
  //     //console.log("HI");
  //     //return <Redirect to="/register" />;
  //     dispatch(login({email,password}));

  // };

  // useEffect(() => {
  //     if (isAuthenticated && user && user.role === 'farmer') {
  //         history.push("/Dronebooking");
  //     }
  //     if (isAuthenticated && user && user.role === 'pilot') {
  //         history.push("/Pilotprofile");
  //     }
  //     if (isAuthenticated && user && user.role === 'admin') {
  //         history.push("/Dronecatalog");
  //     }
  // }, [history,isAuthenticated,user]);

  return (
    <div className="login-cont">
      <div className="nav-flex">
        <img className="logo-img" src={logo} alt="Logo" />
        <div className="add-flex ">
          <button className="signup-nav-btn">Signup</button>
          <button
            className="login-nav-btn "
            style={{ marginLeft: "24px", marginRight: "36px" }}
          >
            Login
          </button>
        </div>
      </div>
      <div className="container">
        <div className="space-top">
          <div className="image-section">
            {/*  */}

            <h1>Adventure awaits!</h1>
            {/* <h1 id="h2-header"> awaits! Plan now.</h1> */}
            <div className="overlay"></div>
          </div>
        </div>
        <div className="login-section">
          <h1 style={{ marginBottom: "20px", fontSize: "2em" }}>
            Welcome Back!
          </h1>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="name@gmail.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="6+ characters" />
          </div>
          <button className="login-btn">Login</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
