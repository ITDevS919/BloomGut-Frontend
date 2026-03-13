import { useState, useEffect, useRef } from "react";
import { ChevronLeft, Mic } from "lucide-react";
import { FaMicrophone } from "react-icons/fa6";

const FoodRecord = (props) => {
  const [state, setState] = useState("idle"); // idle, listening, processing, error, complete
  const [waveformData, setWaveformData] = useState([]);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const animationRef = useRef(null);
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);

  // Check if browser supports speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
  }, []);

  // Initialize audio context for real waveform visualization
  useEffect(() => {
    if (state === "listening" || state === "processing") {
      const initAudioContext = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const analyser = audioContext.createAnalyser();
          const microphone = audioContext.createMediaStreamSource(stream);
          
          analyser.fftSize = 256;
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          
          microphone.connect(analyser);
          
          audioContextRef.current = audioContext;
          analyserRef.current = analyser;
          dataArrayRef.current = dataArray;
          
          const updateWaveform = () => {
            if (analyserRef.current && dataArrayRef.current) {
              analyserRef.current.getByteFrequencyData(dataArrayRef.current);
              
              // Convert to visual bars (21 bars)
              const bars = [];
              const step = Math.floor(bufferLength / 21);
              for (let i = 0; i < 21; i++) {
                const value = dataArrayRef.current[i * step];
                bars.push((value / 255) * 80 + 20); // Scale to 20-100%
              }
              setWaveformData(bars);
              
              if (state === "listening" || state === "processing") {
                requestAnimationFrame(updateWaveform);
              }
            }
          };
          
          updateWaveform();
        } catch (error) {
          console.error("Error accessing microphone:", error);
          setState("error");
        }
      };
      
      initAudioContext();
      
      return () => {
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
      };
    }
  }, [state]);

  // Initialize speech recognition
  const startRecognition = () => {
    if (!isSupported) {
      setState("error");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US'; // Change to your preferred language
    
    recognition.onstart = () => {
      setState("listening");
      setTranscript("");
    };
    
    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const piece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += piece + ' ';
        } else {
          interimTranscript += piece;
        }
      }

      const combined = (finalTranscript || interimTranscript).trim();
      setTranscript(combined);

      // If we have a final transcript, automatically stop recording
      // and return to diet record with the recognized text.
      if (finalTranscript.trim()) {
        setState("complete");
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        if (combined) {
          props.setRecordUI("diet record");
          props.setRecordResult(combined);
        }
      }
    };
    
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      
      if (event.error === 'no-speech') {
        // User didn't speak, wait a bit more or show error
        setTimeout(() => {
          if (state === "listening") {
            setState("error");
            recognition.stop();
          }
        }, 2000);
      } else if (event.error === 'audio-capture') {
        setState("error");
        recognition.stop();
      } else if (event.error === 'not-allowed') {
        setState("error");
        recognition.stop();
      } else {
        setState("error");
        recognition.stop();
      }
    };
    
    recognition.onend = () => {
      if (state === "listening" || state === "processing") {
        if (transcript.trim()) {
          setState("complete");
        } else {
          setState("error");
        }
      }
    };
    
    recognitionRef.current = recognition;
    
    try {
      recognition.start();
    } catch (error) {
      console.error("Error starting recognition:", error);
      setState("error");
    }
  };

  const handleMicClick = () => {
    if (state === "idle" || state === "error") {
      if (!isSupported) {
        setState("error");
        return;
      }
      startRecognition();
    }
  };

  const handleTryAgain = () => {
    setState("idle");
    setTranscript("");
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleStop = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (state === "listening" || state === "processing") {
      if (transcript.trim()) {
        setState("complete");
        props.setRecordUI("diet record");
        props.setRecordResult(transcript);
      } else {
        setState("error");
      }
    }
  };

  const handleBack = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    props.setRecordUI("diet record");
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="bg-ivory min-h-full p-6 text-primary flex flex-col">
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          className="text-primary text-xl leading-none"
          aria-label="back"
          onClick={handleBack}
        >
          <ChevronLeft className="text-primary text-[40px] leading-none cursor-pointer " />
        </button>
        <h2 className="text-lg font-['Noto_Sans_TC', sans-serif]">Food Record</h2>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center mt-32">
        {/* Idle State */}
        {state === "idle" && (
          <div className="flex flex-col items-center">
            {!isSupported && (
              <p className="text-sm text-red-500 mb-4">
                Speech recognition is not supported in your browser
              </p>
            )}
            <button
              onClick={handleMicClick}
              className="w-32 h-32 rounded-full flex items-center justify-center mb-8 shadow-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#ab91d0' }}
              aria-label="Start voice input"
              disabled={!isSupported}
            >
              <FaMicrophone className="w-16 h-16 text-white" />
            </button>
            <div className="text-center space-y-2">
              <p className="text-lg font-medium" style={{ color: '#5d4037' }}>Tap the mic to start</p>
              <p className="text-sm" style={{ color: '#705d56' }}>Start voice input</p>
              <p className="text-sm" style={{ color: '#705d56' }}>Say what you ate today</p>
            </div>
          </div>
        )}

        {/* Listening/Processing State - First Image */}
        {(state === "listening" || state === "processing") && (
          <div className="flex flex-col items-center w-full">
            <div className="relative mb-6">
              {/* Concentric rings - animated pulsing */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-pink-200 opacity-60 animate-ping" style={{ animationDuration: '1.5s' }}></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-28 h-28 rounded-full bg-pink-300 opacity-50 animate-ping" style={{ animationDuration: '1.2s', animationDelay: '0.3s' }}></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-pink-400 opacity-40 animate-ping" style={{ animationDuration: '1s', animationDelay: '0.6s' }}></div>
              </div>
              {/* Purple circle with mic */}
              <div className="relative w-32 h-32 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#b3a2d0' }}>
                <Mic className="w-16 h-16 text-white" />
              </div>
            </div>
            
            <p className="text-base font-medium mb-1 text-secondary">Listening...</p>
            <p className="text-sm mb-6 text-secondary">Voice input in progress...</p>

            {/* Separator */}
            <div className="w-full border-t mb-6" style={{ borderColor: '#d1d5db' }}></div>

            {/* Waveform visualization */}
            <div className="flex items-end justify-center gap-1 h-20 mb-6">
              {waveformData.length > 0 ? (
                waveformData.map((height, idx) => (
                  <div
                    key={idx}
                    className="rounded-t"
                    style={{
                      width: '6px',
                      height: `${height}%`,
                      minHeight: '4px',
                      backgroundColor: '#b3a2d0',
                    }}
                  />
                ))
              ) : (
                // Fallback static waveform when no data
                Array.from({ length: 21 }).map((_, idx) => {
                  const center = 10;
                  const distance = Math.abs(idx - center);
                  const height = Math.max(20, 60 - distance * 3);
                  return (
                    <div
                      key={idx}
                      className="rounded-t"
                      style={{
                        width: '6px',
                        height: `${height}%`,
                        minHeight: '4px',
                        backgroundColor: '#b3a2d0',
                      }}
                    />
                  );
                })
              )}
            </div>

            <p className="text-sm text-secondary  mb-1">Recognizing speech...</p>
            <p className="text-sm text-secondary">Converting to text...</p>
          </div>
        )}

        {/* Error State */}
        {state === "error" && (
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-[#f66] flex items-center justify-center mb-8 shadow-lg relative">
              <Mic className="w-16 h-16 text-white" />
              {/* Diagonal line across microphone */}
              <div 
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  transform: 'rotate(45deg)',
                }}
              >
                <div className="w-20 h-0.5 bg-white"></div>
              </div>
            </div>
            <p className="text-lg font-medium mb-6" style={{ color: '#5d4037' }}>Sorry. Voice Not</p>
            <button
              onClick={handleTryAgain}
              className="px-8 py-3 border rounded-[24px] shadow-[0_2px_8px_rgba(0,0,0,0.12)] bg-white font-medium mb-6 hover:opacity-90 transition-opacity"
            >
              Try Again
            </button>
            <p className="text-sm text-custom-12">Please Speak in a Quiet</p>
          </div>
        )}

        {/* Complete State - Second Image */}
        {state === "complete" && (
          <div className="flex flex-col items-center w-full">
            <div className="relative mb-6">
              {/* Concentric rings - static (no animation) */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-pink-200 opacity-60"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-28 h-28 rounded-full bg-pink-300 opacity-50"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-pink-400 opacity-40"></div>
              </div>
              {/* Purple circle with mic */}
              <div className="relative w-32 h-32 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#ab91d0' }}>
                <Mic className="w-16 h-16 text-white" />
              </div>
            </div>
            
            <p className="text-base font-medium mb-6" style={{ color: '#030303' }}>Listening...</p>

            {/* Waveform visualization */}
            <div className="flex items-end justify-center gap-1 h-20 mb-6">
              {waveformData.length > 0 ? (
                waveformData.map((height, idx) => (
                  <div
                    key={idx}
                    className="rounded-t"
                    style={{
                      width: '6px',
                      height: `${height}%`,
                      minHeight: '4px',
                      backgroundColor: '#b3a2d0',
                    }}
                  />
                ))
              ) : (
                // Fallback static waveform when no data
                Array.from({ length: 21 }).map((_, idx) => {
                  const center = 10;
                  const distance = Math.abs(idx - center);
                  const height = Math.max(20, 60 - distance * 3);
                  return (
                    <div
                      key={idx}
                      className="rounded-t"
                      style={{
                        width: '6px',
                        height: `${height}%`,
                        minHeight: '4px',
                        backgroundColor: '#b3a2d0',
                      }}
                    />
                  );
                })
              )}
            </div>

            <p className="text-sm text-secondary">Voice input complete, press back</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodRecord;