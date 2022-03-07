import React, { useState } from 'react';
import styles from './LoginPage.module.css';
import { useMutation, useQuery } from '@apollo/client';
import { Token } from "./../../Types/Types";
import { login } from "./../../Queries/queries";

const LoginPage = () => {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [token, setToken] = useState<Token>();
   const [setUser] = useMutation(login);
   useMutation(login, {
      variables: {
        email: email,
        password: password,
      },
      onCompleted: (data) => {
        setToken(data.tokenAuth.token)
        console.log(token)
      },
      onError: (error) => {
        console.log(error)
      }
    })
    return(
      <form className='container col-4 mx-auto' onSubmit={(e) => {e.preventDefault();
      console.log("form submitted");
      setUser({variables: {email: email, password: password}})
      console.log(email, password);}}>
      <div className="form-group mt-3">
        <label htmlFor="exampleInputEmail1">Email</label>
        <input type="email" value={email} onChange={(e) => {setEmail(e.target.value)}} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"/>
      </div>
      <div className="form-group mt-3">
        <label htmlFor="exampleInputPassword1">Hasło</label>
        <input type="password" value={password} onChange={(e) => {setPassword(e.target.value)}} className="form-control" id="exampleInputPassword1" placeholder="Password"/>
      </div>
      <div className='row'>
         <button type="submit" className="btn btn-primary mt-3 col-12">Zaloguj</button>
         <button type="submit" className="btn btn-secondary mt-3 col-12">Rejestracja</button>
      </div>
    </form>
    );
};
export default LoginPage;