import React, { useState, useRef, useEffect } from 'react'
import { useConversation } from '@elevenlabs/react'
import { Mic, MicOff, Volume2 } from 'lucide-react'

function App() {
  const [isActive, setIsActive] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const agentId = "your-agent-id-here"

  const conversation = useConversation({
    onMessage: (msg) => {
      setIsSpeaking(true)
      setTimeout(() => setIsSpeaking(false), 2000)
    }
  })

  const startConversation = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      await conversation.startSession({
        agentId: agentId,
        connectionType: 'webrtc',
        userId: 'user1'
      })
      setIsActive(true)
    } catch (error) {
      console.error('Error starting conversation:', error)
    }
  }

  const stopConversation = () => {
    conversation.endSession()
    setIsActive(false)
  }

  useEffect(() => {
    // Auto-scroll removed since no chat messages
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #4c1d95 0%, #312e81 50%, #1e3a8a 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none'
      }}>
        <div style={{
          position: 'absolute',
          width: '384px',
          height: '384px',
          background: '#a855f7',
          borderRadius: '50%',
          mixBlendMode: 'multiply',
          filter: 'blur(60px)',
          opacity: 0.2,
          top: 0,
          left: '-192px',
          animation: 'blob 7s infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          width: '384px',
          height: '384px',
          background: '#3b82f6',
          borderRadius: '50%',
          mixBlendMode: 'multiply',
          filter: 'blur(60px)',
          opacity: 0.2,
          top: 0,
          right: '-192px',
          animation: 'blob 7s infinite',
          animationDelay: '2s'
        }}></div>
        <div style={{
          position: 'absolute',
          width: '384px',
          height: '384px',
          background: '#6366f1',
          borderRadius: '50%',
          mixBlendMode: 'multiply',
          filter: 'blur(60px)',
          opacity: 0.2,
          bottom: 0,
          left: '50%',
          animation: 'blob 7s infinite',
          animationDelay: '4s'
        }}></div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .slide-in {
          animation: slideIn 0.4s ease-out;
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.7; }
          100% { transform: scale(0.95); opacity: 1; }
        }
        .pulse-ring {
          animation: pulse-ring 2s ease-in-out infinite;
        }
        @keyframes wave {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(1); }
        }
        .wave-bar {
          animation: wave 1s ease-in-out infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .blink {
          animation: blink 1.5s ease-in-out infinite;
        }
      `}</style>

      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '672px'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: '12px',
            letterSpacing: '-0.025em',
            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
            margin: '0 0 12px 0'
          }}>
            VoiceRag
          </h1>
          <p style={{
            color: '#c7d2fe',
            fontSize: '18px',
            margin: 0
          }}>Interact with your Knowledge Base</p>
        </div>

        {/* Central Avatar/Visualizer */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '32px'
        }}>
          <div style={{ position: 'relative' }}>
            {/* Outer pulsing ring */}
            {isActive && (
              <div className="pulse-ring" style={{
                position: 'absolute',
                inset: 0,
                padding: '20px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #a855f7, #3b82f6)',
                opacity: 0.3,
                pointerEvents: 'none'
              }}></div>
            )}
            
            {/* Main avatar circle */}
            <div style={{
              position: 'relative',
              width: '128px',
              height: '128px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 50%, #3b82f6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)',
              transition: 'transform 0.3s ease',
              transform: isActive ? 'scale(1.1)' : 'scale(1)'
            }}>
              {isActive ? (
                isSpeaking ? (
                  <div style={{
                    display: 'flex',
                    gap: '4px',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="wave-bar"
                        style={{
                          width: '4px',
                          height: '24px',
                          background: '#ffffff',
                          borderRadius: '9999px',
                          animationDelay: `${i * 0.1}s`
                        }}
                      ></div>
                    ))}
                  </div>
                ) : (
                  <Mic size={48} color="#ffffff" />
                )
              ) : (
                <Volume2 size={48} color="rgba(255,255,255,0.5)" />
              )}
            </div>
          </div>
        </div>

        {/* Control button */}
        <div style={{
          display: 'flex',
          justifyContent: 'center'
        }}>
          {!isActive ? (
            <button
              onClick={startConversation}
              style={{
                position: 'relative',
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #a855f7, #3b82f6)',
                color: '#ffffff',
                fontWeight: '600',
                borderRadius: '9999px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
                transform: 'scale(1)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)'
                e.currentTarget.style.background = 'linear-gradient(135deg, #9333ea, #2563eb)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.background = 'linear-gradient(135deg, #a855f7, #3b82f6)'
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            >
              <Mic size={24} />
              <span>Start Conversation</span>
            </button>
          ) : (
            <button
              onClick={stopConversation}
              style={{
                position: 'relative',
                padding: '16px 32px',
                background: '#ef4444',
                color: '#ffffff',
                fontWeight: '600',
                borderRadius: '9999px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
                transform: 'scale(1)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)'
                e.currentTarget.style.background = '#dc2626'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.background = '#ef4444'
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            >
              <MicOff size={24} />
              <span>End Conversation</span>
            </button>
          )}
        </div>

        {/* Status indicator */}
        {isActive && (
          <div style={{
            textAlign: 'center',
            marginTop: '24px'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(4px)',
              padding: '8px 16px',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div className="blink" style={{
                width: '8px',
                height: '8px',
                background: '#34d399',
                borderRadius: '50%'
              }}></div>
              <span style={{
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '500'
              }}>Listening...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App