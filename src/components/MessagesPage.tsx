import { Search, Send, MoreVertical, Phone, Ban, X, MessageSquare } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

export const MessagesPage = () => {
  // Cambiamos el ID inicial a null o 0 ya que no habrá contactos al inicio
  const [activeContactId, setActiveContactId] = useState<number | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [blockedContacts, setBlockedContacts] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCallModal, setShowCallModal] = useState(false);

  // PASO 4: Limpieza de datos de prueba (Arrays vacíos)
  const contacts: any[] = [];

  const [chats, setChats] = useState<Record<number, {id: number, text: string, sender: 'me' | 'them', time: string}[]>>({});

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Lógica para manejar el contacto activo de forma segura si no hay ninguno
  const activeContact = contacts.find(c => c.id === activeContactId) || null;
  const activeMessages = activeContactId ? (chats[activeContactId] || []) : [];
  const isBlocked = activeContactId ? blockedContacts.includes(activeContactId) : false;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || isBlocked || !activeContactId) return;

    const newMsg = {
      id: Date.now(),
      text: messageInput,
      sender: 'me' as const,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChats(prev => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] || []), newMsg]
    }));
    setMessageInput("");
  };

  const handleBlockContact = () => {
    if (!activeContactId) return;
    if (isBlocked) {
      setBlockedContacts(prev => prev.filter(id => id !== activeContactId));
    } else {
      setBlockedContacts(prev => [...prev, activeContactId]);
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-black px-6 py-8">
      <div className="max-w-6xl mx-auto bg-white/5 border border-white/10 rounded-3xl overflow-hidden flex h-[80vh]">
        {/* Sidebar */}
        <div className="w-1/3 border-r border-white/10 flex flex-col">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-2xl font-display font-bold mb-4">Mensajes</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar chats..." 
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:border-fuchsia-500 outline-none" 
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <div 
                  key={contact.id} 
                  onClick={() => { setActiveContactId(contact.id); setIsMenuOpen(false); }}
                  className={`p-4 border-b border-white/5 flex items-center space-x-4 cursor-pointer hover:bg-white/5 transition-colors ${activeContactId === contact.id ? 'bg-white/5 border-l-2 border-l-fuchsia-500' : ''}`}
                >
                  <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold truncate">{contact.name}</h3>
                      <span className="text-xs text-white/40">{contact.time}</span>
                    </div>
                    <p className="text-sm text-white/60 truncate">{contact.room}</p>
                  </div>
                  {contact.unread > 0 && activeContactId !== contact.id && (
                    <div className="w-5 h-5 bg-fuchsia-500 rounded-full flex items-center justify-center text-xs font-bold">
                      {contact.unread}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-10 text-center flex flex-col items-center justify-center h-full">
                <MessageSquare className="text-white/10 mb-4" size={40} />
                <p className="text-white/40 text-sm italic">No tienes conversaciones activas todavía.</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col relative">
          {activeContact ? (
            <>
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                <Link to={`/usuario/${activeContact.id}`} className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
                  <img src={activeContact.avatar} alt={activeContact.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h3 className="font-bold">{activeContact.name}</h3>
                    <p className="text-xs text-white/60">{activeContact.room}</p>
                  </div>
                </Link>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setShowCallModal(true)}
                    className="p-2 text-white/60 hover:text-fuchsia-500 hover:bg-white/5 rounded-full transition-colors"
                    title="Llamar"
                  >
                    <Phone size={20} />
                  </button>
                  <div className="relative">
                    <button 
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                    >
                      <MoreVertical size={20} />
                    </button>
                    
                    {isMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-[#111] border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden">
                        <button 
                          onClick={handleBlockContact}
                          className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-white/5 flex items-center space-x-2 transition-colors"
                        >
                          <Ban size={16} /> 
                          <span>{isBlocked ? 'Desbloquear contacto' : 'Bloquear contacto'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                {activeMessages.length > 0 ? (
                  activeMessages.map((msg: any) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`${msg.sender === 'me' ? 'bg-fuchsia-500 rounded-tr-none' : 'bg-white/10 rounded-tl-none'} rounded-2xl px-4 py-3 max-w-md`}>
                        <p className="text-sm">{msg.text}</p>
                        <span className={`text-[10px] mt-1 block ${msg.sender === 'me' ? 'text-white/80 text-right' : 'text-white/40'}`}>
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center text-white/10 uppercase font-black tracking-widest text-[10px]">
                    Inicio de la conversación
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-white/10 bg-white/5">
                {isBlocked ? (
                  <div className="text-center py-3 text-white/40 text-sm bg-white/5 rounded-xl border border-white/10">
                    Has bloqueado a este contacto. No puedes enviar ni recibir mensajes.
                  </div>
                ) : (
                  <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                    <input 
                      type="text" 
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Escribe un mensaje..." 
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-fuchsia-500 outline-none" 
                    />
                    <button 
                      type="submit"
                      disabled={!messageInput.trim()}
                      className="bg-fuchsia-500 hover:bg-fuchsia-600 disabled:opacity-50 disabled:hover:bg-fuchsia-500 w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
                    >
                      <Send size={20} className="text-white" />
                    </button>
                  </form>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-white/[0.02]">
              <div className="w-20 h-20 bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-6 border border-white/10">
                <MessageSquare className="text-fuchsia-500/20" size={40} />
              </div>
              <h3 className="text-xl font-bold mb-2">Tus conversaciones</h3>
              <p className="text-white/20 max-w-xs text-sm">
                Selecciona un contacto de la izquierda para gestionar tus visitas y consultas.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Call Modal */}
      <AnimatePresence>
        {showCallModal && activeContact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowCallModal(false)}
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[#111] border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
            >
              <button 
                onClick={() => setShowCallModal(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 bg-fuchsia-500/20 rounded-full animate-ping"></div>
                <img src={activeContact.avatar} alt={activeContact.name} className="relative w-24 h-24 rounded-full object-cover border-4 border-[#111]" />
              </div>
              
              <h3 className="text-2xl font-bold mb-1">Llamando...</h3>
              <p className="text-white/60 mb-8">{activeContact.name}</p>
              
              <button 
                onClick={() => setShowCallModal(false)}
                className="w-16 h-16 mx-auto bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg shadow-red-500/20"
              >
                <Phone size={24} className="transform rotate-[135deg]" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};