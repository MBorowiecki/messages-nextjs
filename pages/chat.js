import React, {useState, useEffect} from 'react';
import Link from 'next/link'
import styled from 'styled-components';
import SendIcon from '@material-ui/icons/Send';
import BackIcon from '@material-ui/icons/ArrowBack';
import cookie from 'js-cookie';
import { useRouter } from 'next/router';
import axios from 'axios';

const io = require('socket.io-client');

const socket = io("http://localhost:3000");

const MainContainer = styled.div`
  background-color: #363636;
  width: 100vw;
  margin: 0px;
  padding: 0px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: 'Lato';
`

const MessagesList = styled.ul`
  padding: 0px;
  flex: 1;
  overflow-y: scroll;
  align-items: flex-start;
  display: flex;
  flex-direction: column;
`

const Message = styled.li`
  color: #ffffff;
  font-size: 18px;
  padding: 16px;
  margin: 16px;
  background-color: #6e3a2f;
  border-radius: 10px;
  list-style-type: none;
  box-shadow: 0px 4px 10px #00000033;
  margin-top: 0px;
  max-width: 40%;
`

const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
`

const MessageInput = styled.input`
  flex-grow: 1;
  color: #000000;
  background-color: #ffffff;
  padding: 16px;
  font-size: 18px;
  margin: 16px;
  border-radius: 10px;
  border: none;
  box-shadow: 0px 4px 8px #00000055;
  transition-duration: 100ms;

  :focus{
    box-shadow: 0px 4px 20px #00000077;
  }
`

const MessageSend = styled(SendIcon)`
  padding: 16px;
  background-color: #ffffff;
  margin: 16px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px #00000055;
  color: #62a5df;
  transition-duration: 200ms;

  :hover{
    cursor: pointer;
    color: #394785;
    box-shadow: 0px 4px 20px #00000077;
  }
`

const TopBar = styled.div`
  display: flex;
  align-items: flex-start;
`

const GoBackContainer = styled.div`
  margin: 8px;
  padding: 12px;
  font-size: 18px;
  color: #ffffff;
  margin-bottom: 0px;
  border-radius: 10px;
  justify-content: center;
  display: flex;

  :hover{
    cursor: pointer;
    background-color: #24242444;
  }
`

const GoBackIcon = styled(BackIcon)`
  margin-right: 12px;
`

export default () => {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [userProfile, setUserProfile] = useState({});

  socket.on('msgReceived', data => {
    setMessages(msgs => data.msgs)
  })

  useEffect(() => {
    let _prof = JSON.parse(cookie.get('userProfile'));
    setUserProfile(_prof);

    const IsUserPermittedToJoin = async () => {
      let users = await axios.post('http://localhost:3000/api/lobby/get-users', {lobbyId: router.query.chatId});

      if(users.data){
        if(!users.data.includes(_prof.id)){
          router.push('/home');
        }
      }
    }

    IsUserPermittedToJoin();

    const GetPastMessages = async () => {
      let res = await axios.post('http://localhost:3000/api/lobby/get-messages', {lobbyId: router.query.chatId});

      console.log(res.data);
      setMessages(_msgs => res.data);
    }

    GetPastMessages();
  }, [])

  const sendMessage = () => {
    if(inputVal.length > 0){
      socket.emit('msgSend', {text: inputVal, room: router.query.chatId, sender: userProfile.id});
      setInputVal("");
    }
  }

  return(
    <MainContainer>
      <TopBar>
        <Link href="/home">
          <GoBackContainer>
            <GoBackIcon />
            Go back
          </GoBackContainer>
        </Link>
      </TopBar>
      <MessagesList>
        {messages.map((msg, index) => {
          if(msg.room === router.query.chatId){
            return(
              <Message key={index}>{msg.text}</Message>
            )
          }
        })}
      </MessagesList>
      <InputContainer>
      <MessageInput 
        placeholder="Type message..." 
        type="text"
        value={inputVal}
        onChange={e => {
          setInputVal(e.target.value)
        }}
      />
      <MessageSend onClick={() => sendMessage()}/>
      </InputContainer>
    </MainContainer>
  )
}