import React, { useState, useRef, useEffect } from 'react';
import { aiService } from '../api/services';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  X,
  Send,
  BookOpen,
  ShieldCheck,
  User,
  ExternalLink,
  ChevronRight,
  Bot
} from 'lucide-react';

const SUGGESTIONS = [
  "What should I eat for dinner tonight?",
  "Suggest healthy foods for skin wellness and glow",
  "I only have eggs, tomatoes, and rice at home",
  "High-protein vegetarian snacks under ₹50",
  "What should I eat before and after exercise?"
];

export default function AskAIAssistantDrawer({ isOpen, onClose }) {
  const { profile } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I'm **Ask HealthFeast ✨**, your personalized Indian nutrition and wellness advisor.\n\nI'm factoring in your profile (${profile?.diet_type || 'Vegetarian'}, goal: ${profile?.fitness_goal || 'Wellness'}, budget: ₹${profile?.daily_budget_inr || 250}/day) along with authoritative ICMR-NIN & WHO dietary guidelines.\n\nHow can I help nourish you today?`,
      sources: []
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (queryToSend) => {
    const q = queryToSend || inputQuery;
    if (!q.trim() || loading) return;

    const userMsg = { role: 'user', content: q.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.content
      }));
      const data = await aiService.chat(q.trim(), historyPayload);
      const assistantMsg = {
        role: 'assistant',
        content: data.response,
        sources: data.sources || [],
        citations: data.citations || '',
        model: data.model_used
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I apologize, but I encountered an error retrieving this guidance. Please check your network connection or try again.',
          sources: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.45)',
      backdropFilter: 'blur(6px)',
      zIndex: 1200,
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '520px',
        height: '100%',
        background: '#ffffff',
        boxShadow: '-10px 0 35px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, #f5f3ff 0%, #ecfdf5 100%)',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #10b981 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
            }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e1b4b' }}>
                Ask HealthFeast ✨
              </h3>
              <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={13} />
                <span>Context-Aware & ICMR-Grounded</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* User Context Bar */}
        <div style={{
          padding: '10px 20px',
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          fontSize: '0.75rem',
          color: '#475569'
        }}>
          <span style={{ fontWeight: 600, color: '#0f172a' }}>Active Context:</span>
          <span style={{ background: '#e2e8f0', padding: '2px 8px', borderRadius: '6px' }}>
            {profile?.diet_type || 'Vegetarian'}
          </span>
          <span style={{ background: '#e2e8f0', padding: '2px 8px', borderRadius: '6px' }}>
            ₹{profile?.daily_budget_inr || 250}/day
          </span>
          <span style={{ background: '#e2e8f0', padding: '2px 8px', borderRadius: '6px' }}>
            {profile?.fitness_goal?.replace('_', ' ') || 'Wellness'}
          </span>
        </div>

        {/* Chat Messages Body */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {messages.map((m, idx) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: isUser ? 'flex-end' : 'flex-start',
                  gap: '10px'
                }}
              >
                {!isUser && (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    background: '#8b5cf6',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    <Bot size={18} />
                  </div>
                )}
                <div style={{
                  maxWidth: '85%',
                  background: isUser ? '#10b981' : '#f8fafc',
                  color: isUser ? '#ffffff' : '#1e293b',
                  borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  padding: '14px 16px',
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  border: isUser ? 'none' : '1px solid #e2e8f0',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                }}>
                  <div style={{ whiteSpace: 'pre-line' }}>{m.content}</div>

                  {/* Sources Grounding Tag */}
                  {m.sources && m.sources.length > 0 && (
                    <div style={{
                      marginTop: '12px',
                      paddingTop: '10px',
                      borderTop: '1px solid #e2e8f0',
                      fontSize: '0.75rem',
                      color: '#64748b'
                    }}>
                      <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                        <BookOpen size={12} color="#059669" />
                        <span>Authoritative Grounding:</span>
                      </div>
                      {m.sources.map((s, sIdx) => (
                        <div key={sIdx} style={{ marginBottom: '2px' }}>
                          • {s.source} ({s.publication_date}): <em>{s.document_title}</em>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: '#8b5cf6' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: '#8b5cf6',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sparkles size={16} />
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                Synthesizing personalized advice...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Quick Pills */}
        <div style={{
          padding: '8px 16px',
          background: '#ffffff',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}>
          {SUGGESTIONS.map((sug, i) => (
            <button
              key={i}
              onClick={() => handleSend(sug)}
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#475569',
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
                borderRadius: '999px',
                padding: '6px 12px',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div style={{
          padding: '16px 20px',
          background: '#ffffff',
          borderTop: '1px solid #e2e8f0'
        }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{ display: 'flex', gap: '10px' }}
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything (e.g., 'What can I cook with dal & rice?')..."
              className="input-field"
              style={{ fontSize: '0.9rem', padding: '12px 14px' }}
            />
            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="btn btn-ai"
              style={{ padding: '0 18px', borderRadius: '12px' }}
            >
              <Send size={18} />
            </button>
          </form>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', textAlign: 'center', marginTop: '8px' }}>
            HealthFeast AI provides educational wellness guidance. Does not diagnose or prescribe treatment.
          </div>
        </div>
      </div>
    </div>
  );
}
