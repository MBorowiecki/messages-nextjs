import React, { useState } from 'react';
import styled from 'styled-components';

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

export default () => {
    return(
        <MainContainer>
            <LoginContainer>
                <FacebookButton>
                    Continue with Facebook
                </FacebookButton>
            </LoginContainer>
        </MainContainer>
    )
}