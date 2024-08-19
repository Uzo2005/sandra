import { useState } from "react";
import type { ChangeEvent, FormEvent, SetStateAction, Dispatch } from "react";
import { SERVER_BASE_URL, type chatProps } from "../constants";

interface Props {
  setChatState: Dispatch<SetStateAction<chatProps[]>>;
}

const ChatBox = ({ setChatState }: Props) => {
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!message) return;

    const formData = { message: "" };
    if (message) {
      formData["message"] = message;
      setChatState((previousState) => [
        ...previousState,
        { role: "user", content: message },
        { role: "loading", content: "" },
      ]);
    }

    try {
      const chatId = window.sessionStorage.getItem("chatId");
      const response = await fetch(`${SERVER_BASE_URL}/chat/${chatId}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "text/plain",
        },
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Message sent successfully");
        const sandraResponse = await response.text();
        setChatState((previousState) => [
          ...previousState.slice(0, -1),
          { role: "assistant", content: sandraResponse },
        ]);
        setMessage("");
      } else {
        console.error(
          "Sending message failed: ",
          response,
          await response.text()
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full rounded-md grid grid-cols-12 gap-2"
    >
      <input
        type="text"
        value={message}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setMessage(e.target.value)
        }
        placeholder="Lets plan that vacation. Shall we?"
        className="bg-neutral-900 rounded-sm col-span-11 outline-none p-2 font-semibold text-[8px] md:text-sm text-yellow-500 "
      />
      <button
        type="submit"
        className="col-span-1 flex justify-center items-center"
      >
        <img
          src={`${import.meta.env.BASE_URL}/sendMessage.svg`}
          alt="send_message_icon"
          className="size-5 md:size-10 cursor-pointer opacity-70 hover:opacity-100"
          title="send message"
        />
      </button>
    </form>
  );
};

export default ChatBox;
