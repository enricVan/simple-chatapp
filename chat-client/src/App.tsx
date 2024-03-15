import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import "./App.css";

interface Message {
  name: string;
  text: string;
}

interface TypingInfo {
  name: string;
  isTyping: boolean;
}

interface Props {}

const App: React.FC<Props> = () => {
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [joined, setJoined] = useState(false);
  const [name, setName] = useState("");
  const [typingDisplay, setTypingDisplay] = useState("");
  const [joiners, setJoiners] = useState<string[]>([]);

  useEffect(() => {
    socketRef.current = io("http://localhost:3001");

    const socket = socketRef.current;

    socket.emit("findAllMessages", {}, (res: Message[]) => {
      setMessages(res);
    });

    socket.on("message", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("typing", ({ name, isTyping }: TypingInfo) => {
      if (isTyping) {
        setTypingDisplay(`${name} is typing...`);
      } else {
        setTypingDisplay("");
      }
    });

    socket.on("newUserJoined", (name: string) => {
      setJoiners((prevJoiners) => [
        ...prevJoiners,
        `${name} has joined the chat`,
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const join = () => {
    const socket = socketRef.current;

    socket?.emit("join", { name }, () => {
      setJoined(true);
    });
  };

  const sendMessage = () => {
    const socket = socketRef.current;

    socket?.emit("createMessage", { text: messageText }, () => {
      setMessageText("");
    });
  };

  let timeout: NodeJS.Timeout;

  const emitTyping = () => {
    const socket = socketRef.current;

    socket?.emit("typing", { isTyping: true, name });

    clearTimeout(timeout);
    timeout = setTimeout(() => {
      socket?.emit("typing", { isTyping: false, name });
    }, 1000);
  };

  return (
    <div className="chat">
      {!joined ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            join();
          }}
        >
          <label>What's your name?</label> <br />
          <input value={name} onChange={(e) => setName(e.target.value)} />
          <button type="submit">Join</button>
        </form>
      ) : (
        <div className="chat-container">
          <div>
            {joiners.map((joiner, index) => (
              <div key={index}>{joiner}</div>
            ))}
          </div>
          <br />
          <div className="messages-container">
            {messages.map((message, index) => (
              <div key={index}>
                [{message.name}]: {message.text}
              </div>
            ))}
          </div>

          {typingDisplay && <div>{typingDisplay}</div>}
          <hr />
          <br />
          <div className="message-input">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
            >
              <label>👉</label>
              <input
                value={messageText}
                onChange={(e) => {
                  setMessageText(e.target.value);
                  emitTyping();
                }}
              />
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
