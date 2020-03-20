import { useEffect, useState } from 'react'
import styled from 'styled-components';
import cookie from 'js-cookie';
import axios from 'axios';
import Link from 'next/link';
import { Dialog } from '@material-ui/core'
import { Add } from '@material-ui/icons';

const MainContainer = styled.div`
    background-color: #363636;
    width: 100vw;
    margin: 0px;
    padding: 0px;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    justify-content: center;
    align-items: center;
    font-family: 'Lato';
`

const CreateLobbyContainer = styled.div`
    color: #ffffff;
    border-radius: 10px;
    background-color: #24242400;
    transition-duration: 100ms;
    padding: 16px;
    margin-top: 16px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    :hover{
        cursor: pointer;
        background-color: #24242444;
    }
`

const CreateLobbyButton = styled.input`
    font-size: 18px;
    border: none;
    background-color: transparent;
    margin-left: 16px;
    color: #ffffff;

    :hover{
        cursor: pointer;
    }

    :focus{
        outline: none;
    }
`

const AddIcon = styled(Add)`
    color: #ffffff;
`

const LobbiesList = styled.section`
    flex: 1;
    display: flex;
    flex-direction: column;
    border-top: 1px solid #444444;
    margin-top: 8px;
`

const Lobby = styled.input`
    color: #ffffff;
    font-size: 22px;
    border: none;
    border-radius: 10px;
    background-color: #24242400;
    transition-duration: 100ms;
    padding: 16px;
    margin: 8px;

    :hover{
        cursor: pointer;
        background-color: #24242444;
    }
`

const CreateLobbyDialog = styled.div`
    position: fixed;
    background-color: #242424;
    border: none;
    border-radius: 10px;
    box-shadow: 0px 4px 10px #24242477;
    display: ${props => props.open ? 'flex' : 'none'};
    flex-direction: column;
    padding: 16px;
`

const CreateLobbyName = styled.input`
    background-color: #181818;
    font-size: 16px;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    padding: 8px;
`

const CreateLobbySubmit = styled.input`
    background-color: #242582;
    padding: 8px;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    margin-top: 16px;
    font-size: 16px;
    transition-duration: 200ms;

    :hover{
        cursor: pointer;
        background-color: #181976;
        box-shadow: 0px 4px 10px #20202077;
    }
`

const CreateLobbyCancel = styled.input`
    background-color: transparent;
    padding: 8px;
    color: #ff2121;
    border: none;
    border-radius: 6px;
    margin-top: 8px;
    font-size: 16px;
    transition-duration: 200ms;

    :hover{
        cursor: pointer;
        background-color: #181818;
        box-shadow: 0px 4px 10px #20202077;
    }
`

const Home = () => {
    const [lobbies, setLobbies] = useState([]);
    const [userProfile, setUserProfile] = useState({});
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newLobbyName, setNewLobbyName] = useState("");

    const GetLobbies = async () => {
        let profile = await JSON.parse(cookie.get('userProfile'));
        let res = await axios.post('http://localhost:3000/api/get-user-lobbies', {userId: profile.id});

        setLobbies(res.data);
    }

    const CreateLobby = async () => {
        let res = await axios.post('http://localhost:3000/api/create-lobby', {name: newLobbyName});
        res = res.data
        const user = await JSON.parse(cookie.get('userProfile'));
    
        let res2 = await axios.post('http://localhost:3000/api/lobby/add-user', {lobbyid: res._id, user: user});
        res2 = res2.data;
        GetLobbies();
        setDialogOpen(false);
        setNewLobbyName("");
    }
    
    useEffect(() => {
        const GetUserProfile = async () => {
            let profile = await JSON.parse(cookie.get('userProfile'));

            setUserProfile(profile);
        }

        GetUserProfile();

        GetLobbies();
    }, [])

    return(
        <MainContainer>
            <CreateLobbyContainer onClick={() => setDialogOpen(true)} >
                <AddIcon size={20} />
                <CreateLobbyButton type="button" value="Create lobby"/>
            </CreateLobbyContainer>
            <LobbiesList>
                {lobbies.map((lobby, index) => {
                    let ret = false;
                    lobby.users.map(user => {
                        if(user === userProfile.id){
                            ret = true;
                        }
                    })

                    if(ret === true){
                        return(
                            <Link href={{pathname: 'chat', query: { chatId: lobby._id }}} key={index} ><Lobby type="button" value={lobby.name} /></Link>
                        )
                    }
                })}
            </LobbiesList>
            <CreateLobbyDialog
                open={dialogOpen ? 'open' : false}
                onClose={() => {
                    setDialogOpen(false)
                }}
            >
                <CreateLobbyName
                    placeholder="Type new lobby name..."
                    onChange={(e) => {
                        setNewLobbyName(e.target.value)
                    }}
                    type="text"
                    value={newLobbyName}
                />
                <CreateLobbySubmit
                    type="button"
                    value="Create new lobby"
                    onClick={() => {
                        CreateLobby()
                    }}
                />
                <CreateLobbyCancel
                    type="button"
                    value="Cancel"
                    onClick={() => {
                        setNewLobbyName("");
                        setDialogOpen(false);
                    }}
                />
            </CreateLobbyDialog>
        </MainContainer>
    )
}

export default Home;