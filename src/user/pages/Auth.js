import React, { useState, useContext } from 'react';

import { Link } from 'react-router-dom';
import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/useForm';
import { AuthContext } from '../../shared/context/auth-context';
import './Auth.css';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const {isLoading, error, sendRequest, clearError} = useHttpClient();

 // eslint-disable-next-line no-undef
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false
      },
      password: {
        value: '',
        isValid: false
      }
    },
    false
   
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false
          }
        },
        false
      );
    }
    setIsLoginMode(prevMode => !prevMode);
  };

  const authSubmitHandler = async event => {
    event.preventDefault();
    if(isLoginMode){

      try{
        const response = await sendRequest( process.env.REACT_APP_BACKEND_URL + '/user/login', 'POST', JSON.stringify({
        email: formState.inputs.email.value,
        password: formState.inputs.password.value
      }),  
      {'Content-Type': 'application/json'
      })
  
        auth.login(response.userId, response.token);
        console.log(response);
      }catch(err){
        console.log(err);
      }
      
    }else{
      try{
    
        const response = await sendRequest (process.env.REACT_APP_BACKEND_URL + '/user/signup', 'POST', JSON.stringify({
        name: formState.inputs.name.value,  
        email: formState.inputs.email.value,
          password: formState.inputs.password.value,
        }),  {'Content-Type': 'application/json'
        })
        auth.logout(response.userId, response.token);
      } catch(err){

      }
      
    }
        
  };


  return (
    <React.Fragment>
    
    <Card className="authentication">
      {isLoading && <LoadingSpinner asOverlay />}
      <h2>Login Required</h2>
      <hr />
      <form onSubmit={authSubmitHandler}>
        {!isLoginMode && (
          <Input
            element="input"
            id="name"
            type="text"
            label="Your Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a name."
            onInput={inputHandler}
          />
        )}
        <Input
          element="input"
          id="email"
          type="email"
          label="E-Mail"
          validators={[VALIDATOR_EMAIL()]}
          errorText="Please enter a valid email address."
          onInput={inputHandler}
        />
        <Input
          element="input"
          id="password"
          type="password"
          label="Password"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid password, at least 5 characters."
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          {isLoginMode ? 'LOGIN' : 'SIGNUP'}
        </Button>
      </form>
      <p>{isLoginMode ? 'Do not have an account?' : 'Have an account?'}</p>
      <Button inverse onClick={switchModeHandler}>
        {isLoginMode ? 'Register' : 'Login'}
      </Button>
        <Link to="/">
          <p>Go Back to Home Page</p>
        </Link>
    </Card>
    </React.Fragment>

  );
};

export default Auth;
