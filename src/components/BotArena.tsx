import Sandra from "./Sandra";
import UserChat from "./UserChat";
import LoadingChat from "./LoadingChat";
import { type chatProps } from "../constants";
import { useEffect, useRef } from "react";

interface Props {
  chatHistory: chatProps[];
}

const BotArena = ({ chatHistory }: Props) => {
  const alwaysInViewRef = useRef<HTMLParagraphElement>(null);
  const alwaysInViewParentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!alwaysInViewRef.current || !alwaysInViewParentRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      alwaysInViewRef.current?.scrollIntoView({ behavior: "smooth" });
    });

    resizeObserver.observe(alwaysInViewParentRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  });

  return (
    <div className="h-full overflow-y-scroll scrollbar">
      <div className="flex flex-col gap-1" ref={alwaysInViewParentRef}>
        {chatHistory.map((chatItem, index) => {
          return chatItem.role == "assistant" ? (
            <Sandra
              sandraMsg={chatItem.content}
              lastChatIndex={chatHistory.length - 1}
              responseIndex={index}
              key={index}
            />
          ) : chatItem.role == "user" ? (
            <UserChat userMsg={chatItem.content} key={index} />
          ) : (
            <LoadingChat key={index} />
          );
        })}
        <p ref={alwaysInViewRef}></p>
      </div>
    </div>
  );
};

export default BotArena;
