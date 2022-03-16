import React, { useState } from 'react';
import styles from './LoginPage.module.css';
import { useMutation, useQuery } from '@apollo/client';
import { Token } from "./../../Types/Types";
import { login } from "./../../Queries/queries";

const LoginPage = () => {
   const [email, setEmail] = useState("");
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const [token, setToken] = useState<Token>();
   const [isLoggingInto, setIsLoggingInto] = useState(true);
   const [setUser] =
   useMutation(login, {
      variables: {
        email: email,
        password: password,
      },
      onCompleted: (data) => {
        //console.log(data)
        localStorage.setItem("token", data.tokenAuth.token)
        //setToken(data.tokenAuth.token)
        //console.log(token)
      },
      onError: (error) => {
        console.log(error)
      }
    })
    return(
      <form className='container col-3 mx-auto mt-5' onSubmit={(e) => {e.preventDefault();
      console.log("form submitted");
      setUser({variables: {email: email, password: password}})
      console.log(email, password);}}>
       <h2 className="text-center p-2">
          {isLoggingInto ? "Logowanie": "Rejestracja"}
        </h2>
        {isLoggingInto ?
        <>
        <div className="form-group mt-3">
        <label htmlFor="exampleInputEmail1">Email</label>
        <input type="email" value={email} onChange={(e) => {setEmail(e.target.value)}} className="form-control"  placeholder="Wprowadź email"/>
      </div>
      <div className="form-group mt-3">
        <label htmlFor="exampleInputPassword1">Hasło</label>
        <input type="password" value={password} onChange={(e) => {setPassword(e.target.value)}} className="form-control" placeholder="Wprowadź hasło"/>
      </div>
      <div className='form-group mt-3'>
         <button type="submit" className="btn btn-primary mt-3 col-12">Zaloguj</button>
         <button type="submit" className="btn btn-secondary mt-3 col-12" onClick={() => {setIsLoggingInto(false)}}>Rejestracja</button>
      </div>
      </>
      :
      <>
      <div className="form-group mt-3">
        <label htmlFor="exampleInputEmail1">Email:</label>
        <input type="email" value={email} onChange={(e) => {setEmail(e.target.value)}} className="form-control"  placeholder="Wprowadź email"/>
      </div>
      <div className="form-group mt-3">
        <label htmlFor="exampleInputEmail1">Nazwa użytkownika:</label>
        <input type="email" value={username} onChange={(e) => {setUsername(e.target.value)}} className="form-control"  placeholder="Wprowadź nazwe użytkownika "/>
      </div>
      <div className="form-group mt-3">
        <label htmlFor="exampleInputPassword1">Hasło:</label>
        <input type="password" value={password} onChange={(e) => {setPassword(e.target.value)}} className="form-control"  placeholder="Wprowadź hasło użytkownika"/>
      </div>
      <div className='form-group mt-3'>
         <button type="submit" className="btn btn-primary mt-3 col-12">Zarejestruj</button>
         <button type="submit" className="btn btn-secondary mt-3 col-12" onClick={() => {setIsLoggingInto(true)}}>Powrót do logowania</button>
      </div>
      </>
      }
    </form>
    );
};
export default LoginPage;