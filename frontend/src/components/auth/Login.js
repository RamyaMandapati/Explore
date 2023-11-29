import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../actions/auth";
import "./Login.css";
import logo from "../../logo.png";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export const Login = ({ history }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  // const [formData, setFormData] = useState({
  //   email: "",
  //   password: "",
  // });
  // //const successlogin = '';
  // const { email, password } = formData;

  // const onChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };
  // const onSubmit = () => {

  //   dispatch(login({ email, password }));
  // };

  const SigninSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "Too Short!").required("Required"),
  });
  const onSignUp = () => {
    history.push("/register");
  };

  const onLogin = () => {
    history.push("/");
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      history.push("/travelfeed");
    }
  }, [history, isAuthenticated, user]);

  return (
    <div className="login-cont">
      <div className="nav-flex">
        <img className="logo-img" src={logo} alt="Logo" />
        <div className="add-flex ">
          <button className="signup-nav-btn" onClick={() => onSignUp()}>
            Signup
          </button>
          <button
            className="login-nav-btn "
            style={{ marginLeft: "24px", marginRight: "36px" }}
            onClick={() => onLogin()}
          >
            Login
          </button>
        </div>
      </div>
      <div className="container login">
        <div className="space-top">
          <div className="image-section">
            {/*  */}

            <h1>Adventure awaits!</h1>
            {/* <h1 id="h2-header"> awaits! Plan now.</h1> */}
            <div className="overlay"></div>
          </div>
        </div>
        <div className="login-section">
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={SigninSchema}
            onSubmit={(values, { setSubmitting }) => {
              dispatch(login(values));
              setSubmitting(false);
            }}
          >
            {({ isSubmitting, isValid, dirty }) => (
              <Form className="form-group">
                <h1
                  style={{
                    marginBottom: "20px",
                    fontSize: "2em",
                    textAlign: "left",
                  }}
                >
                  Welcome Back!
                </h1>
                <div className="form-group">
                  <label>Email</label>
                  <Field
                    type="email"
                    placeholder="name@gmail.com"
                    name="email"
                    // value={email}
                    // onChange={(e) => onChange(e)}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    style={{ color: "red" }}
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <Field
                    type="password"
                    placeholder="6+ characters"
                    name="password"
                    // value={password}
                    // onChange={(e) => onChange(e)}
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    style={{ color: "red" }}
                  />
                </div>
                <button
                  type="submit"
                  className="login-btn"
                  disabled={isSubmitting || !isValid || !dirty}
                >
                  Sign in
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Login;
