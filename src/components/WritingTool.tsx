import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Copy, 
  CheckCircle, 
  Save, 
  Trash2, 
  Edit3, 
  Clock, 
  Type, 
  Hash, 
  Eye, 
  FileText,
  Plus,
  X,
  RotateCcw,
  Download,
  Upload,
  Palette,
  Settings,
  Moon,
  Sun
} from 'lucide-react';

interface SavedNote {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  charCount: number;
  readingTime: number;
  createdAt: Date;
  updatedAt: Date;
}

interface WritingStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  paragraphs: number;
  sentences: number;
  readingTime: number;
}

const WritingTool: React.FC = () => {
  const [text, setText] = useState('');
  const [stats, setStats] = useState<WritingStats>({
    words: 0,
    characters: 0,
    charactersNoSpaces: 0,
    paragraphs: 0,
    sentences: 0,
    readingTime: 0
  });
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>([]);
  const [showSavedNotes, setShowSavedNotes] = useState(false);
  const [copied, setCopied] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [showSettings, setShowSettings] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();

  // Load saved data on mount
  useEffect(() => {
    const savedText = localStorage.getItem('writing-tool-current-text');
    const savedNotesData = localStorage.getItem('writing-tool-saved-notes');
    const savedSettings = localStorage.getItem('writing-tool-settings');
    
    if (savedText) {
      setText(savedText);
    }
    
    if (savedNotesData) {
      const notes = JSON.parse(savedNotesData).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt)
      }));
      setSavedNotes(notes);
    }
    
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setAutoSave(settings.autoSave ?? true);
      setDarkMode(settings.darkMode ?? false);
      setFontSize(settings.fontSize ?? 16);
      setFocusMode(settings.focusMode ?? false);
    }
  }, []);

  // Calculate writing statistics
  const calculateStats = useCallback((content: string): WritingStats => {
    const trimmedText = content.trim();
    
    if (!trimmedText) {
      return {
        words: 0,
        characters: 0,
        charactersNoSpaces: 0,
        paragraphs: 0,
        sentences: 0,
        readingTime: 0
      };
    }

    // Words (split by whitespace and filter empty strings)
    const words = trimmedText.split(/\s+/).filter(word => word.length > 0).length;
    
    // Characters
    const characters = content.length;
    const charactersNoSpaces = content.replace(/\s/g, '').length;
    
    // Paragraphs (split by double line breaks)
    const paragraphs = trimmedText.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    
    // Sentences (approximate - split by sentence endings)
    const sentences = trimmedText.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    
    // Reading time (average 200 words per minute)
    const readingTime = Math.ceil(words / 200);

    return {
      words,
      characters,
      charactersNoSpaces,
      paragraphs,
      sentences,
      readingTime
    };
  }, []);

  // Update stats when text changes
  useEffect(() => {
    const newStats = calculateStats(text);
    setStats(newStats);
    
    // Auto-save current text
    if (autoSave) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      
      autoSaveTimeoutRef.current = setTimeout(() => {
        localStorage.setItem('writing-tool-current-text', text);
      }, 1000);
    }
  }, [text, autoSave, calculateStats]);

  // Save settings
  useEffect(() => {
    const settings = {
      autoSave,
      darkMode,
      fontSize,
      focusMode
    };
    localStorage.setItem('writing-tool-settings', JSON.stringify(settings));
  }, [autoSave, darkMode, fontSize, focusMode]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const saveAsNote = () => {
    if (!text.trim()) return;

    const noteStats = calculateStats(text);
    const title = text.split('\n')[0].substring(0, 50) || 'Untitled Note';
    
    const newNote: SavedNote = {
      id: currentNoteId || Date.now().toString(),
      title,
      content: text,
      wordCount: noteStats.words,
      charCount: noteStats.characters,
      readingTime: noteStats.readingTime,
      createdAt: currentNoteId ? savedNotes.find(n => n.id === currentNoteId)?.createdAt || new Date() : new Date(),
      updatedAt: new Date()
    };

    setSavedNotes(prev => {
      const filtered = prev.filter(note => note.id !== newNote.id);
      const updated = [newNote, ...filtered];
      localStorage.setItem('writing-tool-saved-notes', JSON.stringify(updated));
      return updated;
    });

    setCurrentNoteId(newNote.id);
    setShowSavedNotes(true);
  };

  const loadNote = (note: SavedNote) => {
    setText(note.content);
    setCurrentNoteId(note.id);
    setShowSavedNotes(false);
  };

  const deleteNote = (noteId: string) => {
    setSavedNotes(prev => {
      const updated = prev.filter(note => note.id !== noteId);
      localStorage.setItem('writing-tool-saved-notes', JSON.stringify(updated));
      return updated;
    });
    
    if (currentNoteId === noteId) {
      setCurrentNoteId(null);
    }
  };

  const createNewNote = () => {
    setText('');
    setCurrentNoteId(null);
    setShowSavedNotes(false);
    textareaRef.current?.focus();
  };

  const exportText = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `writing-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setText(content);
      };
      reader.readAsText(file);
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      darkMode 
        ? 'bg-gray-900 text-gray-100' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-900'
    }`}>
      <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className={`text-center mb-8 ${focusMode ? 'hidden' : ''}`}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className={`p-3 rounded-xl ${
              darkMode 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                : 'bg-gradient-to-r from-purple-500 to-pink-600'
            }`}>
              <Edit3 className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-4xl font-bold ${
              darkMode 
                ? 'text-white' 
                : 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'
            }`}>
              Writing Tool
            </h1>
          </div>
          <p className={`text-lg max-w-2xl mx-auto ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Ferramenta minimalista para escrita com estatísticas em tempo real
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Writing Area */}
          <div className={`${focusMode ? 'lg:col-span-4' : 'lg:col-span-3'} space-y-6`}>
            {/* Toolbar */}
            <div className={`${
              darkMode ? 'bg-gray-800/80' : 'bg-white/80'
            } backdrop-blur-sm rounded-2xl shadow-xl p-4 border ${
              darkMode ? 'border-gray-700/20' : 'border-white/20'
            } ${focusMode ? 'hidden' : ''}`}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={createNewNote}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      darkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    Novo
                  </button>
                  
                  <button
                    onClick={saveAsNote}
                    disabled={!text.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <Save className="w-4 h-4" />
                    Salvar
                  </button>

                  <button
                    onClick={() => setShowSavedNotes(!showSavedNotes)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      showSavedNotes
                        ? 'bg-blue-500 text-white'
                        : darkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    Notas ({savedNotes.length})
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={copyToClipboard}
                    disabled={!text.trim()}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      darkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {copied ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {copied ? 'Copiado!' : 'Copiar'}
                  </button>

                  <button
                    onClick={exportText}
                    disabled={!text.trim()}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      darkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <Download className="w-4 h-4" />
                    Exportar
                  </button>

                  <label className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}>
                    <Upload className="w-4 h-4" />
                    Importar
                    <input
                      type="file"
                      accept=".txt,.md"
                      onChange={importText}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      showSettings
                        ? 'bg-purple-500 text-white'
                        : darkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Settings Panel */}
              {showSettings && (
                <div className={`mt-4 p-4 rounded-lg border-t ${
                  darkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Tamanho da Fonte
                      </label>
                      <input
                        type="range"
                        min="12"
                        max="24"
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="w-full"
                      />
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {fontSize}px
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className={`text-sm font-medium ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Auto-save
                      </label>
                      <button
                        onClick={() => setAutoSave(!autoSave)}
                        className={`w-12 h-6 rounded-full transition-all duration-200 ${
                          autoSave ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                          autoSave ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className={`text-sm font-medium ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Modo Escuro
                      </label>
                      <button
                        onClick={() => setDarkMode(!darkMode)}
                        className={`w-12 h-6 rounded-full transition-all duration-200 ${
                          darkMode ? 'bg-purple-500' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 flex items-center justify-center ${
                          darkMode ? 'translate-x-6' : 'translate-x-0.5'
                        }`}>
                          {darkMode ? <Moon className="w-3 h-3 text-purple-500" /> : <Sun className="w-3 h-3 text-yellow-500" />}
                        </div>
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className={`text-sm font-medium ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Modo Foco
                      </label>
                      <button
                        onClick={() => setFocusMode(!focusMode)}
                        className={`w-12 h-6 rounded-full transition-all duration-200 ${
                          focusMode ? 'bg-indigo-500' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                          focusMode ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Writing Area */}
            <div className={`${
              darkMode ? 'bg-gray-800/80' : 'bg-white/80'
            } backdrop-blur-sm rounded-2xl shadow-xl border ${
              darkMode ? 'border-gray-700/20' : 'border-white/20'
            } overflow-hidden`}>
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Comece a escrever aqui..."
                className={`w-full h-96 p-6 resize-none focus:outline-none transition-all duration-200 ${
                  darkMode 
                    ? 'bg-transparent text-gray-100 placeholder-gray-400' 
                    : 'bg-transparent text-gray-900 placeholder-gray-500'
                }`}
                style={{ fontSize: `${fontSize}px`, lineHeight: '1.6' }}
              />
              
              {/* Quick Stats Bar */}
              <div className={`px-6 py-3 border-t ${
                darkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-6">
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                      <strong>{stats.words}</strong> palavras
                    </span>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                      <strong>{stats.characters}</strong> caracteres
                    </span>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                      <strong>{stats.readingTime}</strong> min de leitura
                    </span>
                  </div>
                  
                  {currentNoteId && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800'
                    }`}>
                      Nota salva
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          {!focusMode && (
            <div className="space-y-6">
              {/* Statistics */}
              <div className={`${
                darkMode ? 'bg-gray-800/80' : 'bg-white/80'
              } backdrop-blur-sm rounded-2xl shadow-xl p-6 border ${
                darkMode ? 'border-gray-700/20' : 'border-white/20'
              }`}>
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    Estatísticas
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className={`flex items-center justify-between p-3 rounded-lg ${
                    darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Type className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Palavras</span>
                    </div>
                    <span className={`font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      {stats.words}
                    </span>
                  </div>

                  <div className={`flex items-center justify-between p-3 rounded-lg ${
                    darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Hash className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Caracteres</span>
                    </div>
                    <span className={`font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      {stats.characters}
                    </span>
                  </div>

                  <div className={`flex items-center justify-between p-3 rounded-lg ${
                    darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Hash className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sem espaços</span>
                    </div>
                    <span className={`font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      {stats.charactersNoSpaces}
                    </span>
                  </div>

                  <div className={`flex items-center justify-between p-3 rounded-lg ${
                    darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-2">
                      <FileText className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Parágrafos</span>
                    </div>
                    <span className={`font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      {stats.paragraphs}
                    </span>
                  </div>

                  <div className={`flex items-center justify-between p-3 rounded-lg ${
                    darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Eye className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Frases</span>
                    </div>
                    <span className={`font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      {stats.sentences}
                    </span>
                  </div>

                  <div className={`flex items-center justify-between p-3 rounded-lg ${
                    darkMode ? 'bg-purple-900/30 border border-purple-800' : 'bg-purple-50 border border-purple-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Clock className={`w-4 h-4 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                      <span className={`text-sm ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>Tempo de leitura</span>
                    </div>
                    <span className={`font-bold ${darkMode ? 'text-purple-200' : 'text-purple-800'}`}>
                      {stats.readingTime} min
                    </span>
                  </div>
                </div>
              </div>

              {/* Saved Notes */}
              {showSavedNotes && (
                <div className={`${
                  darkMode ? 'bg-gray-800/80' : 'bg-white/80'
                } backdrop-blur-sm rounded-2xl shadow-xl p-6 border ${
                  darkMode ? 'border-gray-700/20' : 'border-white/20'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <FileText className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                      <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        Notas Salvas
                      </h3>
                    </div>
                    <button
                      onClick={() => setShowSavedNotes(false)}
                      className={`p-1 rounded-lg transition-colors ${
                        darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                      }`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {savedNotes.length === 0 ? (
                      <p className={`text-sm text-center py-8 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Nenhuma nota salva ainda
                      </p>
                    ) : (
                      savedNotes.map((note) => (
                        <div
                          key={note.id}
                          className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                            currentNoteId === note.id
                              ? darkMode 
                                ? 'bg-blue-900/30 border-blue-700' 
                                : 'bg-blue-50 border-blue-200'
                              : darkMode 
                                ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700' 
                                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                          }`}
                          onClick={() => loadNote(note)}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className={`font-medium text-sm truncate ${
                              darkMode ? 'text-gray-200' : 'text-gray-800'
                            }`}>
                              {note.title}
                            </h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNote(note.id);
                              }}
                              className={`p-1 rounded transition-colors ${
                                darkMode ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-100 text-red-500'
                              }`}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                          
                          <div className={`text-xs space-y-1 ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            <div className="flex items-center justify-between">
                              <span>{note.wordCount} palavras</span>
                              <span>{note.readingTime} min</span>
                            </div>
                            <div>
                              Atualizado: {formatTime(note.updatedAt)}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Focus Mode Toggle */}
        {focusMode && (
          <div className="fixed top-4 right-4 z-50">
            <button
              onClick={() => setFocusMode(false)}
              className={`p-3 rounded-full shadow-lg transition-all duration-200 ${
                darkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' 
                  : 'bg-white hover:bg-gray-50 text-gray-700'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WritingTool;