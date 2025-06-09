import React, { useState } from "react";

const IAChat = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isDarkMode, setIsDarkMode] = useState(true);

    const getEmojiForMessage = (content) => {
        // Detectar el tipo de contenido para asignar emojis apropiados
        const lowerContent = content.toLowerCase();
        
        if (lowerContent.includes('error') || lowerContent.includes('error')) {
            return '❌';
        }
        if (lowerContent.includes('corrección') || lowerContent.includes('corregir')) {
            return '✏️';
        }
        if (lowerContent.includes('gracias') || lowerContent.includes('thank')) {
            return '🙏';
        }
        if (lowerContent.includes('hola') || lowerContent.includes('hi')) {
            return '👋';
        }
        if (lowerContent.includes('ayuda') || lowerContent.includes('help')) {
            return '💡';
        }
        if (lowerContent.includes('lista') || lowerContent.includes('list')) {
            return '📝';
        }
        if (lowerContent.includes('excelente') || lowerContent.includes('great')) {
            return '🌟';
        }
        if (lowerContent.includes('pregunta') || lowerContent.includes('question')) {
            return '❓';
        }
        if (lowerContent.includes('idea') || lowerContent.includes('sugerencia')) {
            return '💭';
        }
        if (lowerContent.includes('feliz') || lowerContent.includes('happy')) {
            return '😊';
        }
        if (lowerContent.includes('triste') || lowerContent.includes('sad')) {
            return '😔';
        }
        
        // Emojis por defecto según el tipo de contenido
        if (content.length > 200) {
            return '📚';
        }
        if (content.includes('?')) {
            return '❓';
        }
        if (content.includes('!')) {
            return '❗';
        }
        
        return '💬';
    };

    const formatMessage = (content) => {
        // Si el mensaje es corto, lo devolvemos con un emoji
        if (content.length < 100) {
            return (
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{getEmojiForMessage(content)}</span>
                    <span>{content}</span>
                </div>
            );
        }

        // Dividimos el contenido en párrafos
        const paragraphs = content.split('\n\n');
        
        // Procesamos cada párrafo
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">{getEmojiForMessage(content)}</span>
                    <span className="text-sm text-gray-500">EscribeFácil</span>
                </div>
                {paragraphs.map((paragraph, index) => {
                    // Si el párrafo comienza con un número o guión, lo tratamos como lista
                    if (/^(\d+\.|\-|\*)\s/.test(paragraph)) {
                        const items = paragraph.split('\n');
                        return (
                            <div key={index} className={`rounded-lg p-4 space-y-3 ${
                                isDarkMode ? 'bg-gray-800/50' : 'bg-white shadow-sm'
                            }`}>
                                {items.map((item, i) => {
                                    const cleanItem = item.replace(/^(\d+\.|\-|\*)\s/, '');
                                    return (
                                        <div key={i} className="flex items-start gap-3 group">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                isDarkMode ? 'bg-blue-600' : 'bg-blue-500'
                                            }`}>
                                                <span className="text-white text-sm">{i + 1}</span>
                                            </div>
                                            <div className="flex-1 pt-1">
                                                <p className={`${
                                                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                                }`}>{cleanItem}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    }
                    
                    // Si el párrafo parece un título
                    if (paragraph.length < 50 && !paragraph.includes('.')) {
                        return (
                            <div key={index} className={`flex items-center gap-3 rounded-lg p-4 ${
                                isDarkMode ? 'bg-gray-800/50' : 'bg-white shadow-sm'
                            }`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    isDarkMode ? 'bg-blue-600' : 'bg-blue-500'
                                }`}>
                                    <span className="text-white text-lg">📌</span>
                                </div>
                                <h3 className={`text-lg font-semibold ${
                                    isDarkMode ? 'text-white' : 'text-gray-800'
                                }`}>{paragraph}</h3>
                            </div>
                        );
                    }
                    
                    // Párrafo normal
                    return (
                        <div key={index} className={`rounded-lg p-4 ${
                            isDarkMode ? 'bg-gray-800/50' : 'bg-white shadow-sm'
                        }`}>
                            <p className={`leading-relaxed ${
                                isDarkMode ? 'text-gray-200' : 'text-gray-700'
                            }`}>{paragraph}</p>
                        </div>
                    );
                })}
            </div>
        );
    };

    const handleSend = async () => {
        if (!userInput.trim()) return;

        const newMessages = [...messages, { role: "user", content: userInput }];
        setMessages(newMessages);
        setUserInput("");
        setLoading(true);
        setError("");

        try {
            const res = await fetch("http://localhost:5000/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: newMessages }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessages([...newMessages, { role: "assistant", content: data.result }]);
            } else {
                setError(data.error || "Error al generar respuesta.");
            }
        } catch (e) {
            setError("No se pudo conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`flex flex-col h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-white'}`}>
            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white'}`}>
                <h1 className={`text-xl font-semibold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    <span className="text-2xl">🤖</span> EscribeFácil
                </h1>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={`p-2 rounded-lg transition ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
                        title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                    >
                        {isDarkMode ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        )}
                    </button>
                    <button
                        onClick={() => { setMessages([]); setError(""); }}
                        disabled={loading}
                        className={`transition ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
                        title="Borrar chat"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Chat messages */}
            <div className={`flex-1 overflow-y-auto ${isDarkMode ? 'bg-gray-900/50 text-white' : 'bg-gray-50'}`}>
                {messages.length === 0 && !loading && (
                    <div className="flex items-center justify-center h-full">
                        <div className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <p className="text-lg font-medium mb-2">Bienvenido a EscribeFácil</p>
                            <p className="text-sm">Escribe tu primer mensaje para comenzar la conversación.</p>
                        </div>
                    </div>
                )}
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} py-6 ${
                            msg.role === "assistant" ? (isDarkMode ? "bg-gray-800/50" : "bg-gray-50") : ""
                        }`}
                    >
                        <div className="w-full max-w-3xl mx-auto px-4">
                            <div className="flex items-start gap-4">
                                {msg.role === "assistant" && (
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                        isDarkMode ? "bg-blue-600" : "bg-blue-500"
                                    }`}>
                                        <span className="text-white text-lg">🤖</span>
                                    </div>
                                )}
                                <div className={`flex-1 ${msg.role === "user" ? "text-right" : ""}`}>
                                    {msg.role === "assistant" ? (
                                        <div className={`prose prose-sm max-w-none ${
                                            isDarkMode 
                                                ? "prose-invert prose-headings:text-gray-100 prose-p:text-gray-300 prose-strong:text-white" 
                                                : "prose-gray"
                                        }`}>
                                            {formatMessage(msg.content)}
                                        </div>
                                    ) : (
                                        <div className={`inline-block px-4 py-2 rounded-lg ${
                                            isDarkMode 
                                                ? "bg-blue-600 text-white" 
                                                : "bg-blue-500 text-white"
                                        }`}>
                                            <div className="flex items-center gap-2">
                                                <span>{msg.content}</span>
                                                <span className="text-lg">👤</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {msg.role === "user" && (
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                        isDarkMode ? "bg-gray-700" : "bg-gray-200"
                                    }`}>
                                        <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>👤</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex items-start gap-4 py-6">
                        <div className="w-full max-w-3xl mx-auto px-4">
                            <div className="flex items-start gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    isDarkMode ? "bg-blue-600" : "bg-blue-500"
                                }`}>
                                    <span className="text-white text-lg">🤖</span>
                                </div>
                                <div className="flex-1">
                                    <div className={`px-4 py-2 rounded-lg ${
                                        isDarkMode 
                                            ? "bg-gray-700 text-gray-300" 
                                            : "bg-gray-100 text-gray-500"
                                    }`}>
                                        <div className="flex space-x-2">
                                            <div className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                                            <div className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? 'bg-blue-500' : 'bg-gray-400'}`} style={{ animationDelay: "0.2s" }}></div>
                                            <div className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? 'bg-blue-500' : 'bg-gray-400'}`} style={{ animationDelay: "0.4s" }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input area */}
            <div className={`border-t ${isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white'} p-4`}>
                <form
                    className="flex items-center gap-2 max-w-3xl mx-auto"
                    onSubmit={e => {
                        e.preventDefault();
                        handleSend();
                    }}
                >
                    <input
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        className={`flex-1 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                            isDarkMode 
                                ? 'border border-gray-700 bg-gray-800 text-white placeholder-gray-500' 
                                : 'border border-gray-200 bg-white text-gray-800'
                        }`}
                        placeholder="Escribe tu mensaje..."
                        disabled={loading}
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={loading || !userInput.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </form>
            </div>

            {/* Error message */}
            {error && (
                <div className={`px-6 py-3 border-t ${
                    isDarkMode 
                        ? 'bg-red-900/50 border-red-800' 
                        : 'bg-red-50 border-red-100'
                }`}>
                    <p className={`text-center text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
                </div>
            )}
        </div>
    );
};

export default IAChat;
