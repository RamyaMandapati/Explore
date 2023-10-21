import React from "react";
import "./Login.css";

import logo from "../../logo.png";

export const Register = ({ history }) => {
  // const dispatch = useDispatch();
  // const alert = useAlert();
  // const [formData, setFormData] = useState({
  //   uname: "",
  //   email: "",
  //   mobile: "",
  //   password: "",
  //   confpassword: "",
  //   role: "",
  // });
  // const { uname, email, mobile, role, password, confpassword } = formData;

  // const onChange = (e) =>
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // const onSubmit = () => {
  //   // e.preventDefault();
  //   if (password !== confpassword) {
  //     alert.error("Passwords not matched!");
  //   } else {
  //     dispatch(register({ uname, email, mobile, role, password })).then(
  //       history.push("/")
  //     );
  //   }
  // };
  // const onSubmit1 = () => {
  //   history.push("/");
  // };
  return (
    <div className="login-cont">
      <div className="nav-flex">
        <img className="logo-img" src={logo} alt="Logo" />
        <div className="add-flex ">
          <button className="login-nav-btn">Signup</button>
          <button
            className="signup-nav-btn"
            style={{ marginLeft: "24px", marginRight: "36px" }}
          >
            Login
          </button>
        </div>
      </div>
      <div className="container" style={{ alignItems: "flex-start" }}>
        <div className="space-top">
          <div className="image-section">
            {/*  */}

            <h1>Adventure awaits!</h1>
            {/* <h1 id="h2-header"> awaits! Plan now.</h1> */}
            <div className="overlay"></div>
          </div>
        </div>
        <div className="login-section sign-up-section">
          <h1 style={{ marginBottom: "20px", fontSize: "2em" }}>
            Get Started For Free!
          </h1>
          <div className="form-group">
            <label>Name</label>
            <input type="text" placeholder="Enter your name" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="name@gmail.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="6+ characters" />
          </div>
          <div className="form-group">
            <label>Date of Birth</label>
            <input type="text" placeholder="mm/dd/yy" />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <select className="select-but">
              <option>Select Gender</option>

              <option key="male">Male</option>
              <option key="female">Female</option>
            </select>
          </div>

          <button className="login-btn">Sign up</button>
        </div>
      </div>
    </div>
  );
};
export default Register;
