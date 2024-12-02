import { Button, CloseButton, Heading, Input } from "@chakra-ui/react";
import { Message } from "./Message";
import { useState, useEffect, useRef } from "react";

export const Chat = ({ messages, chatRoom, closeChat, sendMessage, userName }) => {
    const [message, setMessage] = useState("");
    const messagesEndRef = useRef(null); // Create a ref for the bottom of the messages list

    // Function to scroll to the bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Scroll to bottom whenever messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const onSendMessage = () => {
        sendMessage(message);
        setMessage("");
    };

    return (
        <div className="w-1/2 bg-white p-8 rounded shadow-lg">
            <div className="flex flex-row justify-between mb-5">
                <Heading size="lg">{chatRoom}</Heading>
                <CloseButton onClick={closeChat} />
            </div>
            <div className="flex flex-col overflow-auto scroll-smooth h-96 gap-3 pb-3">
                {messages.map((messageInfo, index) => (
                    <Message messageInfo={messageInfo} key={index} userName={userName} />
                ))}
                <div ref={messagesEndRef}></div>
            </div>
            <div className="flex gap-3">
                <Input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message"
                />
                <Button colorScheme="blue" onClick={onSendMessage}>
                    Send
                </Button>
            </div>
        </div>
    );
};
