import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, reset } from "../../features/auth/authSlice";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    if (isSuccess || user) {
      navigate("/");
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = { email, password };
    console.log(userData);
    dispatch(login(userData));
    navigate("/");
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <main className="reg_page">
      <section className="reg_section">
        <div className="container">
          <div className="reg_wrapper wrapper ver">
            <h2>Login</h2>

            <form onSubmit={handleSubmit} className="reg_form">
              <input
                type="email"
                name="email"
                placeholder="email"
                value={email}
                onChange={handleChange}
              />

              <input
                type="password"
                name="password"
                placeholder="password"
                value={password}
                onChange={handleChange}
              />

              <button type="submit" className="btn-pink-solid">
                Submit
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
