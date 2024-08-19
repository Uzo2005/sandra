interface Props {
  userMsg: string;
}

const UserChat = ({ userMsg }: Props) => {
  return (
    <div className="p-1 rounded-md bg-[#050505] my-2 max-w-[80%] md:max-w-[50%] min-w-[60%] md:min-w-[40%] ml-auto">
      <div className="float-left mr-2 flex flex-col gap-2 p-2 justify-center items-center backdrop-blur-md size-10 md:size-16 bg-[#050505] border-2 border-yellow-500 border-opacity-50 rounded-md">
        <img
          src="/wojak_user.png"
          alt="user wojak"
          className="size-6 lg:size-8"
        />
        <p className="font-semibold text-[6px] md:text-[8px] text-yellow-500 italic">
          You
        </p>
      </div>
      <span className="text-xs md:text-sm font-medium italic text-yellow-400">
        {userMsg}
      </span>
    </div>
  );
};

export default UserChat;
