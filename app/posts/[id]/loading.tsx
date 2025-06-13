import React from "react";

export default function Loading() {
  return (
    <main style={{ padding: 32 }}>
      <div style={{ 
        height: '40px', 
        width: '70%', 
        backgroundColor: '#e0e0e0', 
        borderRadius: '4px',
        marginBottom: '16px',
        animation: 'pulse 1.5s infinite'
      }} />
      <div style={{ 
        height: '20px', 
        width: '40%', 
        backgroundColor: '#e0e0e0', 
        borderRadius: '4px',
        marginBottom: '24px',
        animation: 'pulse 1.5s infinite'
      }} />
      <div style={{ 
        height: '120px', 
        width: '100%', 
        backgroundColor: '#e0e0e0', 
        borderRadius: '4px',
        marginBottom: '32px',
        animation: 'pulse 1.5s infinite'
      }} />
      <hr />
      <div style={{ 
        height: '30px', 
        width: '30%', 
        backgroundColor: '#e0e0e0', 
        borderRadius: '4px',
        marginBottom: '24px',
        animation: 'pulse 1.5s infinite'
      }} />
      <div style={{ 
        height: '80px', 
        width: '100%', 
        backgroundColor: '#e0e0e0', 
        borderRadius: '4px',
        marginBottom: '16px',
        animation: 'pulse 1.5s infinite'
      }} />
      <div style={{ 
        height: '80px', 
        width: '100%', 
        backgroundColor: '#e0e0e0', 
        borderRadius: '4px',
        marginBottom: '16px',
        animation: 'pulse 1.5s infinite'
      }} />
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 0.8; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </main>
  );
} 