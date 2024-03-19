"use client";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import useEthersSigner from "@/hooks/useEthersSigner";
import { useAccount } from "wagmi";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import usePush from "@/hooks/usePush";
import { setUser } from "@/redux/slice/pushSlice";
import { initUser } from "@/functions/initUser";

const fetchChats = async (user) => {
    const chats = await user.chat.list("CHATS");
    console.log("Chats", chats);
    return chats;
};

const fetchChatHistory = async (chatId, user) => {
    const history = await user.chat.history(chatId);
    console.log("History", history);
    return history;
};

const sendMessage = async (chatId, content, user) => {
    console.log("Sending text");
    const txt = await user.chat.send(chatId, {
        type: "Text",
        content: content,
    });
    console.log("Sent message:", txt);
    return txt;
};

const joinGroup = async (user) => {
    const joinGroup = await user.chat.group.join(
        "87e029ad9825b78b871710daf12b9700b845b7c39ef1c447304a3d89defc525d"
    );
    return joinGroup;
};

const GroupChat = ({ params }) => {
    const chatId = params.chatId;
    
    const account = useAccount();
    const dispatch = useDispatch();

    const [chat, setChat] = useState(null);
    const [history, setHistory] = useState([]);

    const signer = useEthersSigner({ chainId: account.chainId });
    const user = useSelector((state) => state.push.user);
    console.log("From Redux", user);
    
    const { fetchChats } = usePush();

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                if (!signer || !account) return;

                if (!user) {
                    const newUser = await initUser(signer);
                    if (newUser) {
                        if (!newUser.readMode) {
                            dispatch(setUser(newUser));
                        }
                    }
                }

                if (!chat) {
                    const groupInfo = await user.chat.group.info(chatId);
                    if (isMounted) {
                        setChat(groupInfo);
                    }

                    // Fetch chat history
                    const history = await user.chat.history(chatId);
                    if (isMounted) {
                        setHistory(history);
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [account, signer, chatId, user]);

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

    const sendMessageText = async () => {
        if (!user) return;

        const res = await sendMessage(chatId, message, user);
        setMessage("");
    };

    const handleJoinGroup = async () => {
        if (!user) return;

        const res = await joinGroup(user);
        console.log("Joined group:", res);
    };

    const handleFetchHistory = async () => {
        if (!user) return;

        const res = await fetchChatHistory(chatId, user);
        setHistory(res);
    };
    const data = useSelector((state) => state.push.data);

    const [message, setMessage] = useState("");

    // useEffect(() => {
    // 	if (user) {
    // 		fetchChats();
    // 	}
    // }, [user]);

    // useEffect(() => {
    // 	if (data && user) {
    // 		fetchChats();
    // 	}
    // }, [data]);

    // const chats = useSelector((state) => state.push.chats);
    // console.log("mm", chats);

    return (
        <div className='m-16'>
            {chat && <ChatHeader chat={chat} />}
            <button onClick={fetchChats}>Fetch Chats</button>
            <br />
            <button onClick={handleJoinGroup}>Join Group</button>
            <br />
            <button onClick={handleFetchHistory}>Fetch History</button>
            {history.length > 0 && <ChatHistory messages={history} />}
            <div className='flex items-center border border-gray-300 rounded-md p-2'>
                <input
                    type='text'
                    placeholder='Type your message...'
                    value={message}
                    onChange={handleMessageChange}
                    className='flex-grow outline-none px-2 py-1'
                />
                <button
                    onClick={sendMessageText}
                    className='ml-2 bg-blue-500 text-white font-semibold px-4 py-2 rounded hover:bg-blue-600 focus:outline-none'
                >
                    Send
                </button>
            </div>
        </div>
    );
};

const ChatHeader = ({ chat }) => {
    return (
        <div className='bg-blue-200 p-4 flex justify-between items-center'>
            <div className='text-black text-lg font-semibold'>
                {chat.groupName}
            </div>
        </div>
    );
};

const ChatHistory = ({ messages }) => {
    return (
        <div className='flex flex-col gap-2'>
            {messages.map((message, index) => (
                <div key={index} className='flex flex-col'>
                    <div className='flex items-center'>
                        <span className='font-bold mr-2'>{message.cid}</span>
                        <span className='text-gray-500'>
                            {message.timestamp}
                        </span>
                    </div>
                    <div className='bg-gray-200 p-2 rounded-lg'>
                        {message.messageObj.content}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default GroupChat;
