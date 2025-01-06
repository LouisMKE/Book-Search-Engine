import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';
import Auth from '../utils/auth';

function SignupForm() {
  const [formState, setFormState] = useState({ username: '', email: '', password: '' });
  const [addUser] = useMutation(ADD_USER);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const { data } = await addUser({
        variables: { ...formState },
      });

      Auth.login(data.addUser.token);
    } catch (e) {
      console.error(e);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState({ ...formState, [name]: value });
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        name="username"
        placeholder="Your username"
        value={formState.username}
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Your email"
        value={formState.email}
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Your password"
        value={formState.password}
        onChange={handleChange}
      />
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default SignupForm;
