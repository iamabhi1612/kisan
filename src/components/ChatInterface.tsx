import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Languages, X, Bot, Sparkles, Volume2 } from 'lucide-react';
import { ChatMessage } from '../types/farmer';

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

// Speech recognition and synthesis setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const speechSynthesis = window.speechSynthesis;

export default function ChatInterface({ isOpen, onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: 'നമസ്കാരം! I am your Krishi Sakhi, your AI farming companion. I can understand and respond in both English and Malayalam. How can I help you today? 🌾',
      sender: 'assistant',
      timestamp: new Date().toISOString(),
      language: 'english',
      type: 'text'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState<'english' | 'malayalam'>('english');
  const [recognition, setRecognition] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = language === 'malayalam' ? 'ml-IN' : 'en-IN';
      
      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setNewMessage(transcript);
        setIsListening(false);
        setIsRecording(false);
      };
      
      recognitionInstance.onerror = () => {
        setIsListening(false);
        setIsRecording(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
        setIsRecording(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const speakMessage = (text: string, lang: string) => {
    if (speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'malayalam' ? 'ml-IN' : 'en-IN';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const getAIResponse = async (userMessage: string, lang: string) => {
    // Simulate API call to agricultural knowledge base
    const responses = {
      english: [
        'Based on current weather conditions in Kerala, I recommend checking your rice crop for brown plant hopper. The recent humidity levels create favorable conditions for pests.',
        'For better yield this season, consider applying organic fertilizer when the weather clears up. Current soil moisture levels are optimal.',
        'The upcoming monsoon forecast shows moderate rainfall. This is excellent for your coconut trees. Ensure proper drainage around the base.',
        'I notice recent pest activity reports in your area. Consider preventive neem spray application for your crops.',
        'Current market prices show rice at ₹2,850/quintal in Kottayam. This is a 2% increase from last week - good time to consider selling.',
        'Soil health data suggests your field may benefit from organic matter. Consider adding compost before the next planting season.'
      ],
      malayalam: [
        'കേരളത്തിലെ നിലവിലെ കാലാവസ്ഥാ സാഹചര്യങ്ങളെ അടിസ്ഥാനമാക്കി, നിങ്ങളുടെ നെല്ല് വിളയിൽ ബ്രൗൺ പ്ലാന്റ് ഹോപ്പർ പരിശോധിക്കാൻ ഞാൻ ശുപാർശ ചെയ്യുന്നു.',
        'ഈ സീസണിൽ മികച്ച വിളവിനായി, കാലാവസ്ഥ മെച്ചപ്പെടുമ്പോൾ ജൈവ വളം പ്രയോഗിക്കുന്നത് പരിഗണിക്കുക.',
        'വരാനിരിക്കുന്ന മഴ നിങ്ങളുടെ തെങ്ങുകൾക്ക് നല്ലതാണ്. അടിഭാഗത്തിന് ചുറ്റും നല്ല ഡ്രെയിനേജ് ഉറപ്പാക്കുക.',
        'നിങ്ങളുടെ പ്രദേശത്ത് കീടങ്ങളുടെ പ്രവർത്തനം റിപ്പോർട്ട് ചെയ്യപ്പെട്ടിട്ടുണ്ട്. വേപ്പ് സ്പ്രേ പ്രയോഗിക്കുന്നത് പരിഗണിക്കുക.',
        'കോട്ടയം മാർക്കറ്റിൽ നെല്ലിന്റെ വില ₹2,850/ക്വിന്റൽ ആണ്. ഇത് കഴിഞ്ഞ ആഴ്ചയെ അപേക്ഷിച്ച് 2% വർദ്ധനവാണ്.',
        'മണ്ണിന്റെ ആരോഗ്യ ഡാറ്റ സൂചിപ്പിക്കുന്നത് നിങ്ങളുടെ വയലിന് ജൈവവസ്തുക്കൾ ഗുണം ചെയ്യുമെന്നാണ്.'
      ]
    };
    
    const responseList = responses[lang as keyof typeof responses] || responses.english;
    return responseList[Math.floor(Math.random() * responseList.length)];
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: newMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
      language,
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Get AI response
    setTimeout(() => {
      const responseText = await getAIResponse(userMessage.message, language);
      
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: responseText,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        language,
        type: 'text'
      };
      
      setMessages(prev => [...prev, aiResponse]);
      
      // Speak the response
      speakMessage(responseText, language);
    }, 1000);
  };

  const toggleRecording = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      setIsRecording(false);
    } else {
      recognition.lang = language === 'malayalam' ? 'ml-IN' : 'en-IN';
      recognition.start();
      setIsListening(true);
      setIsRecording(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center sm:justify-center">
      <div className="bg-white w-full sm:w-96 sm:max-w-md h-full sm:h-[600px] sm:rounded-t-xl sm:rounded-b-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gradient-to-r from-green-600 to-green-500 rounded-full flex items-center justify-center relative overflow-hidden">
              <Bot className="h-5 w-5 text-white" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900">Krishi Sakhi</h3>
                <Sparkles className="h-3 w-3 text-yellow-500" />
              </div>
              <p className="text-xs text-green-600">AI Assistant • Ready to help</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setLanguage(language === 'english' ? 'malayalam' : 'english')}
              className="p-2 rounded-md text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
              title="Switch Language"
            >
              <Languages className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-sm'
                    : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-900 border border-gray-200'
                }`}
              >
                <p className="text-sm">{message.message}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={language === 'malayalam' ? 'നിങ്ങളുടെ ചോദ്യം ടൈപ്പ് ചെയ്യുക...' : 'Type your farming question...'}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={toggleRecording}
              className={`p-2 rounded-lg transition-colors ${
                isRecording 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              disabled={!recognition}
            >
              {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>
            
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="p-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          
          {isListening && (
            <div className="mt-2 flex items-center justify-center space-x-2 text-red-600">
              <div className="flex space-x-1">
                <div className="animate-pulse h-2 w-2 bg-red-600 rounded-full"></div>
                <div className="animate-pulse h-2 w-2 bg-red-600 rounded-full" style={{ animationDelay: '0.2s' }}></div>
                <div className="animate-pulse h-2 w-2 bg-red-600 rounded-full" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <span className="text-sm">
                {language === 'malayalam' ? 'കേൾക്കുന്നു... ഇപ്പോൾ സംസാരിക്കുക' : 'Listening... Speak now'}
              </span>
            </div>
          )}
          
          <div className="mt-2 text-xs text-gray-500 text-center">
            Language: {language === 'malayalam' ? '🇮🇳 മലയാളം' : '🇬🇧 English'}
            {!recognition && (
              <div className="text-red-500 mt-1">Voice input not supported in this browser</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}