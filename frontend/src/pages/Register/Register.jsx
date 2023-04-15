import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register, reset } from "../../features/auth/authSlice";

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = formData;

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      name,
      email,
      password,
    };
    dispatch(register(userData));
    navigate("/");
  };

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <main className="reg_page">
      <section className="reg_section">
        <div className="container">
          <div className="wrapper ver reg_wrapper">
            <h2>Register</h2>

            <form onSubmit={handleSubmit} className="reg_form">
              <input
                type="text"
                name="name"
                placeholder="name"
                value={name}
                onChange={handleChange}
              />

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

export default RegisterPage;
