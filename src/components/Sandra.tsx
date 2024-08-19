import { useRef, useEffect, useState } from "react";
import Typed from "typed.js";
import { marked } from "marked";

interface Props {
  sandraMsg: string;
  responseIndex: number;
  lastChatIndex: number;
}

const Sandra = ({ sandraMsg, responseIndex, lastChatIndex }: Props) => {
  const [parsedMessage, setParsedMessage] = useState<string>("");
  const sandraTextElemRef = useRef<HTMLElement | null>(null);
  const typedInstanceRef = useRef<Typed | null>(null);

  useEffect(() => {
    const parseMessage = async () => {
      const parsed = await marked.parse(sandraMsg);
      setParsedMessage(parsed);
    };
    parseMessage();
    if (sandraTextElemRef.current && responseIndex == lastChatIndex) {
      if (typedInstanceRef.current) {
        typedInstanceRef.current.destroy();
      }

      typedInstanceRef.current = new Typed(sandraTextElemRef.current, {
        strings: [parsedMessage],
        typeSpeed: 15,
        showCursor: false,
      });
    }
  });
  return (
    <div className="p-1 bg-[#181818] rounded-md my-2 w-[85%] md:w-[70%] mr-auto">
      <div className="float-left mr-2 flex flex-col gap-2 p-2 justify-center items-center backdrop-blur-md size-10 md:size-16 bg-[#181818] border-2 border-yellow-500 border-opacity-50 rounded-md">
        <img
          src="/sandra.png"
          alt="sandra's picture"
          className="size-6 lg:size-8"
        />
        <p className="font-semibold text-[6px] md:text-[8px] text-yellow-400 italic">
          Sandra
        </p>
      </div>
      <span
        className="text-xs md:text-sm text-yellow-400 leading-relaxed"
        ref={sandraTextElemRef}
        dangerouslySetInnerHTML={{ __html: parsedMessage }}
      />
    </div>
  );
};

export default Sandra;
