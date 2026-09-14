import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Mic, Play, Square, Sparkles, X, ChevronUp, ChevronDown, Check, UserCheck } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface AudioTourTopic {
    id: string;
    title: string;
    text: string;
}

const TOUR_TOPICS: AudioTourTopic[] = [
    {
        id: 'welcome',
        title: 'Firm Welcome & Overview',
        text: 'Welcome to S N Associates & Co. We are your dedicated Chartered Accountants, tax strategists, and corporate legal partners based in Bangalore. Whether you are launching a startup, filing complex GST and Income Tax returns, or seeking statutory compliance under the DPDP Act, our team is here to protect and grow your venture.'
    },
    {
        id: 'incorporation',
        title: 'Company Registration & Startups',
        text: 'Looking to register your business? We handle Private Limited Company registration, LLP incorporation, and Proprietorship setup end-to-end, including PAN, TAN, GST, and MSME Udyam registration within five to seven business days.'
    },
    {
        id: 'tax',
        title: 'Income Tax & GST Advisory',
        text: 'Stay 100% compliant with zero notice risk. Our senior partners handle Advance Tax computations, corporate audits, GST return filings, and dispute representation before appellate authorities.'
    },
    {
        id: 'resources',
        title: 'Free Calculators & E-Books',
        text: 'Visit our Resources hub to access our interactive Income Tax Calculator comparing the New versus Old tax regimes, download free compliance calendars, or get our comprehensive business formation e-books.'
    }
];

// Curated list of known high-quality female speech synthesis voice names
const PREFERRED_FEMALE_VOICES = [
    'hazel',      // Microsoft Hazel (en-GB, female) - Warm, crisp, human-like
    'susan',      // Microsoft Susan (en-GB, female)
    'jenny',      // Microsoft Jenny (en-US, Natural female)
    'aria',       // Microsoft Aria (en-US, Natural female)
    'neerja',     // Microsoft Neerja (en-IN, Natural female)
    'heera',      // Microsoft Heera (en-IN, female)
    'zira',       // Microsoft Zira (en-US, female)
    'samantha',   // Apple Samantha (en-US, female)
    'karen',      // Apple Karen (en-AU, female)
    'victoria',   // Apple Victoria (en-US, female)
    'moira',      // Apple Moira (en-IE, female)
    'tessa',      // Apple Tessa (en-ZA, female)
    'fiona',      // Apple Fiona (en-GB, female)
    'google uk english female',
    'google us english female',
    'google español'
];

const KNOWN_MALE_VOICE_NAMES = [
    'david', 'george', 'ravi', 'mark', 'richard', 'james', 'guy', 'stefan', 'male'
];

const VoiceAssistant: React.FC = () => {
    const [isSupported, setIsSupported] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [currentTopic, setCurrentTopic] = useState<string>('welcome');
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeVoiceName, setActiveVoiceName] = useState<string>('Detecting female voice...');
    const [voicesList, setVoicesList] = useState<SpeechSynthesisVoice[]>([]);
    const location = useLocation();
    const synthRef = useRef<SpeechSynthesis | null>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Pick best female voice with human-like timbre
    const selectFemaleVoice = useCallback((voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
        if (!voices || voices.length === 0) return null;

        // 1. Check for preferred female voice names in English
        for (const prefName of PREFERRED_FEMALE_VOICES) {
            const match = voices.find(v => v.name.toLowerCase().includes(prefName));
            if (match) return match;
        }

        // 2. Check for explicit "female" or "woman" in voice name
        const femaleMatch = voices.find(v => 
            v.lang.startsWith('en') && /female|woman/i.test(v.name)
        );
        if (femaleMatch) return femaleMatch;

        // 3. Filter English voices excluding known male names
        const nonMaleEnglish = voices.filter(v => 
            v.lang.startsWith('en') && !KNOWN_MALE_VOICE_NAMES.some(m => v.name.toLowerCase().includes(m))
        );
        if (nonMaleEnglish.length > 0) return nonMaleEnglish[0];

        // 4. Any English voice fallback
        const anyEnglish = voices.find(v => v.lang.startsWith('en'));
        return anyEnglish || voices[0] || null;
    }, []);

    // Load available voices (handles asynchronous loading in Chromium)
    const loadVoices = useCallback(() => {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
        const available = window.speechSynthesis.getVoices();
        if (available && available.length > 0) {
            setVoicesList(available);
            const best = selectFemaleVoice(available);
            if (best) {
                // Prettify voice name for display
                const cleanName = best.name.replace(/Microsoft|Google|Desktop|Natural|Online|\(.*?\)/gi, '').trim();
                setActiveVoiceName(`${cleanName || best.name} (Female)`);
            }
        }
    }, [selectFemaleVoice]);

    // Initialize speech synthesis and load preferences
    useEffect(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            synthRef.current = window.speechSynthesis;
            setIsSupported(true);

            loadVoices();

            // Chromium fires voiceschanged event asynchronously
            if (window.speechSynthesis.onvoiceschanged !== undefined) {
                window.speechSynthesis.onvoiceschanged = loadVoices;
            }

            // Retry after short delay in case voices take time to initialize
            const timer = setTimeout(loadVoices, 300);

            // Load mute preference
            const savedMute = localStorage.getItem('sn_voice_assistant_muted');
            if (savedMute === 'true') {
                setIsMuted(true);
            }

            return () => {
                clearTimeout(timer);
                if (synthRef.current) {
                    synthRef.current.cancel();
                }
            };
        }
    }, [loadVoices]);

    // Chromium keep-alive heartbeat: prevents long speech utterances from pausing unexpectedly
    useEffect(() => {
        if (!isSpeaking) return;

        const heartbeat = setInterval(() => {
            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                if (window.speechSynthesis.speaking) {
                    window.speechSynthesis.pause();
                    window.speechSynthesis.resume();
                }
            }
        }, 10000);

        return () => clearInterval(heartbeat);
    }, [isSpeaking]);

    const speakText = (text: string, topicId?: string) => {
        if (!synthRef.current || isMuted) return;

        // Cancel previous speech
        synthRef.current.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utteranceRef.current = utterance; // Keep reference to prevent GC in Chrome

        // Human-like vocal acoustics: slightly relaxed rate, warm natural pitch
        utterance.rate = 0.92;
        utterance.pitch = 1.05;

        const voices = voicesList.length > 0 ? voicesList : synthRef.current.getVoices();
        const selectedVoice = selectFemaleVoice(voices);
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        utterance.onstart = () => {
            setIsSpeaking(true);
            if (topicId) setCurrentTopic(topicId);
        };

        utterance.onend = () => {
            setIsSpeaking(false);
            utteranceRef.current = null;
        };

        utterance.onerror = (e) => {
            // Ignore interruption errors when user clicks stop or new topic
            if (e.error !== 'interrupted' && e.error !== 'canceled') {
                console.warn('Speech synthesis notice:', e.error);
            }
            setIsSpeaking(false);
            utteranceRef.current = null;
        };

        // Extra resume call before speak to wake up suspended audio contexts in Chrome
        synthRef.current.resume();
        synthRef.current.speak(utterance);
    };

    const stopSpeaking = () => {
        if (synthRef.current) {
            synthRef.current.cancel();
            setIsSpeaking(false);
            utteranceRef.current = null;
        }
    };

    const toggleMute = () => {
        const newMuted = !isMuted;
        setIsMuted(newMuted);
        localStorage.setItem('sn_voice_assistant_muted', newMuted ? 'true' : 'false');
        if (newMuted) {
            stopSpeaking();
        } else {
            speakText('Hello! Audio voice guide is active. You can select any topic to listen.');
        }
    };

    const handleTopicClick = (topic: AudioTourTopic) => {
        if (isMuted) {
            setIsMuted(false);
            localStorage.setItem('sn_voice_assistant_muted', 'false');
        }
        speakText(topic.text, topic.id);
    };

    const playVoiceSample = () => {
        if (isMuted) {
            setIsMuted(false);
            localStorage.setItem('sn_voice_assistant_muted', 'false');
        }
        speakText(
            'Hello! I am your AI client advisor at S N Associates & Co. I will guide you through our corporate tax, startup incorporation, and statutory compliance services.',
            'sample'
        );
    };

    if (!isSupported) return null;

    return (
        <div className="fixed bottom-24 left-4 z-40 select-none">
            {/* Expanded Audio Tour Card */}
            {isExpanded && (
                <div className="mb-3 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-slate-200 w-80 sm:w-88 animate-in slide-in-from-bottom-3 duration-200">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
                                <Mic size={15} />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-900">Audio Voice Guide</h4>
                                <p className="text-[10px] text-slate-400">Interactive spoken walkthrough</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
                        >
                            <X size={15} />
                        </button>
                    </div>

                    {/* Active Female Voice Status Pill */}
                    <div className="mt-2.5 px-2.5 py-1.5 bg-purple-50 border border-purple-100 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-1.5 overflow-hidden">
                            <Sparkles size={12} className="text-purple-600 shrink-0" />
                            <span className="text-[10px] font-semibold text-purple-900 truncate">
                                Voice: {activeVoiceName}
                            </span>
                        </div>
                        <button
                            onClick={playVoiceSample}
                            className="text-[10px] font-bold text-purple-700 hover:text-purple-900 bg-white px-2 py-0.5 rounded-lg border border-purple-200 shadow-2xs shrink-0 transition hover:bg-purple-100"
                        >
                            Test Voice
                        </button>
                    </div>

                    <div className="mt-3 space-y-1.5 max-h-56 overflow-y-auto pr-1">
                        {TOUR_TOPICS.map((topic) => (
                            <button
                                key={topic.id}
                                onClick={() => handleTopicClick(topic)}
                                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition ${
                                    isSpeaking && currentTopic === topic.id
                                        ? 'bg-blue-600 text-white font-semibold shadow-sm'
                                        : 'hover:bg-slate-100 text-slate-700 font-medium'
                                }`}
                            >
                                <span className="line-clamp-1">{topic.title}</span>
                                {isSpeaking && currentTopic === topic.id ? (
                                    <span className="flex gap-0.5 items-end h-3">
                                        <span className="w-0.5 h-3 bg-white animate-pulse"></span>
                                        <span className="w-0.5 h-2 bg-white animate-pulse delay-75"></span>
                                        <span className="w-0.5 h-3 bg-white animate-pulse delay-150"></span>
                                    </span>
                                ) : (
                                    <Play size={11} className="text-slate-400 shrink-0 ml-2" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Mute & Control Bar */}
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <button
                            onClick={toggleMute}
                            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition ${
                                isMuted
                                    ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            }`}
                        >
                            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                            <span>{isMuted ? 'Muted (OFF)' : 'Sound (ON)'}</span>
                        </button>

                        {isSpeaking ? (
                            <button
                                onClick={stopSpeaking}
                                className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition"
                            >
                                <Square size={12} className="fill-current" />
                                <span>Stop</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => handleTopicClick(TOUR_TOPICS[0])}
                                className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl transition"
                            >
                                <Play size={12} className="fill-current" />
                                <span>Play Intro</span>
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Always-Visible Compact Pill / Floating Trigger */}
            <div className="flex items-center gap-1.5 bg-slate-900/90 hover:bg-slate-900 text-white backdrop-blur-md px-3 py-2 rounded-full shadow-lg border border-slate-700 transition-all hover:scale-105 active:scale-95 group">
                <button
                    onClick={toggleMute}
                    title={isMuted ? "Unmute Voice Guide" : "Mute Voice Guide"}
                    className={`p-1 rounded-full transition ${
                        isMuted 
                            ? 'text-rose-400 hover:text-rose-300' 
                            : 'text-emerald-400 hover:text-emerald-300'
                    }`}
                >
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>

                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-1.5 text-xs font-medium pl-1 pr-1.5"
                >
                    {isSpeaking ? (
                        <span className="flex items-center gap-1 text-blue-400 font-semibold">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            <span>Speaking...</span>
                        </span>
                    ) : (
                        <span className="text-slate-200 group-hover:text-white">
                            {isMuted ? 'Voice Off' : 'Voice Guide'}
                        </span>
                    )}
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                </button>
            </div>
        </div>
    );
};

export default VoiceAssistant;
