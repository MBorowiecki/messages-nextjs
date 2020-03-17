import React, { useState } from 'react';
import styled from 'styled-components';
import Cookie from 'js-cookie';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import Router from 'next/router';

const MainContainer = styled.div`
    background-color: #363636;
    width: 100vw;
    margin: 0px;
    padding: 0px;
    display: flex;
    flex-direction: column;
    height: 100vh;
    justify-content: center;
    align-items: center;
    font-family: 'Segoe UI';
`

const LoginContainer = styled.div`
    background-color: #262626;
    border-radius: 10px;
    box-shadow: 0px 4px 10px #262626;
    padding: 16px;
`

const FacebookButton = styled.div`
    padding: 16px;
    font-size: 18px;
    background-color: #1f5c91;
    border-radius: 10px;
    margin: 16px;
    color: #ffffff;

    :hover{
        cursor: pointer;
    }
`

const responseFacebook = (res) => {
    console.log(res); // To delete.

    Cookie.set('userProfile', JSON.stringify(res));

    Router.push('/home');
}

export default () => {
    return(
        <MainContainer>
            <LoginContainer>
                <FacebookLogin 
                    appId="206550377089017"
                    autoLoad
                    callback={responseFacebook}
                    fields="name,email,picture"
                    render={renderProps => (
                        <FacebookButton>
                            Continue with Facebook
                        </FacebookButton>
                    )}
                />
            </LoginContainer>
        </MainContainer>
    )
}