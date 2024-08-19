import ChatBox from "../components/ChatBox";
import BotArena from "../components/BotArena";
import { useState, useEffect } from "react";
import { SERVER_BASE_URL, type chatProps } from "../constants";

const VacPlanner = () => {
  const [chat, setChat] = useState<chatProps[]>([
    {
      role: "loading",
      content: "",
    },
  ]);

  useEffect(() => {
    const getNewChatId = async () => {
      if (!window.sessionStorage.getItem("chatId")) {
        const newChatIdResponse = await fetch(
          `${SERVER_BASE_URL}/startNewChat`
        );
        if (newChatIdResponse.ok) {
          console.log("New ChatId Obtained successfully");
          const newChatId = await newChatIdResponse.text();
          window.sessionStorage.setItem("chatId", newChatId);

          const chatState = await fetch(`${SERVER_BASE_URL}/chat/${newChatId}`);

          if (chatState.ok) {
            const parsedChatState: chatProps[] = await chatState.json();
            setChat(parsedChatState);
          } else {
            console.error("Obtaining ChatState Failed");
          }
        } else {
          console.error("Obtaining New ChatId Failed");
        }
      } else {
        const chatId = window.sessionStorage.getItem("chatId");
        const chatState = await fetch(`${SERVER_BASE_URL}/chat/${chatId}`);

        if (chatState.ok) {
          const parsedChatState: chatProps[] = await chatState.json();
          setChat(parsedChatState);
        } else {
          console.error("Obtaining ChatState Failed");
        }
      }
    };
    try {
      getNewChatId();
    } catch (error) {
      console.error("Could not get new chatId due to error:", error);
    }
  }, []);

  return (
    <div className="w-full h-full pt-2 pb-5 px-2 md:px-3 grid lg:grid-cols-12 lg:*:col-start-2 lg:*:col-span-10 grid-rows-8 md:grid-rows-10 gap-5 ">
      <div className="row-span-7 md:row-span-9">
        <BotArena chatHistory={chat} />
      </div>
      <div className="row-span-1 bg-black p-2 rounded-md border-2 border-yellow-500 border-opacity-40">
        <ChatBox setChatState={setChat} />
      </div>
    </div>
  );
};

export default VacPlanner;
