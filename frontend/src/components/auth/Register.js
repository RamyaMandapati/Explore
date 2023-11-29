import React, { useEffect } from "react";
import "./Login.css";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../logo.png";
import { register } from "../../actions/auth";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export const Register = ({ history }) => {
  const dispatch = useDispatch();
  // const alert = useAlert();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // const [formData, setFormData] = useState({
  //   userName: "",
  //   email: "",
  //   password: "",
  //   dateOfBirth: "",
  //   gender: "",
  // });
  // const { userName, email, password, dateOfBirth, gender } = formData;
  const SignupSchema = Yup.object().shape({
    userName: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "Too Short!").required("Required"),
    dateOfBirth: Yup.date().required("Required"),
    gender: Yup.string().required("Required"),
  });

  // const onChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };
  // const onSubmit = () => {
  //   // e.preventDefault();
  //   dispatch(register({ userName, email, password, dateOfBirth, gender }));
  // };

  useEffect(() => {
    if (isAuthenticated && user) {
      history.push("/preference");
    }
  }, [history, isAuthenticated, user]);

  const onSignUp = () => {
    history.push("/register");
  };

  const onLogin = () => {
    history.push("/");
  };

  return (
    <div className="login-cont">
      <div className="nav-flex">
        <img className="logo-img" src={logo} alt="Logo" />
        <div className="add-flex ">
          <button className="login-nav-btn" onClick={() => onSignUp()}>
            Signup
          </button>
          <button
            className="signup-nav-btn"
            style={{ marginLeft: "24px", marginRight: "36px" }}
            onClick={() => onLogin()}
          >
            Login
          </button>
        </div>
      </div>
      <div className="container login" style={{ alignItems: "flex-start" }}>
        <div className="space-top">
          <div className="image-section">
            <h1>Adventure awaits!</h1>
            {/* <h1 id="h2-header"> awaits! Plan now.</h1> */}
            <div className="overlay"></div>
          </div>
        </div>
        <div className="login-section sign-up-section">
          <Formik
            initialValues={{
              userName: "",
              email: "",
              password: "",
              dateOfBirth: "",
              gender: "",
            }}
            validationSchema={SignupSchema}
            onSubmit={(values, { setSubmitting }) => {
              dispatch(register(values));
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
                  Get Started For Free!
                </h1>
                <div className="form-group">
                  <label>Name</label>
                  <Field
                    type="text"
                    placeholder="Enter your name"
                    name="userName"
                    className="formik-field"
                    // value={userName}
                    // onChange={(e) => onChange(e)}
                  />
                  <ErrorMessage
                    name="userName"
                    component="div"
                    style={{ color: "red" }}
                  />
                </div>
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
                    name="password"
                    placeholder="6+ characters"
                    // value={password}
                    // onChange={(e) => onChange(e)}
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    style={{ color: "red" }}
                  />
                </div>
                <div className="form-group">
                  <label>Date of Birth</label>
                  <Field
                    type="date"
                    name="dateOfBirth"
                    placeholder="mm/dd/yy"
                    // value={dateOfBirth}
                    // onChange={(e) => onChange(e)}
                  />
                  <ErrorMessage
                    name="dateOfBirth"
                    component="div"
                    style={{ color: "red" }}
                  />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <Field
                    as="select"
                    className="select-but"
                    name="gender"
                    // value={gender}
                    // onChange={(e) => onChange(e)}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-Binary">Non-Binary</option>
                  </Field>
                  <ErrorMessage
                    name="gender"
                    component="div"
                    style={{ color: "red" }}
                  />
                </div>

                <button
                  type="submit"
                  className="login-btn"
                  disabled={isSubmitting || !isValid || !dirty}
                >
                  Sign up
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};
export default Register;
