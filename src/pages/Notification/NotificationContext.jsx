import { createContext, useContext, useState, useCallback } from "react";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [messages, setMessages] = useState([]);

    const addMessage = useCallback((text, type = "info", duration = 4000) => {
        const id = Date.now();
        setMessages(prev => [...prev, { id, text, type }]);
        setTimeout(() => {
            setMessages(prev => prev.filter(m => m.id !== id));
        }, duration);
    }, []);

    return (
        <NotificationContext.Provider value={{ addMessage }}>
            {children}
            <div className="fixed top-4 right-4 flex flex-col gap-2 z-50">
                {messages.map(msg => (
                    <div
                        key={msg.id}
                        className={`px-4 py-2 rounded-md shadow-lg text-sm font-medium ${msg.type === "error" ? "bg-red-600 text-white" :
                                msg.type === "success" ? "bg-green-600 text-white" :
                                    "bg-blue-600 text-white"
                            }`}
                    >
                        {msg.text}
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
}

export const useNotification = () => useContext(NotificationContext);