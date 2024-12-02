import {WaitingRoom} from "./components/WaitingRoom";
import {HubConnectionBuilder} from "@microsoft/signalr";
import {Chat} from "./components/Chat";
import {useState} from "react";

function App() {
    const [connection, setConnection] = useState(null);
    const [chatRoom, setChatRoom] = useState("");
    const [messages, setMessages] = useState([]);
    const [userName, setUserName] = useState("");

    const joinChat = async (userName, chatRoom) => {
        let connection = new HubConnectionBuilder()
            // .withUrl("http://localhost:5234/chat")
            .withUrl("https://real-time-chat-server-g5f0dgdwhqevgne4.northeurope-01.azurewebsites.net/chat")
            .withAutomaticReconnect()
            .build();


        connection.on("ReceiveMessageWithSentiment", (userName, message, sentiment) => {
            setMessages(messages => [...messages, { userName, message, sentiment }]);
        });

        try {
            await connection.start();
            await connection.invoke("JoinChat", {userName, chatRoom});
            setConnection(connection);
            setChatRoom(chatRoom);
            setUserName(userName);
        } catch (e) {
            console.error(e);
        }
    };

    const closeChat = async () => {

        await connection.stop();
        setConnection(null);
        setMessages([]);
    }

    const sendMessage = async (message) => {
        try {
            await connection.invoke("SendMessage", message);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            {connection ? <Chat messages={messages} chatRoom={chatRoom} closeChat={closeChat} sendMessage={sendMessage} userName={userName}/> :
                <WaitingRoom joinChat={joinChat}/>}
        </div>
    );
}

export default App;
