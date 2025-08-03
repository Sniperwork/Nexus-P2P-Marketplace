import { useState, useEffect, useMemo } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Panel,
  Button,
  TextField,
  FieldSet,
} from 'nexus-module';

// Access NEXUS utilities from the global object
const { 
  utilities: {
    confirm,
    apiCall,
    secureApiCall,
    showErrorDialog,
    showSuccessDialog,
    showNotification
  }
} = NEXUS;

// Advanced Animation System for Modern Dark Theme
const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const glow = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-3px);
  }
`;

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 5px rgba(139, 92, 246, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.6), 0 0 40px rgba(139, 92, 246, 0.3);
  }
`;

const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

import {
  setActiveTab,
  updateProfileForm,
  updateSessionForm,
  setUserProfile,
  setSessionStatus,
} from 'actions/actionCreators';

// Enhanced Modern Dark Theme Components
const DarkContainer = styled.div({
  background: `
    radial-gradient(ellipse at top, rgba(139, 92, 246, 0.15) 0%, transparent 40%),
    radial-gradient(ellipse at bottom right, rgba(6, 182, 212, 0.12) 0%, transparent 40%),
    radial-gradient(ellipse at bottom left, rgba(16, 185, 129, 0.08) 0%, transparent 40%),
    linear-gradient(135deg, #0a0a0f 0%, #111827 25%, #1f2937 50%, #374151 75%, #111827 100%)
  `,
  backgroundSize: '400% 400%',
  animation: `${gradientShift} 20s ease infinite`,
  minHeight: '100vh',
  color: '#f8fafc',
  fontFamily: "'SF Pro Display', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  position: 'relative',
  letterSpacing: '-0.01em',
  fontWeight: 400,
  lineHeight: 1.6,
  '&::before': {
    content: '""',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `
      radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.08) 0%, transparent 30%),
      radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.06) 0%, transparent 30%),
      radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.04) 0%, transparent 40%)
    `,
    pointerEvents: 'none',
    zIndex: 1,
    animation: `${float} 20s ease-in-out infinite`,
  },
  '&::after': {
    content: '""',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'url("data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><circle cx="1" cy="1" r="1" fill="%23ffffff" fill-opacity="0.02"/></svg>") repeat',
    pointerEvents: 'none',
    zIndex: 2,
  },
  // Enhanced scrollbar styles for better visibility
  '& *': {
    scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(0, 212, 170, 0.8) rgba(26, 32, 44, 0.6)',
  },
  '& *::-webkit-scrollbar': {
    width: '12px',
    height: '12px',
  },
  '& *::-webkit-scrollbar-track': {
    background: 'linear-gradient(135deg, rgba(26, 32, 44, 0.8) 0%, rgba(45, 55, 72, 0.6) 100%)',
    borderRadius: '6px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
  },
  '& *::-webkit-scrollbar-thumb': {
    background: 'linear-gradient(135deg, rgba(0, 212, 170, 0.9) 0%, rgba(0, 184, 148, 1) 100%)',
    borderRadius: '6px',
    border: '2px solid rgba(0, 212, 170, 0.4)',
    boxShadow: '0 3px 12px rgba(0, 212, 170, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.2)',
    minHeight: '30px',
  },
  '& *::-webkit-scrollbar-thumb:hover': {
    background: 'linear-gradient(135deg, rgba(0, 245, 184, 1) 0%, rgba(0, 200, 160, 1) 100%)',
    boxShadow: '0 6px 18px rgba(0, 212, 170, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.3)',
    border: '2px solid rgba(0, 245, 184, 0.6)',
  },
  '& *::-webkit-scrollbar-thumb:active': {
    background: 'linear-gradient(135deg, rgba(0, 200, 160, 1) 0%, rgba(0, 170, 140, 1) 100%)',
    boxShadow: '0 2px 8px rgba(0, 212, 170, 0.3)',
  },
  '& *::-webkit-scrollbar-corner': {
    background: 'rgba(26, 32, 44, 0.8)',
  },
});

const NavigationBar = styled.div({
  display: 'flex',
  background: `
    linear-gradient(135deg, 
      rgba(15, 23, 42, 0.90) 0%, 
      rgba(30, 41, 59, 0.85) 25%, 
      rgba(51, 65, 85, 0.80) 50%, 
      rgba(30, 41, 59, 0.85) 75%, 
      rgba(15, 23, 42, 0.90) 100%
    )
  `,
  border: '1px solid rgba(148, 163, 184, 0.08)',
  borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
  backdropFilter: 'blur(24px) saturate(120%)',
  WebkitBackdropFilter: 'blur(24px) saturate(120%)',
  padding: '8px 24px',
  position: 'sticky',
  top: 0,
  zIndex: 1000,
  boxShadow: `
    0 8px 32px rgba(0, 0, 0, 0.5),
    0 1px 0 rgba(255, 255, 255, 0.05) inset,
    0 4px 16px rgba(139, 92, 246, 0.1)
  `,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: `
      linear-gradient(90deg, 
        transparent, 
        rgba(139, 92, 246, 0.6) 20%, 
        rgba(6, 182, 212, 0.6) 50%, 
        rgba(16, 185, 129, 0.6) 80%, 
        transparent
      )
    `,
    animation: `${shimmer} 3s ease-in-out infinite`,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '0%',
    right: '0%',
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent)',
  },
});

const NavTab = styled.button(({ active }) => ({
  background: active 
    ? `
        linear-gradient(135deg, 
          rgba(139, 92, 246, 0.9) 0%, 
          rgba(124, 58, 237, 1) 50%, 
          rgba(139, 92, 246, 0.9) 100%
        )
      `
    : `
        linear-gradient(135deg, 
          rgba(30, 41, 59, 0.4) 0%, 
          rgba(51, 65, 85, 0.2) 100%
        )
      `,
  border: active 
    ? '1px solid rgba(139, 92, 246, 0.4)' 
    : '1px solid rgba(148, 163, 184, 0.1)',
  color: active ? '#ffffff' : '#cbd5e0',
  padding: '14px 24px',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: active ? '600' : '500',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  borderRadius: '16px',
  margin: '8px 4px',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  minWidth: '120px',
  justifyContent: 'center',
  textTransform: 'none',
  letterSpacing: '0.02em',
  backdropFilter: 'blur(16px) saturate(180%)',
  WebkitBackdropFilter: 'blur(16px) saturate(180%)',
  overflow: 'hidden',
  boxShadow: active 
    ? `
        0 8px 32px rgba(139, 92, 246, 0.3),
        0 4px 16px rgba(0, 0, 0, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.1)
      ` 
    : `
        0 4px 16px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.05)
      `,
  animation: active ? `${pulseGlow} 2s ease-in-out infinite` : 'none',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: `
      linear-gradient(90deg, 
        transparent, 
        rgba(255, 255, 255, 0.15), 
        transparent
      )
    `,
    transition: 'left 0.6s ease',
  },
  '&:hover': {
    color: active ? '#ffffff' : '#e2e8f0',
    background: active 
      ? `
          linear-gradient(135deg, 
            rgba(12, 164, 251, 1) 0%, 
            rgba(59, 130, 246, 1) 50%, 
            rgba(12, 164, 251, 1) 100%
          )
        `
      : `
          linear-gradient(135deg, 
            rgba(12, 164, 251, 0.15) 0%, 
            rgba(59, 130, 246, 0.1) 100%
          )
        `,
    transform: 'translateY(-2px) scale(1.02)',
    borderColor: active 
      ? 'rgba(12, 164, 251, 0.6)' 
      : 'rgba(12, 164, 251, 0.3)',
    boxShadow: active 
      ? `
          0 12px 40px rgba(12, 164, 251, 0.4),
          0 6px 20px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.2)
        ` 
      : `
          0 8px 25px rgba(12, 164, 251, 0.2),
          0 4px 12px rgba(0, 0, 0, 0.15)
        `,
    '&::before': {
      left: '100%',
    },
  },
  '&:active': {
    transform: 'translateY(0) scale(0.98)',
  },
  '&::after': active ? {
    content: '""',
    position: 'absolute',
    bottom: '-8px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '50%',
    height: '2px',
    background: `
      linear-gradient(90deg, 
        transparent, 
        rgba(139, 92, 246, 0.8), 
        transparent
      )
    `,
    borderRadius: '2px',
    animation: `${glow} 2s ease-in-out infinite`,
  } : {},
}));

const ContentArea = styled.div({
  padding: '32px',
  maxWidth: '1400px',
  margin: '0 auto',
  height: 'calc(100vh - 120px)',
  overflowY: 'auto',
  overflowX: 'hidden',
  position: 'relative',
  zIndex: 3,
  animation: `${slideIn} 0.6s ease-out`,
});

const Card = styled.div(({ variant = 'default' }) => ({
  background: variant === 'premium'
    ? `
        linear-gradient(135deg, 
          rgba(139, 92, 246, 0.12) 0%, 
          rgba(99, 102, 241, 0.08) 25%, 
          rgba(168, 85, 247, 0.06) 50%, 
          rgba(139, 92, 246, 0.08) 75%, 
          rgba(99, 102, 241, 0.12) 100%
        )
      `
    : variant === 'accent'
    ? `
        linear-gradient(135deg, 
          rgba(6, 182, 212, 0.10) 0%, 
          rgba(14, 165, 233, 0.06) 25%, 
          rgba(59, 130, 246, 0.04) 50%, 
          rgba(14, 165, 233, 0.06) 75%, 
          rgba(6, 182, 212, 0.10) 100%
        )
      `
    : `
        linear-gradient(135deg, 
          rgba(30, 41, 59, 0.40) 0%, 
          rgba(51, 65, 85, 0.25) 25%, 
          rgba(71, 85, 105, 0.15) 50%, 
          rgba(51, 65, 85, 0.25) 75%, 
          rgba(30, 41, 59, 0.40) 100%
        )
      `,
  border: variant === 'premium'
    ? '1px solid rgba(139, 92, 246, 0.25)'
    : variant === 'accent'
    ? '1px solid rgba(6, 182, 212, 0.25)'
    : '1px solid rgba(148, 163, 184, 0.12)',
  borderRadius: '24px',
  padding: '28px',
  margin: '20px 0',
  backdropFilter: 'blur(24px) saturate(200%)',
  WebkitBackdropFilter: 'blur(24px) saturate(200%)',
  boxShadow: variant === 'premium'
    ? `
        0 20px 64px rgba(139, 92, 246, 0.15),
        0 8px 32px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.1),
        inset 0 -1px 0 rgba(139, 92, 246, 0.1)
      `
    : variant === 'accent'
    ? `
        0 20px 64px rgba(6, 182, 212, 0.12),
        0 8px 32px rgba(0, 0, 0, 0.25),
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        inset 0 -1px 0 rgba(6, 182, 212, 0.1)
      `
    : `
        0 16px 48px rgba(0, 0, 0, 0.2),
        0 4px 16px rgba(0, 0, 0, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.06)
      `,
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    borderColor: variant === 'premium'
      ? 'rgba(139, 92, 246, 0.4)'
      : variant === 'accent'
      ? 'rgba(6, 182, 212, 0.4)'
      : 'rgba(148, 163, 184, 0.2)',
    boxShadow: variant === 'premium'
      ? `
          0 24px 80px rgba(139, 92, 246, 0.2),
          0 12px 40px rgba(0, 0, 0, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.15)
        `
      : variant === 'accent'
      ? `
          0 24px 80px rgba(6, 182, 212, 0.15),
          0 12px 40px rgba(0, 0, 0, 0.35),
          inset 0 1px 0 rgba(255, 255, 255, 0.12)
        `
      : `
          0 20px 60px rgba(0, 0, 0, 0.25),
          0 8px 24px rgba(0, 0, 0, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.08)
        `,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: variant === 'premium'
      ? `
          linear-gradient(90deg, 
            transparent, 
            rgba(139, 92, 246, 0.5) 20%, 
            rgba(168, 85, 247, 0.5) 50%, 
            rgba(139, 92, 246, 0.5) 80%, 
            transparent
          )
        `
      : variant === 'accent'
      ? `
          linear-gradient(90deg, 
            transparent, 
            rgba(6, 182, 212, 0.5) 20%, 
            rgba(14, 165, 233, 0.5) 50%, 
            rgba(6, 182, 212, 0.5) 80%, 
            transparent
          )
        `
      : `
          linear-gradient(90deg, 
            transparent, 
            rgba(148, 163, 184, 0.3), 
            transparent
          )
        `,
    borderRadius: '24px 24px 0 0',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: `
      linear-gradient(90deg, 
        transparent, 
        rgba(255, 255, 255, 0.1), 
        transparent
      )
    `,
    borderRadius: '0 0 24px 24px',
  },
}));

const StyledTextField = styled(TextField)(({ variant = 'default' }) => ({
  background: variant === 'premium'
    ? `
        linear-gradient(135deg, 
          rgba(139, 92, 246, 0.18) 0%, 
          rgba(99, 102, 241, 0.15) 50%, 
          rgba(168, 85, 247, 0.12) 100%
        )
      `
    : variant === 'accent'
    ? `
        linear-gradient(135deg, 
          rgba(6, 182, 212, 0.18) 0%, 
          rgba(14, 165, 233, 0.15) 50%, 
          rgba(59, 130, 246, 0.12) 100%
        )
      `
    : variant === 'wallet'
    ? `
        linear-gradient(135deg, 
          rgba(16, 185, 129, 0.18) 0%, 
          rgba(5, 150, 105, 0.15) 50%, 
          rgba(4, 120, 87, 0.12) 100%
        )
      `
    : variant === 'transactions'
    ? `
        linear-gradient(135deg, 
          rgba(245, 158, 11, 0.18) 0%, 
          rgba(217, 119, 6, 0.15) 50%, 
          rgba(180, 83, 9, 0.12) 100%
        )
      `
    : variant === 'accounts'
    ? `
        linear-gradient(135deg, 
          rgba(99, 102, 241, 0.18) 0%, 
          rgba(79, 70, 229, 0.15) 50%, 
          rgba(67, 56, 202, 0.12) 100%
        )
      `
    : variant === 'tokens'
    ? `
        linear-gradient(135deg, 
          rgba(168, 85, 247, 0.18) 0%, 
          rgba(147, 51, 234, 0.15) 50%, 
          rgba(126, 34, 206, 0.12) 100%
        )
      `
    : variant === 'staking'
    ? `
        linear-gradient(135deg, 
          rgba(239, 68, 68, 0.18) 0%, 
          rgba(220, 38, 38, 0.15) 50%, 
          rgba(185, 28, 28, 0.12) 100%
        )
      `
    : variant === 'advanced'
    ? `
        linear-gradient(135deg, 
          rgba(107, 114, 128, 0.18) 0%, 
          rgba(75, 85, 99, 0.15) 50%, 
          rgba(55, 65, 81, 0.12) 100%
        )
      `
    : variant === 'profile'
    ? `
        linear-gradient(135deg, 
          rgba(14, 165, 233, 0.18) 0%, 
          rgba(2, 132, 199, 0.15) 50%, 
          rgba(3, 105, 161, 0.12) 100%
        )
      `
    : variant === 'session'
    ? `
        linear-gradient(135deg, 
          rgba(236, 72, 153, 0.18) 0%, 
          rgba(219, 39, 119, 0.15) 50%, 
          rgba(190, 24, 93, 0.12) 100%
        )
      `
    : `
        linear-gradient(135deg, 
          rgba(30, 41, 59, 0.90) 0%, 
          rgba(51, 65, 85, 0.80) 50%, 
          rgba(71, 85, 105, 0.70) 100%
        )
      `,
  backdropFilter: 'blur(24px) saturate(180%)',
  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
  border: variant === 'premium'
    ? '1px solid rgba(139, 92, 246, 0.25)'
    : variant === 'accent'
    ? '1px solid rgba(6, 182, 212, 0.25)'
    : variant === 'wallet'
    ? '1px solid rgba(16, 185, 129, 0.25)'
    : variant === 'transactions'
    ? '1px solid rgba(245, 158, 11, 0.25)'
    : variant === 'accounts'
    ? '1px solid rgba(99, 102, 241, 0.25)'
    : variant === 'tokens'
    ? '1px solid rgba(168, 85, 247, 0.25)'
    : variant === 'staking'
    ? '1px solid rgba(239, 68, 68, 0.25)'
    : variant === 'advanced'
    ? '1px solid rgba(107, 114, 128, 0.25)'
    : variant === 'profile'
    ? '1px solid rgba(14, 165, 233, 0.25)'
    : variant === 'session'
    ? '1px solid rgba(236, 72, 153, 0.25)'
    : '1px solid rgba(148, 163, 184, 0.18)',
  borderRadius: '16px',
  color: '#f8fafc',
  padding: '18px 24px',
  fontSize: '15px',
  fontWeight: '400',
  width: '100%',
  minWidth: '320px',
  height: '56px',
  marginBottom: '20px',
  boxShadow: variant === 'premium'
    ? `
        0 12px 40px rgba(139, 92, 246, 0.12),
        0 4px 16px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.1),
        inset 0 -1px 0 rgba(139, 92, 246, 0.1)
      `
    : variant === 'accent'
    ? `
        0 12px 40px rgba(6, 182, 212, 0.12),
        0 4px 16px rgba(0, 0, 0, 0.25),
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        inset 0 -1px 0 rgba(6, 182, 212, 0.1)
      `
    : variant === 'wallet'
    ? `
        0 12px 40px rgba(16, 185, 129, 0.12),
        0 4px 16px rgba(0, 0, 0, 0.25),
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        inset 0 -1px 0 rgba(16, 185, 129, 0.1)
      `
    : variant === 'transactions'
    ? `
        0 12px 40px rgba(245, 158, 11, 0.12),
        0 4px 16px rgba(0, 0, 0, 0.25),
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        inset 0 -1px 0 rgba(245, 158, 11, 0.1)
      `
    : variant === 'accounts'
    ? `
        0 12px 40px rgba(99, 102, 241, 0.12),
        0 4px 16px rgba(0, 0, 0, 0.25),
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        inset 0 -1px 0 rgba(99, 102, 241, 0.1)
      `
    : variant === 'tokens'
    ? `
        0 12px 40px rgba(168, 85, 247, 0.12),
        0 4px 16px rgba(0, 0, 0, 0.25),
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        inset 0 -1px 0 rgba(168, 85, 247, 0.1)
      `
    : variant === 'staking'
    ? `
        0 12px 40px rgba(239, 68, 68, 0.12),
        0 4px 16px rgba(0, 0, 0, 0.25),
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        inset 0 -1px 0 rgba(239, 68, 68, 0.1)
      `
    : variant === 'advanced'
    ? `
        0 12px 40px rgba(107, 114, 128, 0.12),
        0 4px 16px rgba(0, 0, 0, 0.25),
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        inset 0 -1px 0 rgba(107, 114, 128, 0.1)
      `
    : variant === 'profile'
    ? `
        0 12px 40px rgba(14, 165, 233, 0.12),
        0 4px 16px rgba(0, 0, 0, 0.25),
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        inset 0 -1px 0 rgba(14, 165, 233, 0.1)
      `
    : variant === 'session'
    ? `
        0 12px 40px rgba(236, 72, 153, 0.12),
        0 4px 16px rgba(0, 0, 0, 0.25),
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        inset 0 -1px 0 rgba(236, 72, 153, 0.1)
      `
    : `
        0 10px 35px rgba(0, 0, 0, 0.35),
        inset 0 1px 0 rgba(255, 255, 255, 0.1),
        inset 0 -1px 0 rgba(148, 163, 184, 0.08)
      `,
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  display: 'block',
  boxSizing: 'border-box',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: variant === 'premium'
      ? `
          linear-gradient(90deg, 
            transparent, 
            rgba(139, 92, 246, 0.6) 30%, 
            rgba(168, 85, 247, 0.6) 70%, 
            transparent
          )
        `
      : variant === 'accent'
      ? `
          linear-gradient(90deg, 
            transparent, 
            rgba(6, 182, 212, 0.6) 30%, 
            rgba(14, 165, 233, 0.6) 70%, 
            transparent
          )
        `
      : `
          linear-gradient(90deg, 
            transparent, 
            rgba(148, 163, 184, 0.4), 
            transparent
          )
        `,
    borderRadius: '16px 16px 0 0',
    animation: `${shimmer} 3s ease-in-out infinite`,
  },
  '&:focus, &:focus-within': {
    borderColor: variant === 'premium'
      ? 'rgba(139, 92, 246, 0.5)'
      : variant === 'accent'
      ? 'rgba(6, 182, 212, 0.5)'
      : variant === 'wallet'
      ? 'rgba(16, 185, 129, 0.5)'
      : variant === 'transactions'
      ? 'rgba(245, 158, 11, 0.5)'
      : variant === 'accounts'
      ? 'rgba(99, 102, 241, 0.5)'
      : variant === 'tokens'
      ? 'rgba(168, 85, 247, 0.5)'
      : variant === 'staking'
      ? 'rgba(239, 68, 68, 0.5)'
      : variant === 'advanced'
      ? 'rgba(107, 114, 128, 0.5)'
      : variant === 'profile'
      ? 'rgba(14, 165, 233, 0.5)'
      : variant === 'session'
      ? 'rgba(236, 72, 153, 0.5)'
      : 'rgba(148, 163, 184, 0.4)',
    outline: 'none',
    boxShadow: variant === 'premium'
      ? `
          0 0 0 3px rgba(139, 92, 246, 0.25),
          0 16px 48px rgba(139, 92, 246, 0.15),
          0 8px 24px rgba(0, 0, 0, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.15)
        `
      : variant === 'accent'
      ? `
          0 0 0 3px rgba(6, 182, 212, 0.25),
          0 16px 48px rgba(6, 182, 212, 0.12),
          0 8px 24px rgba(0, 0, 0, 0.35),
          inset 0 1px 0 rgba(255, 255, 255, 0.12)
        `
      : variant === 'wallet'
      ? `
          0 0 0 3px rgba(16, 185, 129, 0.25),
          0 16px 48px rgba(16, 185, 129, 0.12),
          0 8px 24px rgba(0, 0, 0, 0.35),
          inset 0 1px 0 rgba(255, 255, 255, 0.12)
        `
      : variant === 'transactions'
      ? `
          0 0 0 3px rgba(245, 158, 11, 0.25),
          0 16px 48px rgba(245, 158, 11, 0.12),
          0 8px 24px rgba(0, 0, 0, 0.35),
          inset 0 1px 0 rgba(255, 255, 255, 0.12)
        `
      : variant === 'accounts'
      ? `
          0 0 0 3px rgba(99, 102, 241, 0.25),
          0 16px 48px rgba(99, 102, 241, 0.12),
          0 8px 24px rgba(0, 0, 0, 0.35),
          inset 0 1px 0 rgba(255, 255, 255, 0.12)
        `
      : variant === 'tokens'
      ? `
          0 0 0 3px rgba(168, 85, 247, 0.25),
          0 16px 48px rgba(168, 85, 247, 0.12),
          0 8px 24px rgba(0, 0, 0, 0.35),
          inset 0 1px 0 rgba(255, 255, 255, 0.12)
        `
      : variant === 'staking'
      ? `
          0 0 0 3px rgba(239, 68, 68, 0.25),
          0 16px 48px rgba(239, 68, 68, 0.12),
          0 8px 24px rgba(0, 0, 0, 0.35),
          inset 0 1px 0 rgba(255, 255, 255, 0.12)
        `
      : variant === 'advanced'
      ? `
          0 0 0 3px rgba(107, 114, 128, 0.25),
          0 16px 48px rgba(107, 114, 128, 0.12),
          0 8px 24px rgba(0, 0, 0, 0.35),
          inset 0 1px 0 rgba(255, 255, 255, 0.12)
        `
      : variant === 'profile'
      ? `
          0 0 0 3px rgba(14, 165, 233, 0.25),
          0 16px 48px rgba(14, 165, 233, 0.12),
          0 8px 24px rgba(0, 0, 0, 0.35),
          inset 0 1px 0 rgba(255, 255, 255, 0.12)
        `
      : variant === 'session'
      ? `
          0 0 0 3px rgba(236, 72, 153, 0.25),
          0 16px 48px rgba(236, 72, 153, 0.12),
          0 8px 24px rgba(0, 0, 0, 0.35),
          inset 0 1px 0 rgba(255, 255, 255, 0.12)
        `
      : `
          0 0 0 3px rgba(148, 163, 184, 0.2),
          0 12px 40px rgba(0, 0, 0, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.15)
        `,
    transform: 'translateY(-2px)',
    animation: `${glow} 2s ease-in-out infinite`,
  },
  '&:hover': {
    borderColor: variant === 'premium'
      ? 'rgba(139, 92, 246, 0.3)'
      : variant === 'accent'
      ? 'rgba(6, 182, 212, 0.3)'
      : variant === 'wallet'
      ? 'rgba(16, 185, 129, 0.3)'
      : variant === 'transactions'
      ? 'rgba(245, 158, 11, 0.3)'
      : variant === 'accounts'
      ? 'rgba(99, 102, 241, 0.3)'
      : variant === 'tokens'
      ? 'rgba(168, 85, 247, 0.3)'
      : variant === 'staking'
      ? 'rgba(239, 68, 68, 0.3)'
      : variant === 'advanced'
      ? 'rgba(107, 114, 128, 0.3)'
      : variant === 'profile'
      ? 'rgba(14, 165, 233, 0.3)'
      : variant === 'session'
      ? 'rgba(236, 72, 153, 0.3)'
      : 'rgba(148, 163, 184, 0.25)',
    transform: 'translateY(-1px)',
    boxShadow: variant === 'premium'
      ? `
          0 12px 40px rgba(139, 92, 246, 0.12),
          0 6px 20px rgba(0, 0, 0, 0.35),
          inset 0 1px 0 rgba(255, 255, 255, 0.12)
        `
      : variant === 'accent'
      ? `
          0 12px 40px rgba(6, 182, 212, 0.1),
          0 6px 20px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `
      : variant === 'wallet'
      ? `
          0 12px 40px rgba(16, 185, 129, 0.1),
          0 6px 20px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `
      : variant === 'transactions'
      ? `
          0 12px 40px rgba(245, 158, 11, 0.1),
          0 6px 20px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `
      : variant === 'accounts'
      ? `
          0 12px 40px rgba(99, 102, 241, 0.1),
          0 6px 20px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `
      : variant === 'tokens'
      ? `
          0 12px 40px rgba(168, 85, 247, 0.1),
          0 6px 20px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `
      : variant === 'staking'
      ? `
          0 12px 40px rgba(239, 68, 68, 0.1),
          0 6px 20px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `
      : variant === 'advanced'
      ? `
          0 12px 40px rgba(107, 114, 128, 0.1),
          0 6px 20px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `
      : variant === 'profile'
      ? `
          0 12px 40px rgba(14, 165, 233, 0.1),
          0 6px 20px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `
      : variant === 'session'
      ? `
          0 12px 40px rgba(236, 72, 153, 0.1),
          0 6px 20px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `
      : `
          0 12px 38px rgba(0, 0, 0, 0.38),
          inset 0 1px 0 rgba(255, 255, 255, 0.12)
        `,
  },
  '&::placeholder': {
    color: '#94a3b8',
    fontWeight: '400',
  },
  '& input, & textarea': {
    color: '#f8fafc',
    fontSize: '15px',
    fontWeight: '400',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    width: '100%',
    '&::placeholder': {
      color: '#94a3b8',
      fontWeight: '400',
    },
  },
}));

const ActionButton = styled(Button)(({ variant = 'primary', size = 'medium' }) => ({
  background: variant === 'primary'
    ? `
        linear-gradient(145deg, 
          #0891b2 0%, 
          #0284c7 50%, 
          #00D4FA 100%
        )
      `
    : variant === 'secondary'
    ? `
        linear-gradient(145deg, 
          rgba(8, 145, 178, 0.9) 0%, 
          rgba(2, 132, 199, 0.85) 50%, 
          rgba(0, 212, 250, 0.8) 100%
        )
      `
    : variant === 'success'
    ? `
        linear-gradient(145deg, 
          #059669 0%, 
          #10b981 50%, 
          #34d399 100%
        )
      `
    : variant === 'warning'
    ? `
        linear-gradient(145deg, 
          #d97706 0%, 
          #f59e0b 50%, 
          #fbbf24 100%
        )
      `
    : variant === 'error'
    ? `
        linear-gradient(145deg, 
          #dc2626 0%, 
          #ef4444 50%, 
          #f87171 100%
        )
      `
    : `
        linear-gradient(145deg, 
          #0891b2 0%, 
          #0284c7 50%, 
          #00D4FA 100%
        )
      `,
  border: variant === 'secondary'
    ? '1px solid rgba(0, 212, 250, 0.4)'
    : variant === 'primary'
    ? '1px solid rgba(0, 212, 250, 0.5)'
    : 'none',
  color: variant === 'primary' ? '#ffffff' : '#ffffff',
  padding: size === 'small'
    ? '10px 20px'
    : size === 'large'
    ? '18px 36px'
    : '14px 28px',
  borderRadius: '16px',
  fontSize: size === 'small' ? '13px' : size === 'large' ? '16px' : '14px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  margin: '0 8px 8px 0',
  minWidth: size === 'small' ? '120px' : size === 'large' ? '200px' : '160px',
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)',
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
  position: 'relative',
  overflow: 'hidden',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  boxShadow: variant === 'primary'
    ? `
        0 8px 32px rgba(0, 212, 250, 0.3),
        0 4px 16px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.15),
        inset 0 -1px 0 rgba(0, 212, 250, 0.2)
      `
    : variant === 'secondary'
    ? `
        0 8px 32px rgba(0, 212, 250, 0.2),
        0 4px 16px rgba(0, 0, 0, 0.25),
        inset 0 1px 0 rgba(255, 255, 255, 0.1)
      `
    : variant === 'success'
    ? `
        0 8px 32px rgba(16, 185, 129, 0.3),
        0 4px 16px rgba(0, 0, 0, 0.25),
        inset 0 1px 0 rgba(255, 255, 255, 0.15)
      `
    : variant === 'warning'
    ? `
        0 8px 32px rgba(245, 158, 11, 0.3),
        0 4px 16px rgba(0, 0, 0, 0.25),
        inset 0 1px 0 rgba(255, 255, 255, 0.15)
      `
    : variant === 'error'
    ? `
        0 8px 32px rgba(239, 68, 68, 0.3),
        0 4px 16px rgba(0, 0, 0, 0.25),
        inset 0 1px 0 rgba(255, 255, 255, 0.15)
      `
    : `
        0 8px 32px rgba(0, 212, 250, 0.3),
        0 4px 16px rgba(0, 0, 0, 0.25),
        inset 0 1px 0 rgba(255, 255, 255, 0.15)
      `,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent)',
    transition: 'left 0.6s ease',
    borderRadius: '16px',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '0',
    height: '0',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)',
    transform: 'translate(-50%, -50%)',
    transition: 'width 0.6s ease, height 0.6s ease',
    pointerEvents: 'none',
  },
  '&:hover': {
    transform: 'translateY(-4px) scale(1.02)',
    background: variant === 'primary'
      ? `
          linear-gradient(145deg, 
            #0284c7 0%, 
            #00D4FA 50%, 
            #38bdf8 100%
          )
        `
      : variant === 'secondary'
      ? `
          linear-gradient(145deg, 
            rgba(2, 132, 199, 0.95) 0%, 
            rgba(0, 212, 250, 0.9) 50%, 
            rgba(56, 189, 248, 0.85) 100%
          )
        `
      : variant === 'success'
      ? `
          linear-gradient(145deg, 
            #10b981 0%, 
            #34d399 50%, 
            #6ee7b7 100%
          )
        `
      : variant === 'warning'
      ? `
          linear-gradient(145deg, 
            #f59e0b 0%, 
            #fbbf24 50%, 
            #fcd34d 100%
          )
        `
      : variant === 'error'
      ? `
          linear-gradient(145deg, 
            #ef4444 0%, 
            #f87171 50%, 
            #fca5a5 100%
          )
        `
      : `
          linear-gradient(145deg, 
            #0284c7 0%, 
            #00D4FA 50%, 
            #38bdf8 100%
          )
        `,
    color: variant === 'primary' ? '#ffffff' : '#ffffff',
    textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)',
    animation: `${pulseGlow} 1.5s ease-in-out infinite`,
    boxShadow: variant === 'primary'
      ? `
          0 12px 48px rgba(0, 212, 250, 0.4),
          0 6px 24px rgba(0, 0, 0, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.2)
        `
      : variant === 'secondary'
      ? `
          0 12px 48px rgba(0, 212, 250, 0.35),
          0 6px 24px rgba(0, 0, 0, 0.35),
          inset 0 1px 0 rgba(255, 255, 255, 0.15)
        `
      : variant === 'success'
      ? `
          0 12px 48px rgba(16, 185, 129, 0.4),
          0 6px 24px rgba(0, 0, 0, 0.35),
          inset 0 1px 0 rgba(255, 255, 255, 0.2)
        `
      : variant === 'warning'
      ? `
          0 12px 48px rgba(245, 158, 11, 0.4),
          0 6px 24px rgba(0, 0, 0, 0.35),
          inset 0 1px 0 rgba(255, 255, 255, 0.2)
        `
      : variant === 'error'
       ? `
           0 12px 48px rgba(239, 68, 68, 0.4),
           0 6px 24px rgba(0, 0, 0, 0.35),
           inset 0 1px 0 rgba(255, 255, 255, 0.2)
         `
       : `
           0 12px 48px rgba(0, 212, 250, 0.4),
           0 6px 24px rgba(0, 0, 0, 0.35),
           inset 0 1px 0 rgba(255, 255, 255, 0.2)
         `,
     '&::before': {
       left: '100%',
     },
     '&::after': {
       width: '100%',
       height: '100%',
     },
   },
   '&:active': {
     transform: 'translateY(-2px) scale(0.98)',
     boxShadow: variant === 'primary'
       ? `
           0 6px 24px rgba(0, 212, 250, 0.3),
           0 3px 12px rgba(0, 0, 0, 0.3)
         `
       : variant === 'secondary'
       ? `
           0 6px 24px rgba(0, 212, 250, 0.25),
           0 3px 12px rgba(0, 0, 0, 0.25)
         `
       : variant === 'success'
       ? `
           0 6px 24px rgba(16, 185, 129, 0.3),
           0 3px 12px rgba(0, 0, 0, 0.25)
         `
       : variant === 'warning'
       ? `
           0 6px 24px rgba(245, 158, 11, 0.3),
           0 3px 12px rgba(0, 0, 0, 0.25)
         `
       : variant === 'error'
       ? `
           0 6px 24px rgba(239, 68, 68, 0.3),
           0 3px 12px rgba(0, 0, 0, 0.25)
         `
       : `
           0 6px 24px rgba(0, 212, 250, 0.3),
           0 3px 12px rgba(0, 0, 0, 0.25)
         `,
   },
   '&:disabled': {
     opacity: 0.5,
     cursor: 'not-allowed',
     transform: 'none',
     background: `
       linear-gradient(145deg, 
         rgba(55, 65, 81, 0.6) 0%, 
         rgba(31, 41, 55, 0.7) 50%, 
         rgba(17, 24, 39, 0.8) 100%
       )
     `,
     color: '#9ca3af',
     textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)',
     boxShadow: `
       0 4px 16px rgba(0, 0, 0, 0.2),
       inset 0 1px 0 rgba(255, 255, 255, 0.05)
     `,
     border: '1px solid rgba(156, 163, 175, 0.2)',
     backdropFilter: 'blur(5px)',
     WebkitBackdropFilter: 'blur(5px)',
     '&::before': {
       display: 'none',
     },
     '&::after': {
       display: 'none',
     },
   },
 })); 

const StatusIndicator = styled.div(({ status, variant = 'default', pulse = false }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 16px',
  background: status === 'connected'
    ? `
        linear-gradient(145deg, 
          rgba(5, 150, 105, 0.25) 0%, 
          rgba(16, 185, 129, 0.2) 50%, 
          rgba(52, 211, 153, 0.15) 100%
        )
      `
    : status === 'disconnected'
    ? `
        linear-gradient(145deg, 
          rgba(220, 38, 38, 0.25) 0%, 
          rgba(239, 68, 68, 0.2) 50%, 
          rgba(248, 113, 113, 0.15) 100%
        )
      `
    : status === 'pending'
    ? `
        linear-gradient(145deg, 
          rgba(217, 119, 6, 0.25) 0%, 
          rgba(245, 158, 11, 0.2) 50%, 
          rgba(251, 191, 36, 0.15) 100%
        )
      `
    : `
        linear-gradient(145deg, 
          rgba(55, 65, 81, 0.25) 0%, 
          rgba(75, 85, 99, 0.2) 50%, 
          rgba(107, 114, 128, 0.15) 100%
        )
      `,
  color: status === 'connected'
    ? '#6ee7b7'
    : status === 'disconnected'
    ? '#fca5a5' 
    : status === 'pending'
    ? '#fcd34d'
    : '#d1d5db',
  borderRadius: '24px',
  border: status === 'connected'
    ? '1px solid rgba(52, 211, 153, 0.4)'
    : status === 'disconnected'
    ? '1px solid rgba(248, 113, 113, 0.4)'
    : status === 'pending'
    ? '1px solid rgba(251, 191, 36, 0.4)'
    : '1px solid rgba(107, 114, 128, 0.4)',
  fontSize: '12px',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  textShadow: '0 1px 3px rgba(0, 0, 0, 0.6)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  boxShadow: status === 'connected'
    ? `
        0 4px 12px rgba(52, 211, 153, 0.2),
        0 2px 6px rgba(0, 0, 0, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.1)
      `
    : status === 'disconnected'
    ? `
        0 4px 12px rgba(248, 113, 113, 0.2),
        0 2px 6px rgba(0, 0, 0, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.1)
      `
    : status === 'pending'
    ? `
        0 4px 12px rgba(251, 191, 36, 0.2),
        0 2px 6px rgba(0, 0, 0, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.1)
      `
    : `
        0 4px 12px rgba(0, 0, 0, 0.1),
        0 2px 6px rgba(0, 0, 0, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.05)
      `,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  animation: pulse ? `${pulseGlow} 2s ease-in-out infinite` : 'none',
  '&::before': {
    content: '""',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: status === 'connected'
      ? '#34d399'
      : status === 'disconnected'
      ? '#f87171'
      : status === 'pending'
      ? '#fbbf24'
      : '#9ca3af',
    boxShadow: status === 'connected'
      ? `0 0 8px rgba(52, 211, 153, 0.8)`
      : status === 'disconnected'
      ? `0 0 8px rgba(248, 113, 113, 0.8)`
      : status === 'pending'
      ? `0 0 8px rgba(251, 191, 36, 0.8)`
      : 'none',
    animation: pulse && status === 'pending' ? `${pulseGlow} 1s ease-in-out infinite` : 'none',
  },
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: status === 'connected'
      ? `
          0 6px 20px rgba(52, 211, 153, 0.3),
          0 3px 10px rgba(0, 0, 0, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.15)
        `
      : status === 'disconnected'
      ? `
          0 6px 20px rgba(248, 113, 113, 0.3),
          0 3px 10px rgba(0, 0, 0, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.15)
        `
      : status === 'pending'
      ? `
          0 6px 20px rgba(251, 191, 36, 0.3),
          0 3px 10px rgba(0, 0, 0, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.15)
        `
      : `
          0 6px 20px rgba(0, 0, 0, 0.15),
          0 3px 10px rgba(0, 0, 0, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `,
  },
}));

const GridContainer = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '24px',
  marginTop: '24px',
  padding: '0 24px',
  animation: `${slideIn} 0.6s ease-out`,
});

// Additional utility components for enhanced theming
const GlassPanel = styled.div(({ variant = 'default' }) => ({
  background: variant === 'primary'
    ? `
        linear-gradient(145deg, 
          rgba(59, 130, 246, 0.15) 0%, 
          rgba(99, 102, 241, 0.1) 50%, 
          rgba(139, 92, 246, 0.05) 100%
        )
      `
    : variant === 'secondary'
    ? `
        linear-gradient(145deg, 
          rgba(16, 185, 129, 0.15) 0%, 
          rgba(52, 211, 153, 0.1) 50%, 
          rgba(110, 231, 183, 0.05) 100%
        )
      `
    : `
        linear-gradient(145deg, 
          rgba(55, 65, 81, 0.2) 0%, 
          rgba(75, 85, 99, 0.15) 50%, 
          rgba(107, 114, 128, 0.1) 100%
        )
      `,
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: variant === 'primary'
    ? '1px solid rgba(99, 102, 241, 0.3)'
    : variant === 'secondary'
    ? '1px solid rgba(52, 211, 153, 0.3)'
    : '1px solid rgba(107, 114, 128, 0.3)',
  borderRadius: '16px',
  padding: '20px',
  boxShadow: `
    0 8px 32px rgba(0, 0, 0, 0.2),
    0 4px 16px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1)
  `,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `
      0 12px 48px rgba(0, 0, 0, 0.25),
      0 6px 24px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.15)
    `,
  },
}));

const AnimatedIcon = styled.div(({ size = 'medium', pulse = false }) => ({
  width: size === 'small' ? '16px' : size === 'large' ? '32px' : '24px',
  height: size === 'small' ? '16px' : size === 'large' ? '32px' : '24px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  background: `
    linear-gradient(145deg, 
      rgba(99, 102, 241, 0.2) 0%, 
      rgba(139, 92, 246, 0.15) 50%, 
      rgba(168, 85, 247, 0.1) 100%
    )
  `,
  color: '#c4b5fd',
  fontSize: size === 'small' ? '12px' : size === 'large' ? '18px' : '14px',
  transition: 'all 0.3s ease',
  animation: pulse ? `${pulseGlow} 2s ease-in-out infinite` : 'none',
  '&:hover': {
    transform: 'scale(1.1) rotate(5deg)',
    background: `
      linear-gradient(145deg, 
        rgba(99, 102, 241, 0.3) 0%, 
        rgba(139, 92, 246, 0.25) 50%, 
        rgba(168, 85, 247, 0.2) 100%
      )
    `,
    color: '#ddd6fe',
  },
}));

export default function Main() {
  const activeTab = useSelector((state) => state.ui.activeTab);
  const profileForm = useSelector((state) => state.ui.profileForm);
  const sessionForm = useSelector((state) => state.ui.sessionForm);
  const userProfile = useSelector((state) => state.ui.userProfile);
  const sessionStatus = useSelector((state) => state.ui.sessionStatus);
  const userStatus = useSelector((state) => state.nexus.userStatus);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [marketStats, setMarketStats] = useState({
    lastPrice: 0,
    volume24h: 0,
    highPrice: 0,
    lowPrice: 0
  });
  const [orderHistory, setOrderHistory] = useState([]);
  const [bidPage, setBidPage] = useState(0);
  const [askPage, setAskPage] = useState(0);
  const [userAccounts, setUserAccounts] = useState([]);
  const ORDERS_PER_PAGE = 5;

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'tokenbrowser', label: 'Token Browser', icon: '🔍' },
    { id: 'marketplace', label: 'P2P Marketplace', icon: '🔄' },
    { id: 'wallet', label: 'Wallet', icon: '💰' },
    { id: 'profile', label: 'Profile Management', icon: '👤' },
    { id: 'session', label: 'Session Control', icon: '🔐' },
  ];

  // Profile Management Functions
  const createProfile = async () => {
    if (!profileForm.username || !profileForm.password || !profileForm.pin) {
      NEXUS.utilities.showErrorDialog({
        message: 'Missing Required Fields',
        note: 'Please fill in username, password, and PIN',
      });
      return;
    }

    try {
      setLoading(true);
      const result = await apiCall('profiles/create/master', {
        username: profileForm.username,
        password: profileForm.password,
        pin: profileForm.pin,
      });

      NEXUS.utilities.showSuccessDialog({
        message: 'Profile Created Successfully',
        note: `Transaction ID: ${result.txid}`,
      });

      dispatch(updateProfileForm({ username: '', password: '', pin: '' }));
    } catch (error) {
      NEXUS.utilities.showErrorDialog({
        message: 'Profile Creation Failed',
        note: error?.message || 'Unknown error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  const getProfileStatus = async () => {
    try {
      setLoading(true);
      const result = await NEXUS.utilities.apiCall('profiles/status/master');
      dispatch(setUserProfile(result));

      NEXUS.utilities.showSuccessDialog({
        message: 'Profile Status Retrieved',
        note: JSON.stringify(result, null, 2),
      });
    } catch (error) {
      NEXUS.utilities.showErrorDialog({
        message: 'Failed to Get Profile Status',
        note: error?.message || 'Unknown error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  // Session Management Functions
  const createSession = async () => {
    if (!sessionForm.username || !sessionForm.password || !sessionForm.pin) {
      NEXUS.utilities.showErrorDialog({
        message: 'Missing Required Fields',
        note: 'Please fill in username, password, and PIN',
      });
      return;
    }

    try {
      setLoading(true);
      const result = await NEXUS.utilities.apiCall('sessions/create/local', {
        username: sessionForm.username,
        password: sessionForm.password,
        pin: sessionForm.pin,
      });

      NEXUS.utilities.showSuccessDialog({
        message: 'Session Created Successfully',
        note: `Session ID: ${result.session}`,
      });

      await getSessionStatus();
    } catch (error) {
      NEXUS.utilities.showErrorDialog({
        message: 'Session Creation Failed',
        note: error?.message || 'Unknown error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  const unlockSession = async () => {
    try {
      setLoading(true);
      const result = await NEXUS.utilities.apiCall('sessions/unlock/local', {
        pin: sessionForm.pin,
        mining: false,
        notifications: true,
        staking: false,
        transactions: true,
      });

      dispatch(setSessionStatus(result));
      NEXUS.utilities.showSuccessDialog({
        message: 'Session Unlocked Successfully',
        note: 'Session is now ready for transactions',
      });
    } catch (error) {
      NEXUS.utilities.showErrorDialog({
        message: 'Failed to Unlock Session',
        note: error?.message || 'Unknown error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  const getSessionStatus = async () => {
    try {
      const result = await NEXUS.utilities.apiCall('sessions/status/local');
      dispatch(setSessionStatus(result));
    } catch (error) {
      console.error('Failed to get session status:', error);
    }
  };

  const terminateSession = async () => {
    const agreed = await NEXUS.utilities.confirm({
      question: 'Are you sure you want to terminate the current session?',
    });

    if (agreed) {
      try {
        setLoading(true);
        await NEXUS.utilities.apiCall('sessions/terminate/local', {
          pin: sessionForm.pin,
        });

        dispatch(setSessionStatus(null));
        NEXUS.utilities.showSuccessDialog({
          message: 'Session Terminated',
          note: 'The session has been successfully terminated',
        });
      } catch (error) {
        NEXUS.utilities.showErrorDialog({
          message: 'Failed to Terminate Session',
          note: error?.message || 'Unknown error occurred',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getSessionStatus();
  }, []);

  // Load wallet data when marketplace tab is selected (removed automatic trading activity discovery)
  useEffect(() => {
    if (activeTab === 'marketplace') {
      refreshWalletData();
      // Note: Trading activity discovery is now manual via button click only
    }
  }, [activeTab]);

  const renderDashboard = () => (
    <div>
      <Card>
        <h2 style={{ color: '#8b5cf6', marginBottom: '16px' }}>🔄 Nexus P2P Marketplace</h2>
        <p style={{ color: '#8892b0', lineHeight: 1.6 }}>
          Welcome to the decentralized peer-to-peer marketplace built on Nexus Protocol. 
          Trade any tokens including NXS, custom tokens, and digital assets with complete transparency and security.
        </p>

        <GridContainer>
          <Card>
            <h3>Profile Status</h3>
            <StatusIndicator status={userProfile ? 'connected' : 'disconnected'}>
              {userProfile ? '✅ Profile Loaded' : '❌ No Profile'}
            </StatusIndicator>
            {userProfile && (
              <div style={{ marginTop: '12px', fontSize: '14px', color: '#8892b0' }}>
                <div>Genesis: {userProfile.genesis?.substring(0, 16)}...</div>
                <div>Transactions: {userProfile.transactions}</div>
                <div>Recovery: {userProfile.recovery ? '✅' : '❌'}</div>
              </div>
            )}
          </Card>

          <Card>
            <h3>Session Status</h3>
            <StatusIndicator status={sessionStatus ? 'connected' : 'disconnected'}>
              {sessionStatus ? '✅ Session Active' : '❌ No Session'}
            </StatusIndicator>
            {sessionStatus && (
              <div style={{ marginTop: '12px', fontSize: '14px', color: '#8892b0' }}>
                <div>Transactions: {sessionStatus.unlocked?.transactions ? '✅' : '❌'}</div>
                <div>Notifications: {sessionStatus.unlocked?.notifications ? '✅' : '❌'}</div>
                <div>Last Access: {new Date(sessionStatus.accessed * 1000).toLocaleString()}</div>
              </div>
            )}
          </Card>
        </GridContainer>
      </Card>
    </div>
  );

  const renderProfileManagement = () => (
    <div>
      <Card>
        <h2 style={{ color: '#8b5cf6', marginBottom: '16px' }}>👤 Profile Management</h2>

        <FieldSet legend="Create New Profile">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
            <StyledTextField
              variant="profile"
              placeholder="Username (min 2 characters)"
              value={profileForm.username}
              onChange={(e) => dispatch(updateProfileForm({ username: e.target.value }))}
            />
            <StyledTextField
              variant="profile"
              type="password"
              placeholder="Password (min 8 characters)"
              value={profileForm.password}
              onChange={(e) => dispatch(updateProfileForm({ password: e.target.value }))}
            />
            <StyledTextField
              variant="profile"
              type="password"
              placeholder="PIN (min 4 characters)"
              value={profileForm.pin}
              onChange={(e) => dispatch(updateProfileForm({ pin: e.target.value }))}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <ActionButton onClick={createProfile} disabled={loading}>
              {loading ? 'Creating...' : 'Create Profile'}
            </ActionButton>
            <ActionButton variant="secondary" onClick={getProfileStatus} disabled={loading}>
              Get Profile Status
            </ActionButton>
          </div>
        </FieldSet>

        {userProfile && (
          <Card>
            <h3>Current Profile Information</h3>
            <div style={{ fontSize: '14px', color: '#8892b0' }}>
              <div><strong>Genesis Hash:</strong> {userProfile.genesis}</div>
              <div><strong>Confirmed:</strong> {userProfile.confirmed ? 'Yes' : 'No'}</div>
              <div><strong>Recovery Set:</strong> {userProfile.recovery ? 'Yes' : 'No'}</div>
              <div><strong>Crypto Object:</strong> {userProfile.crypto ? 'Yes' : 'No'}</div>
              <div><strong>Total Transactions:</strong> {userProfile.transactions}</div>
            </div>
          </Card>
        )}
      </Card>
    </div>
  );

  const renderSessionControl = () => (
    <div>
      <Card>
        <h2 style={{ color: '#8b5cf6', marginBottom: '16px' }}>🔐 Session Control</h2>

        <FieldSet legend="Session Management">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
            <StyledTextField
              variant="session"
              placeholder="Username"
              value={sessionForm.username}
              onChange={(e) => dispatch(updateSessionForm({ username: e.target.value }))}
            />
            <StyledTextField
              variant="session"
              type="password"
              placeholder="Password"
              value={sessionForm.password}
              onChange={(e) => dispatch(updateSessionForm({ password: e.target.value }))}
            />
            <StyledTextField
              variant="session"
              type="password"
              placeholder="PIN"
              value={sessionForm.pin}
              onChange={(e) => dispatch(updateSessionForm({ pin: e.target.value }))}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <ActionButton onClick={createSession} disabled={loading}>
              {loading ? 'Creating...' : 'Create Session'}
            </ActionButton>
            <ActionButton onClick={unlockSession} disabled={loading}>
              Unlock Session
            </ActionButton>
            <ActionButton variant="secondary" onClick={getSessionStatus} disabled={loading}>
              Check Status
            </ActionButton>
            <ActionButton variant="danger" onClick={terminateSession} disabled={loading}>
              Terminate Session
            </ActionButton>
          </div>
        </FieldSet>

        {sessionStatus && (
          <Card>
            <h3>Session Information</h3>
            <div style={{ fontSize: '14px', color: '#8892b0' }}>
              <div><strong>Genesis:</strong> {sessionStatus.genesis}</div>
              <div><strong>Location:</strong> {sessionStatus.location}</div>
              <div><strong>Last Accessed:</strong> {new Date(sessionStatus.accessed * 1000).toLocaleString()}</div>

              <h4 style={{ color: '#00d4aa', marginTop: '16px' }}>Unlock Status:</h4>
              <div>Mining: {sessionStatus.unlocked?.mining ? '✅ Enabled' : '❌ Disabled'}</div>
              <div>Notifications: {sessionStatus.unlocked?.notifications ? '✅ Enabled' : '❌ Disabled'}</div>
              <div>Staking: {sessionStatus.unlocked?.staking ? '✅ Enabled' : '❌ Disabled'}</div>
              <div>Transactions: {sessionStatus.unlocked?.transactions ? '✅ Enabled' : '❌ Disabled'}</div>
            </div>
          </Card>
        )}
      </Card>
    </div>
  );

  // Market API state
  const [marketData, setMarketData] = useState({ bids: [], asks: [] });
  const [userOrders, setUserOrders] = useState({ bids: [], asks: [] });
  const [selectedMarket, setSelectedMarket] = useState('CARBON/NXS');
  const [availableTokens, setAvailableTokens] = useState([]);
  const [availableMarkets, setAvailableMarkets] = useState(['CARBON/NXS']);
  const [allUserTokens, setAllUserTokens] = useState([]);
  const [crossTokenPairs, setCrossTokenPairs] = useState([]);
  const [orderForm, setOrderForm] = useState({
    type: 'bid',
    amount: '',
    price: '',
    from: '',
    to: ''
  });

  // Enhanced Trading Activity State
  const [tradingActivity, setTradingActivity] = useState({
    totalTransactions: 0,
    activeMarkets: 0,
    activeBuyOrders: 0,
    activeSellOrders: 0,
    executedTrades: 0,
    transactionHistory: [],
    discoveredPairs: [],
    signatureChainGenesis: null,
    lastUpdated: null
  });
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState(null);
  const [transactionPage, setTransactionPage] = useState(0);
  const [selectedTradingPair, setSelectedTradingPair] = useState('all');

  // Token Browser state
  const [allTokens, setAllTokens] = useState([]);
  const [filteredTokens, setFilteredTokens] = useState([]);
  const [tokenFilter, setTokenFilter] = useState('');
  const [tokenSortBy, setTokenSortBy] = useState('ticker');
  const [tokenSortOrder, setTokenSortOrder] = useState('asc');
  const [tokenPage, setTokenPage] = useState(0);
  const [tokensPerPage, setTokensPerPage] = useState(12); // Increased default for better grid layout
  const [selectedTokenForTrading, setSelectedTokenForTrading] = useState(null);
  const [tokenSearchLoading, setTokenSearchLoading] = useState(false);
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [orderProcessingMessage, setOrderProcessingMessage] = useState('');
  
  // Simplified Token Listing state
  const [simplifiedPage, setSimplifiedPage] = useState(0);
  const [simplifiedPerPage, setSimplifiedPerPage] = useState(10);
  const [simplifiedFilter, setSimplifiedFilter] = useState('');
  const [simplifiedSortBy, setSimplifiedSortBy] = useState('ticker');
  
  // Trading pair selection state for Token Browser
  const [selectedTradingPairs, setSelectedTradingPairs] = useState([]);
  const [activeTradingPair, setActiveTradingPair] = useState('');
  
  // Cross-token pair creation state
  const [selectedTokensForPairs, setSelectedTokensForPairs] = useState([]);
  const [showCrossTokenCreator, setShowCrossTokenCreator] = useState(false);

  // Enhanced Market API Functions - supports cross-token trading
  const createMarketOrder = async () => {
    if (!orderForm.amount || !orderForm.price) {
      NEXUS.utilities.showErrorDialog({
        message: 'Missing Required Fields',
        note: 'Please enter both amount and price',
      });
      return;
    }

    // Validate trading pair requirements for cross-token trading
    const validation = validateCrossTokenTradingPair(selectedMarket);
    
    if (!validation.isValid) {
      NEXUS.utilities.showErrorDialog({
        message: 'Trading Pair Validation Failed',
        note: `Missing accounts for: ${validation.missingAccounts.join(', ')}\n\nPlease create accounts for these tokens in the Wallet tab first.`,
      });
      return;
    }

    // Auto-detect accounts if not specified
    let fromAccount = orderForm.from;
    let toAccount = orderForm.to;
    
    if (!fromAccount || !toAccount) {
      const [baseToken, quoteToken] = selectedMarket.split('/');
      
      if (orderForm.type === 'bid') {
        // Buy order: pay with quote token, receive base token
        fromAccount = fromAccount || validation.quoteAccount?.name || validation.quoteAccount?.address;
        toAccount = toAccount || validation.baseAccount?.name || validation.baseAccount?.address;
      } else {
        // Sell order: pay with base token, receive quote token
        fromAccount = fromAccount || validation.baseAccount?.name || validation.baseAccount?.address;
        toAccount = toAccount || validation.quoteAccount?.name || validation.quoteAccount?.address;
      }
    }

    if (!fromAccount || !toAccount) {
      NEXUS.utilities.showErrorDialog({
        message: 'Account Detection Failed',
        note: 'Could not auto-detect required accounts. Please specify from and to accounts manually.',
      });
      return;
    }

    // Show warnings if any
    if (validation.warnings.length > 0) {
      console.warn('Trading pair warnings:', validation.warnings);
    }

    try {
      setLoading(true);
      setOrderProcessing(true);
      setOrderProcessingMessage(`🔄 Validating ${orderForm.type === 'bid' ? 'Buy' : 'Sell'} Order...`);
      
      // Show validation notification pop-up
      NEXUS.utilities.showNotification({
        content: `🔄 Validating ${orderForm.type === 'bid' ? 'Buy' : 'Sell'} Order...`,
        type: 'info',
        autoClose: 2000
      });
      
      const [baseToken, quoteToken] = selectedMarket.split('/');
      
      // Show validation progress
      await new Promise(resolve => setTimeout(resolve, 500)); // Brief pause for UX
      setOrderProcessingMessage(`📝 Preparing order parameters...`);
      
      // Show preparation notification pop-up
      NEXUS.utilities.showNotification({
        content: `📝 Preparing order parameters...`,
        type: 'info',
        autoClose: 2000
      });
      
      // Prepare order parameters
      let userAmount = parseFloat(orderForm.amount); // Amount user entered (base token amount)
      let orderPrice = parseFloat(orderForm.price);
      
      // Calculate API amount based on order type and token pair
      let apiAmount;
      
      if (orderForm.type === 'bid') {
        // For buy orders: API expects quote token amount (total cost)
        let totalCost = userAmount * orderPrice;
        
        // For cross-token markets (e.g., CARBON/NXS), use decimal amounts
        // Only apply divisible unit conversion for pure NXS pairs
        if (quoteToken === 'NXS' && baseToken === 'NXS') {
          apiAmount = totalCost * 1000000; // Convert to divisible units for NXS/NXS
        } else {
          apiAmount = totalCost; // Use decimal amount for cross-token pairs
        }
      } else {
        // For sell orders: API expects base token amount
        // For cross-token markets, use decimal amounts
        if (baseToken === 'NXS' && quoteToken === 'NXS') {
          apiAmount = userAmount * 1000000; // Convert to divisible units for NXS/NXS
        } else {
          apiAmount = userAmount; // Use decimal amount for cross-token pairs
        }
      }
      
      // Note: API expects price in normal decimal format, not divisible units
      
      console.log(`📊 Creating ${orderForm.type} order:`, {
        market: selectedMarket,
        userAmount: userAmount,           // What user entered (base token)
        displayAmount: `${userAmount} ${baseToken}`,
        totalCost: orderForm.type === 'bid' ? `${(userAmount * orderPrice).toFixed(6)} ${quoteToken}` : 'N/A',
        price: `${orderPrice} ${quoteToken} per ${baseToken}`,
        apiAmount: apiAmount,             // Raw amount sent to API (with NXS conversion if applicable)
        from: fromAccount,
        to: toAccount,
        orderType: orderForm.type,
        nxsConversion: (baseToken === 'NXS' && quoteToken === 'NXS') ? 'Applied (NXS/NXS pair)' : 'Not applied (cross-token pair)'
      });
      
      setOrderProcessingMessage(`🚀 Submitting ${orderForm.type === 'bid' ? 'Buy' : 'Sell'} order to blockchain...`);
      
      // Show submission notification pop-up
      NEXUS.utilities.showNotification({
        content: `🚀 Submitting ${orderForm.type === 'bid' ? 'Buy' : 'Sell'} order to blockchain...`,
        type: 'info',
        autoClose: 3000
      });
      
      const result = await NEXUS.utilities.secureApiCall(`market/create/${orderForm.type}`, {
        market: selectedMarket,
        amount: apiAmount, // Send quote token amount to API
        price: orderPrice,
        from: fromAccount,
        to: toAccount
      });

      const orderTypeText = orderForm.type === 'bid' ? 'Buy' : 'Sell';
      const displayPrice = parseFloat(orderForm.price);
      const totalValue = (userAmount * displayPrice).toFixed(6); // Use user amount for display
      
      // Show immediate success notification pop-up
      NEXUS.utilities.showNotification({
        content: `✅ ${orderTypeText} Order Created! ${userAmount} ${baseToken} at ${displayPrice} ${quoteToken} per ${baseToken}`,
        type: 'success',
        autoClose: 4000
      });
      
      NEXUS.utilities.showSuccessDialog({
        message: `${orderTypeText} Order Created Successfully`,
        note: `Market: ${selectedMarket}\nAmount: ${userAmount} ${baseToken}\nPrice: ${displayPrice} ${quoteToken} per ${baseToken}\nTotal Cost: ${totalValue} ${quoteToken}\nTransaction ID: ${result.txid}`,
      });

      setOrderForm({ type: 'bid', amount: '', price: '', from: '', to: '' });
      setOrderProcessingMessage('📊 Refreshing market data...');
      
      // Show market data refresh notification
      NEXUS.utilities.showNotification({
        content: '📊 Refreshing market data...',
        type: 'info',
        autoClose: 2000
      });
      
      // Optimized market data refresh with timeout
      const refreshPromise = refreshMarketData();
      const timeoutPromise = new Promise(resolve => setTimeout(resolve, 3000));
      
      await Promise.race([refreshPromise, timeoutPromise]);
      setOrderProcessingMessage('✅ Order placed successfully! Check order book below.');
      
      // Show final success notification
      NEXUS.utilities.showNotification({
        content: '✅ Order placed successfully! Check order book below.',
        type: 'success',
        autoClose: 3000
      });
      
      // Auto-clear success message after 2 seconds
      setTimeout(() => {
        if (orderProcessingMessage.includes('✅')) {
          setOrderProcessingMessage('');
        }
      }, 2000);
      
    } catch (error) {
      NEXUS.utilities.showErrorDialog({
        message: 'Order Creation Failed',
        note: error?.message || 'Unknown error occurred',
      });
      
      // Show error notification pop-up
      NEXUS.utilities.showNotification({
        content: `❌ Order Creation Failed: ${error?.message || 'Please try again'}`,
        type: 'error',
        autoClose: 5000
      });
    } finally {
      setLoading(false);
      setOrderProcessing(false);
      // Don't clear message immediately if it's a success message
      if (!orderProcessingMessage.includes('✅')) {
        setOrderProcessingMessage('');
      }
    }
  };

  // Enhanced auto-detect user accounts for order execution (supports cross-token trading)
  const findUserAccount = (ticker) => {
    if (!walletData.accounts || walletData.accounts.length === 0) {
      return null;
    }
    
    // Find account by ticker, prioritizing accounts with balance
    const matchingAccounts = walletData.accounts.filter(account => {
      if (ticker === 'NXS') {
        return !account.ticker || account.ticker === 'NXS';
      }
      return account.ticker === ticker;
    });
    
    if (matchingAccounts.length === 0) {
      console.warn(`⚠️ No account found for ticker: ${ticker}`);
      console.log('Available accounts:', walletData.accounts.map(acc => ({ name: acc.name, ticker: acc.ticker, balance: acc.balance })));
      return null;
    }
    
    // Prefer accounts with balance, otherwise return first match
    const accountWithBalance = matchingAccounts.find(account => 
      parseFloat(account.balance || 0) > 0
    );
    
    const selectedAccount = accountWithBalance || matchingAccounts[0];
    console.log(`✅ Found account for ${ticker}:`, { name: selectedAccount.name, balance: selectedAccount.balance });
    
    return selectedAccount;
  };
  
  // Enhanced function to validate cross-token trading pair requirements
  const validateCrossTokenTradingPair = (marketPair) => {
    const [baseToken, quoteToken] = marketPair.split('/');
    
    // Check if both tokens have accounts
    const baseAccount = findUserAccount(baseToken);
    const quoteAccount = findUserAccount(quoteToken);
    
    const validation = {
      isValid: true,
      baseToken,
      quoteToken,
      baseAccount,
      quoteAccount,
      missingAccounts: [],
      warnings: []
    };
    
    if (!baseAccount) {
      validation.isValid = false;
      validation.missingAccounts.push(baseToken);
    }
    
    if (!quoteAccount) {
      validation.isValid = false;
      validation.missingAccounts.push(quoteToken);
    }
    
    // Check balances for trading
    if (baseAccount && parseFloat(baseAccount.balance || 0) === 0) {
      validation.warnings.push(`${baseToken} account has zero balance`);
    }
    
    if (quoteAccount && parseFloat(quoteAccount.balance || 0) === 0) {
      validation.warnings.push(`${quoteToken} account has zero balance`);
    }
    
    return validation;
  };

  const executeOrder = async (txid, order = null) => {
    try {
      setLoading(true);
      
      // Parse market pair to understand what tokens are involved
      const [baseToken, quoteToken] = selectedMarket.split('/');
      
      // Determine order type and required accounts
      let fromTicker, toTicker, fromAccount, toAccount;
      
      if (order) {
        // Use order details to determine the flow
        if (order.type === 'bid') {
          // Executing a buy order means we're selling to the buyer
          // We need: baseToken account (from) -> quoteToken account (to)
          fromTicker = baseToken;
          toTicker = quoteToken;
        } else {
          // Executing a sell order means we're buying from the seller
          // We need: quoteToken account (from) -> baseToken account (to)
          fromTicker = quoteToken;
          toTicker = baseToken;
        }
      } else {
        // Fallback to form data if no order details
        if (!orderForm.from || !orderForm.to) {
          NEXUS.utilities.showErrorDialog({
            message: 'Missing Account Details',
            note: 'Please specify from and to accounts in the order form',
          });
          return;
        }
        fromAccount = orderForm.from;
        toAccount = orderForm.to;
      }
      
      // Auto-detect accounts if not already set
      if (!fromAccount && fromTicker) {
        fromAccount = findUserAccount(fromTicker);
        if (!fromAccount) {
          NEXUS.utilities.showErrorDialog({
            message: `Missing ${fromTicker} Account`,
            note: `You need a ${fromTicker} account to execute this order.\n\nPlease go to the Wallet tab → Accounts section to create a ${fromTicker} account first.`,
          });
          return;
        }
        fromAccount = fromAccount.name || fromAccount.address;
      }
      
      if (!toAccount && toTicker) {
        toAccount = findUserAccount(toTicker);
        if (!toAccount) {
          NEXUS.utilities.showErrorDialog({
            message: `Missing ${toTicker} Account`,
            note: `You need a ${toTicker} account to execute this order.\n\nPlease go to the Wallet tab → Accounts section to create a ${toTicker} account first.`,
          });
          return;
        }
        toAccount = toAccount.name || toAccount.address;
      }

      const result = await NEXUS.utilities.secureApiCall('market/execute/order', {
        txid,
        from: fromAccount,
        to: toAccount
      });

      NEXUS.utilities.showSuccessDialog({
        message: 'Order Executed Successfully',
        note: `Transaction ID: ${result.txid}\n\nFrom: ${fromAccount}\nTo: ${toAccount}`,
      });

      await refreshMarketData();
    } catch (error) {
      NEXUS.utilities.showErrorDialog({
        message: 'Order Execution Failed',
        note: error?.message || 'Unknown error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (txid) => {
    try {
      setLoading(true);
      const result = await NEXUS.utilities.secureApiCall('market/cancel/order', {
        txid
      });

      NEXUS.utilities.showSuccessDialog({
        message: 'Order Canceled Successfully',
        note: `Transaction ID: ${result.txid}`,
      });

      await refreshMarketData();
    } catch (error) {
      NEXUS.utilities.showErrorDialog({
        message: 'Order Cancellation Failed',
        note: error?.message || 'Unknown error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  // Enhanced Trading Activity Discovery using LEDGER API with improved market detection
  const discoverTradingActivity = async () => {
    try {
      setActivityLoading(true);
      setActivityError(null);
      console.log('🔍 Starting comprehensive trading activity discovery...');

      // Step 1: Get current signature chain genesis
      let signatureGenesis = null;
      try {
        if (sessionStatus?.genesis) {
          signatureGenesis = sessionStatus.genesis;
        } else if (userProfile?.genesis) {
          signatureGenesis = userProfile.genesis;
        } else {
          // Try to get from session status
          const sessionInfo = await NEXUS.utilities.apiCall('sessions/status/local');
          signatureGenesis = sessionInfo?.genesis;
        }
      } catch (error) {
        console.warn('Could not determine signature chain genesis:', error);
      }

      if (!signatureGenesis) {
        throw new Error('Unable to identify signature chain genesis. Please ensure you have an active session.');
      }

      console.log(`🔗 Using signature chain genesis: ${signatureGenesis}`);

      // Step 2: Get user's accounts first to identify potential trading pairs
      console.log('📁 Loading user accounts to identify trading pairs...');
      const userAccounts = [];
      const userTokenAddresses = new Set();
      const potentialMarketPairs = new Set();
      
      try {
        const accounts = await NEXUS.utilities.apiCall('finance/list/account', {
          limit: 100
        });

        if (accounts && Array.isArray(accounts)) {
          accounts.forEach(account => {
            userAccounts.push(account);
            if (account.ticker && account.ticker !== 'NXS') {
              potentialMarketPairs.add(`${account.ticker}/NXS`);
              console.log(`🎯 Identified potential trading pair: ${account.ticker}/NXS`);
            }
            if (account.token && account.token !== '0') {
              userTokenAddresses.add(account.token);
            }
          });
        }
      } catch (error) {
        console.warn('Failed to load user accounts:', error);
      }

      // Step 3: Check Market API for active orders across ALL potential markets
      console.log('🔄 Checking Market API for active orders...');
      const transactionHistory = [];
      let allMarketPairs = new Set(potentialMarketPairs);
      let activeBuyOrders = 0;
      let activeSellOrders = 0;
      let executedTrades = 0;

      // Check current selected market and common trading pairs
      const marketsToCheck = new Set([
        ...potentialMarketPairs,
        selectedMarket,
        'CARBON/NXS',
        'GOLD/NXS',
        'SILVER/NXS'
      ]);

      for (const marketPair of marketsToCheck) {
        try {
          console.log(`📊 Checking market: ${marketPair}`);
          
          // Get all orders for this market
          const [marketOrders, userOrders] = await Promise.allSettled([
            NEXUS.utilities.apiCall('market/list/order', {
              market: marketPair,
              limit: 1000
            }),
            NEXUS.utilities.apiCall('market/user/order', {
              market: marketPair
            })
          ]);

          // Process user's active orders
          if (userOrders.status === 'fulfilled' && userOrders.value) {
            const userMarketOrders = userOrders.value;
            
            if (userMarketOrders.bids?.length > 0) {
              activeBuyOrders += userMarketOrders.bids.length;
              allMarketPairs.add(marketPair);
              
              userMarketOrders.bids.forEach(order => {
                transactionHistory.push({
                  txid: order.txid,
                  timestamp: order.timestamp || Date.now() / 1000,
                  type: 'ACTIVE_BUY_ORDER',
                  orderType: 'buy',
                  marketPair: marketPair,
                  amount: order.contract?.amount || order.amount,
                  price: order.price,
                  ticker: order.contract?.ticker || marketPair.split('/')[0],
                  from: order.contract?.from || order.from,
                  to: order.order?.to || order.to,
                  status: 'active',
                  sequence: order.sequence,
                  reference: order.reference
                });
              });
              
              console.log(`✅ Found ${userMarketOrders.bids.length} active buy orders in ${marketPair}`);
            }

            if (userMarketOrders.asks?.length > 0) {
              activeSellOrders += userMarketOrders.asks.length;
              allMarketPairs.add(marketPair);
              
              userMarketOrders.asks.forEach(order => {
                transactionHistory.push({
                  txid: order.txid,
                  timestamp: order.timestamp || Date.now() / 1000,
                  type: 'ACTIVE_SELL_ORDER',
                  orderType: 'sell',
                  marketPair: marketPair,
                  amount: order.contract?.amount || order.amount,
                  price: order.price,
                  ticker: order.contract?.ticker || marketPair.split('/')[0],
                  from: order.contract?.from || order.from,
                  to: order.order?.to || order.to,
                  status: 'active',
                  sequence: order.sequence,
                  reference: order.reference
                });
              });
              
              console.log(`✅ Found ${userMarketOrders.asks.length} active sell orders in ${marketPair}`);
            }
          }

          // Process market orders to find user's transactions (by checking addresses)
          if (marketOrders.status === 'fulfilled' && marketOrders.value) {
            const allOrders = [...(marketOrders.value.bids || []), ...(marketOrders.value.asks || [])];
            
            for (const order of allOrders) {
              try {
                // Check if this order belongs to the user by matching account addresses
                const orderFromAddress = order.contract?.from;
                const orderToAddress = order.order?.to;
                
                // Check if any of the addresses match user's accounts
                const isUserOrder = userAccounts.some(account => 
                  account.address === orderFromAddress || 
                  account.address === orderToAddress ||
                  account.name === orderFromAddress ||
                  account.name === orderToAddress
                );

                if (isUserOrder && order.txid) {
                  allMarketPairs.add(marketPair);
                  
                  transactionHistory.push({
                    txid: order.txid,
                    timestamp: order.timestamp || Date.now() / 1000,
                    type: order.type === 'bid' ? 'MARKET_BUY_ORDER' : 'MARKET_SELL_ORDER',
                    orderType: order.type === 'bid' ? 'buy' : 'sell',
                    marketPair: marketPair,
                    amount: order.contract?.amount || order.amount,
                    price: order.price,
                    ticker: order.contract?.ticker || marketPair.split('/')[0],
                    from: orderFromAddress,
                    to: orderToAddress,
                    status: 'market_listed',
                    sequence: order.sequence,
                    reference: order.reference
                  });
                  
                  console.log(`✅ Found user market order in ${marketPair}: ${order.type}`);
                }
              } catch (error) {
                console.warn('Error processing market order:', error);
              }
            }
          }
          
        } catch (error) {
          console.warn(`Failed to check market ${marketPair}:`, error);
        }
      }

      // Step 4: Use LEDGER API to get historical transaction data
      console.log('📊 Fetching historical transactions from LEDGER API...');
      
      try {
        const ledgerTransactions = await NEXUS.utilities.apiCall('ledger/list/transactions', {
          where: `genesis=${signatureGenesis}`,
          verbose: 'detail',
          limit: 1000,
          sort: 'timestamp',
          order: 'desc'
        });

        console.log(`📋 Found ${ledgerTransactions?.length || 0} transactions in signature chain`);

        if (ledgerTransactions && Array.isArray(ledgerTransactions)) {
          for (const tx of ledgerTransactions) {
            try {
              if (tx.contracts && Array.isArray(tx.contracts)) {
                for (const contract of tx.contracts) {
                  const contractType = contract.OP;
                  
                  // Look for market-related operations
                  if (['CREATE', 'DEBIT', 'CREDIT'].includes(contractType)) {
                    let isMarketTransaction = false;
                    let marketPair = null;
                    let orderType = null;
                    
                    // Check if this involves any of our token accounts
                    const contractInvolvesUserToken = userTokenAddresses.has(contract.token) ||
                      userAccounts.some(account => 
                        account.address === contract.from ||
                        account.address === contract.to ||
                        account.name === contract.from ||
                        account.name === contract.to
                      );

                    if (contractInvolvesUserToken && contract.ticker && contract.ticker !== 'NXS') {
                      marketPair = `${contract.ticker}/NXS`;
                      isMarketTransaction = true;
                      orderType = contractType === 'DEBIT' ? 'sell' : 'buy';
                      allMarketPairs.add(marketPair);
                    }

                    // Additional detection for market operations
                    if (tx.type === 'tritium user' && contractType === 'CREATE' && contract.address) {
                      // This might be a market order creation
                      const involvedTicker = contract.ticker || userAccounts.find(acc => 
                        acc.address === contract.address
                      )?.ticker;
                      
                      if (involvedTicker && involvedTicker !== 'NXS') {
                        marketPair = `${involvedTicker}/NXS`;
                        isMarketTransaction = true;
                        orderType = 'create';
                        allMarketPairs.add(marketPair);
                      }
                    }

                    if (isMarketTransaction) {
                      const existingTx = transactionHistory.find(existing => existing.txid === tx.txid);
                      if (!existingTx) {
                        // Enhanced logic for market order display with proper NXS conversion
                        let finalAmount, finalTicker, displayPrice = null;
                        
                        if (contractType === 'CREATE' && marketPair) {
                          const [baseToken, quoteToken] = marketPair.split('/');
                          
                          // For market orders, identify the correct token amount and ensure proper conversion
                          if (orderType === 'buy') {
                            // MARKET BUY ORDER: User wants to buy baseToken with quoteToken (NXS)
                            if (contract.ticker && contract.ticker !== 'NXS' && contract.ticker === baseToken) {
                              // This contract is for the base token being bought
                              finalAmount = parseFloat(contract.amount || 0); // Raw token amount
                              finalTicker = baseToken;
                            } else if (!contract.ticker || contract.ticker === 'NXS' || contract.ticker === quoteToken) {
                              // This is the NXS payment - store raw amount and let display logic handle conversion
                              finalAmount = parseFloat(contract.amount || 0); // Store raw NXS amount (divisible units)
                              finalTicker = 'NXS'; // Keep as NXS for proper conversion in display
                              displayPrice = 1.0; // Default price for calculation
                            } else {
                              // Fallback
                              finalAmount = parseFloat(contract.amount || 0);
                              finalTicker = baseToken;
                            }
                          } else if (orderType === 'sell') {
                            // MARKET SELL ORDER: User wants to sell baseToken for quoteToken (NXS)
                            if (contract.ticker && contract.ticker !== 'NXS' && contract.ticker === baseToken) {
                              // This contract is for the base token being sold
                              finalAmount = parseFloat(contract.amount || 0); // Raw token amount
                              finalTicker = baseToken;
                            } else if (!contract.ticker || contract.ticker === 'NXS' || contract.ticker === quoteToken) {
                              // This is the NXS received - convert from divisible units
                              const nxsAmount = parseFloat(contract.amount || 0) / 1000000; // Convert NXS
                              finalAmount = nxsAmount; // Show equivalent base token amount
                              finalTicker = baseToken; // Label as base token being sold
                              displayPrice = 1.0; // Default price
                            } else {
                              // Fallback
                              finalAmount = parseFloat(contract.amount || 0);
                              finalTicker = baseToken;
                            }
                          }
                          
                          // For general transactions, handle NXS conversion properly
                        } else {
                          // Standard transaction handling with proper NXS conversion
                          if (contract.ticker === 'NXS' || !contract.ticker) {
                            finalAmount = parseFloat(contract.amount || 0) / 1000000; // Convert NXS
                            finalTicker = 'NXS';
                          } else {
                            finalAmount = parseFloat(contract.amount || 0); // Raw token amount
                            finalTicker = contract.ticker;
                          }
                          displayPrice = 1.0; // Default for non-market transactions
                        }

                        transactionHistory.push({
                          txid: tx.txid,
                          timestamp: tx.timestamp,
                          type: contractType,
                          orderType: orderType,
                          marketPair: marketPair,
                          amount: finalAmount,
                          rawAmount: contract.amount, // Keep original for reference
                          ticker: finalTicker,
                          price: displayPrice, // Price in NXS per base token
                          from: contract.from,
                          to: contract.to,
                          reference: contract.reference,
                          confirmations: tx.confirmations,
                          sequence: tx.sequence,
                          status: tx.confirmations > 0 ? 'confirmed' : 'pending'
                        });

                        // Count executed trades (confirmed transactions)
                        if (tx.confirmations > 0 && ['DEBIT', 'CREDIT'].includes(contractType)) {
                          executedTrades++;
                        }
                      }
                    }
                  }
                }
              }
            } catch (error) {
              console.warn('Error processing transaction:', error);
            }
          }
        }
      } catch (error) {
        console.warn('LEDGER API transaction retrieval failed:', error);
      }

      // Step 5: Sort and deduplicate transaction history
      const uniqueTransactions = transactionHistory.reduce((acc, tx) => {
        if (!acc.find(existing => existing.txid === tx.txid)) {
          acc.push(tx);
        }
        return acc;
      }, []);

      // Sort by timestamp (newest first)
      uniqueTransactions.sort((a, b) => b.timestamp - a.timestamp);

      // Step 6: Update trading activity state
      const updatedActivity = {
        totalTransactions: uniqueTransactions.length,
        activeMarkets: allMarketPairs.size,
        activeBuyOrders,
        activeSellOrders,
        executedTrades,
        transactionHistory: uniqueTransactions,
        discoveredPairs: Array.from(allMarketPairs),
        signatureChainGenesis: signatureGenesis,
        lastUpdated: new Date().toISOString(),
        userAccounts: userAccounts // Store for reference
      };

      setTradingActivity(updatedActivity);

      console.log(`✅ Trading activity discovery complete!`, {
        totalTransactions: updatedActivity.totalTransactions,
        activeMarkets: updatedActivity.activeMarkets,
        activeBuyOrders: updatedActivity.activeBuyOrders,
        activeSellOrders: updatedActivity.activeSellOrders,
        executedTrades: updatedActivity.executedTrades,
        discoveredPairs: updatedActivity.discoveredPairs.length,
        userAccounts: userAccounts.length
      });

      // Only show success dialog if we actually found trading activity
      if (updatedActivity.totalTransactions > 0 || updatedActivity.activeBuyOrders > 0 || updatedActivity.activeSellOrders > 0) {
        NEXUS.utilities.showSuccessDialog({
          message: 'Trading Activity Loaded Successfully',
          note: `Found ${updatedActivity.totalTransactions} total transactions across ${updatedActivity.activeMarkets} markets:\n• ${updatedActivity.activeBuyOrders} active buy orders\n• ${updatedActivity.activeSellOrders} active sell orders\n• ${updatedActivity.executedTrades} executed trades`,
        });
      } else {
        console.log('📊 Trading activity discovery completed - no activity found');
        NEXUS.utilities.showNotification({
          message: 'Trading Activity Discovery Complete',
          note: 'No trading activity found for this signature chain. Create some market orders to see activity here.',
          type: 'info'
        });
      }

    } catch (error) {
      console.error('Trading activity discovery failed:', error);
      setActivityError(error.message);
      
      NEXUS.utilities.showErrorDialog({
        message: 'Trading Activity Discovery Failed',
        note: error?.message || 'Unable to retrieve comprehensive trading activity. Please check your session status.',
      });
    } finally {
      setActivityLoading(false);
    }
  };

  // Optimized market data refresh with parallel API calls and error handling
  const refreshMarketData = async () => {
    try {
      // Use Promise.allSettled to load market data and user orders in parallel
      const [marketResult, userResult] = await Promise.allSettled([
        NEXUS.utilities.apiCall('market/list/order', {
          market: selectedMarket,
          limit: 100 // Limit results for better performance
        }),
        NEXUS.utilities.apiCall('market/user/order', {
          market: selectedMarket
        })
      ]);

      // Handle market data result
      if (marketResult.status === 'fulfilled') {
        setMarketData(marketResult.value || { bids: [], asks: [] });
      } else {
        console.error('Failed to load market data:', marketResult.reason);
        setMarketData({ bids: [], asks: [] });
      }

      // Handle user orders result
      if (userResult.status === 'fulfilled') {
        setUserOrders(userResult.value || { bids: [], asks: [] });
      } else {
        console.error('Failed to load user orders:', userResult.reason);
        setUserOrders({ bids: [], asks: [] });
      }

    } catch (error) {
      console.error('Failed to refresh market data:', error);
      setMarketData({ bids: [], asks: [] });
      setUserOrders({ bids: [], asks: [] });
    }
  };

  const loadUserAccounts = async () => {
    try {
      const accounts = await NEXUS.utilities.apiCall('finance/list/account');
      setUserAccounts(accounts || []);
    } catch (error) {
      console.error('Failed to load user accounts:', error);
    }
  };

  // Load available tokens for trading - using Register API for network-wide discovery
  const loadAvailableTokens = async () => {
    try {
      console.log('🔍 Loading available tokens using Register API for network-wide discovery...');
      
      // Use Register API to get all tokens from the network, not just user-owned tokens
      const tokens = await NEXUS.utilities.apiCall('register/list/finance:token', {
        where: 'results.currentsupply>0', // Only active tokens with supply
        limit: 1000, // Get a large number of tokens
        sort: 'ticker',
        order: 'asc'
      });
      
      console.log(`✅ Found ${tokens?.length || 0} network-wide tokens via Register API`);
      setAvailableTokens(tokens || []);
      
      // Create market pairs - all tokens can be traded against NXS
      const markets = ['CARBON/NXS']; // Default market
      if (tokens && tokens.length > 0) {
        tokens.forEach(token => {
          if (token.ticker && token.ticker !== 'NXS' && token.ticker !== 'CARBON') {
            markets.push(`${token.ticker}/NXS`);
          }
        });
      }
      
      console.log(`📈 Created ${markets.length} available trading markets`);
      setAvailableMarkets(markets);
    } catch (error) {
      console.error('Failed to load available tokens:', error);
      setAvailableTokens([]);
      
      // Fallback to Finance API for user tokens only
      try {
        console.log('🔄 Falling back to Finance API for user-owned tokens...');
        const userTokens = await NEXUS.utilities.apiCall('finance/list/token');
        setAvailableTokens(userTokens || []);
        
        const fallbackMarkets = ['CARBON/NXS'];
        if (userTokens && userTokens.length > 0) {
          userTokens.forEach(token => {
            if (token.ticker && token.ticker !== 'NXS' && token.ticker !== 'CARBON') {
              fallbackMarkets.push(`${token.ticker}/NXS`);
            }
          });
        }
        setAvailableMarkets(fallbackMarkets);
      } catch (fallbackError) {
        console.error('Fallback token loading also failed:', fallbackError);
        setAvailableTokens([]);
      }
    }
  };

  // Enhanced token discovery using Register API with Query DSL
  const loadAllTokens = async () => {
    try {
      setTokenSearchLoading(true);
      console.log('🔍 Starting Register API token discovery with Query DSL...');
      
      const discoveredTokens = new Map();
      let totalTokensFound = 0;

      // Step 1: Use Register API to discover all finance:token objects
      console.log('📊 Step 1: Querying register/list/finance:token with pagination...');
      
      let currentPage = 0;
      let hasMoreTokens = true;
      const pageSize = 100;
      
      while (hasMoreTokens && currentPage < 50) { // Limit to prevent infinite loops
        try {
          console.log(`📋 Fetching page ${currentPage + 1}...`);
          
          const registerTokens = await NEXUS.utilities.apiCall('register/list/finance:token', {
            limit: pageSize,
            page: currentPage,
            sort: 'modified',
            order: 'desc',
            where: 'results.currentsupply>0' // Only active tokens with supply
          });

          if (!registerTokens || registerTokens.length === 0) {
            hasMoreTokens = false;
            break;
          }

          console.log(`✅ Page ${currentPage + 1}: Found ${registerTokens.length} tokens`);
          
          registerTokens.forEach(token => {
            if (token.address) {
              discoveredTokens.set(token.address, {
                ...token,
                source: 'register_api_pagination',
                page: currentPage + 1
              });
              totalTokensFound++;
            }
          });

          if (registerTokens.length < pageSize) {
            hasMoreTokens = false;
          }
          
          currentPage++;
        } catch (error) {
          console.warn(`Failed to fetch page ${currentPage + 1}:`, error.message);
          hasMoreTokens = false;
        }
      }

      console.log(`📊 Register API pagination complete: ${totalTokensFound} tokens discovered`);

      // Step 2: Search for tokens by specific criteria using Query DSL
      console.log('🔍 Step 2: Using Query DSL for targeted token discovery...');
      
      const searchCriteria = [
        // Search for tokens with specific tickers using wildcards
        { where: 'results.ticker=CARBON*', name: 'carbon_variants' },
        { where: 'results.ticker=GOLD*', name: 'gold_variants' },
        { where: 'results.ticker=*TOKEN*', name: 'token_variants' },
        { where: 'results.ticker=*COIN*', name: 'coin_variants' },
        
        // Search by supply ranges
        { where: 'results.maxsupply>1000000', name: 'high_supply_tokens' },
        { where: 'results.currentsupply>0 AND results.maxsupply<1000', name: 'low_supply_tokens' },
        
        // Search recently modified tokens
        { where: 'results.modified>1700000000', name: 'recent_tokens' }
      ];

      for (const criteria of searchCriteria) {
        try {
          console.log(`🔎 Searching: ${criteria.name} with WHERE clause: ${criteria.where}`);
          
          const searchResults = await NEXUS.utilities.apiCall('register/list/finance:token', {
            where: criteria.where,
            limit: 100,
            sort: 'ticker',
            order: 'asc'
          });

          if (searchResults && Array.isArray(searchResults)) {
            console.log(`✅ ${criteria.name}: Found ${searchResults.length} tokens`);
            
            searchResults.forEach(token => {
              if (token.address && !discoveredTokens.has(token.address)) {
                discoveredTokens.set(token.address, {
                  ...token,
                  source: `register_api_search_${criteria.name}`
                });
              }
            });
          }
        } catch (error) {
          console.warn(`Search failed for ${criteria.name}:`, error.message);
        }
      }

      // Step 3: Search global names for token-related entries
      console.log('🌐 Step 3: Searching register/list/names:global for token names...');
      
      try {
        const globalNames = await NEXUS.utilities.apiCall('register/list/names:global', {
          where: '(results.name=*token* OR results.name=*TOKEN* OR results.name=*coin* OR results.name=*COIN*)',
          limit: 100,
          sort: 'name',
          order: 'asc'
        });

        if (globalNames && Array.isArray(globalNames)) {
          console.log(`🌐 Found ${globalNames.length} global names related to tokens`);
          
          // Try to resolve global names to tokens
          for (const globalName of globalNames) {
            try {
              if (globalName.name) {
                const tokenInfo = await NEXUS.utilities.apiCall('register/get/finance:token', {
                  name: globalName.name
                });
                
                if (tokenInfo && tokenInfo.address && !discoveredTokens.has(tokenInfo.address)) {
                  discoveredTokens.set(tokenInfo.address, {
                    ...tokenInfo,
                    source: 'global_name_resolution',
                    globalName: globalName.name
                  });
                  console.log(`✅ Resolved global name ${globalName.name} to token`);
                }
              }
            } catch (error) {
              // Not all global names will resolve to tokens
            }
          }
        }
      } catch (error) {
        console.warn('Global names search failed:', error.message);
      }

      // Step 4: Search local names for token accounts
      console.log('📛 Step 4: Searching register/list/names:name for local token names...');
      
      try {
        const localNames = await NEXUS.utilities.apiCall('register/list/names:name', {
          where: '(results.name=*token* OR results.name=*TOKEN*)',
          limit: 100,
          sort: 'name',
          order: 'asc'
        });

        if (localNames && Array.isArray(localNames)) {
          console.log(`📛 Found ${localNames.length} local names related to tokens`);
          
          // Try to resolve local names to tokens
          for (const localName of localNames) {
            try {
              if (localName.name) {
                const tokenInfo = await NEXUS.utilities.apiCall('register/get/finance:token', {
                  name: localName.name
                });
                
                if (tokenInfo && tokenInfo.address && !discoveredTokens.has(tokenInfo.address)) {
                  discoveredTokens.set(tokenInfo.address, {
                    ...tokenInfo,
                    source: 'local_name_resolution',
                    localName: localName.name
                  });
                  console.log(`✅ Resolved local name ${localName.name} to token`);
                }
              }
            } catch (error) {
              // Not all local names will resolve to tokens
            }
          }
        }
      } catch (error) {
        console.warn('Local names search failed:', error.message);
      }

      // Step 5: Additional Register API discovery with different criteria
      console.log('🔍 Step 5: Additional Register API discovery with broader criteria...');
      
      try {
        // Search for tokens with any supply (including zero current supply but max supply > 0)
        const additionalTokens = await NEXUS.utilities.apiCall('register/list/finance:token', {
          where: 'results.maxsupply>0', // Any token with maximum supply
          limit: 500,
          sort: 'created',
          order: 'desc'
        });
        
        if (additionalTokens && Array.isArray(additionalTokens)) {
          console.log(`🔍 Found ${additionalTokens.length} additional tokens via broader Register API search`);
          
          additionalTokens.forEach(token => {
            if (token.address && !discoveredTokens.has(token.address)) {
              discoveredTokens.set(token.address, {
                ...token,
                source: 'register_api_broader_search'
              });
            }
          });
        }
      } catch (error) {
        console.warn('Additional Register API discovery failed:', error.message);
      }

      // Step 6: Discover tokens from Market API - all active trading pairs
      console.log('💹 Step 6: Discovering tokens from Market API (all active markets)...');
      
      try {
        // First, try to discover all active markets by checking common trading pairs
        const commonTokens = ['NXS', 'CARBON', 'GOLD', 'SILVER', 'BTC', 'ETH', 'USDT', 'TOKEN', 'COIN'];
        const marketTokens = new Set();
        
        // Check for active markets with common base tokens
        for (const baseToken of commonTokens) {
          try {
            // Try to find markets with this base token
            const marketData = await NEXUS.utilities.apiCall('market/list/order', {
              market: `${baseToken}/NXS`,
              limit: 1
            });
            
            if (marketData && (marketData.bids?.length > 0 || marketData.asks?.length > 0)) {
              marketTokens.add(baseToken);
              console.log(`📈 Found active market: ${baseToken}/NXS`);
              
              // Extract token addresses from market orders
              [...(marketData.bids || []), ...(marketData.asks || [])].forEach(order => {
                if (order.contract?.token && order.contract?.ticker) {
                  try {
                    // Try to get full token info from the market order
                    const tokenAddress = order.contract.token;
                    const tokenTicker = order.contract.ticker;
                    
                    if (tokenAddress !== '0' && !discoveredTokens.has(tokenAddress)) {
                      // Create a basic token object from market data
                      discoveredTokens.set(tokenAddress, {
                        address: tokenAddress,
                        ticker: tokenTicker,
                        source: 'market_api_discovery',
                        marketPair: `${baseToken}/NXS`,
                        hasActiveMarket: true
                      });
                      console.log(`💹 Discovered token from market: ${tokenTicker} (${tokenAddress})`);
                    }
                  } catch (tokenError) {
                    // Skip invalid token data
                  }
                }
              });
            }
          } catch (marketError) {
            // No active market for this pair
          }
        }
        
        // Also check reverse pairs (NXS as quote token)
        for (const quoteToken of commonTokens) {
          if (quoteToken === 'NXS') continue;
          
          try {
            const marketData = await NEXUS.utilities.apiCall('market/list/order', {
              market: `NXS/${quoteToken}`,
              limit: 1
            });
            
            if (marketData && (marketData.bids?.length > 0 || marketData.asks?.length > 0)) {
              marketTokens.add(quoteToken);
              console.log(`📈 Found active market: NXS/${quoteToken}`);
              
              // Extract token addresses from market orders
              [...(marketData.bids || []), ...(marketData.asks || [])].forEach(order => {
                if (order.order?.token && order.order?.ticker) {
                  try {
                    const tokenAddress = order.order.token;
                    const tokenTicker = order.order.ticker;
                    
                    if (tokenAddress !== '0' && !discoveredTokens.has(tokenAddress)) {
                      discoveredTokens.set(tokenAddress, {
                        address: tokenAddress,
                        ticker: tokenTicker,
                        source: 'market_api_discovery',
                        marketPair: `NXS/${quoteToken}`,
                        hasActiveMarket: true
                      });
                      console.log(`💹 Discovered token from market: ${tokenTicker} (${tokenAddress})`);
                    }
                  } catch (tokenError) {
                    // Skip invalid token data
                  }
                }
              });
            }
          } catch (marketError) {
            // No active market for this pair
          }
        }
        
        console.log(`💹 Market API discovery complete: Found ${marketTokens.size} active markets`);
        
        // Additional discovery: Try to find tokens from any discovered tokens as base pairs
        console.log('🔄 Expanding market discovery with discovered tokens...');
        const discoveredTickers = Array.from(discoveredTokens.values())
          .map(token => token.ticker)
          .filter(ticker => ticker && ticker !== 'NXS')
          .slice(0, 20); // Limit to prevent too many API calls
        
        for (const ticker of discoveredTickers) {
          try {
            // Check if this token has active markets
            const marketData = await NEXUS.utilities.apiCall('market/list/order', {
              market: `${ticker}/NXS`,
              limit: 1
            });
            
            if (marketData && (marketData.bids?.length > 0 || marketData.asks?.length > 0)) {
              console.log(`📈 Found additional active market: ${ticker}/NXS`);
              
              // Extract any additional tokens from these orders
              [...(marketData.bids || []), ...(marketData.asks || [])].forEach(order => {
                if (order.order?.token && order.order?.ticker) {
                  try {
                    const tokenAddress = order.order.token;
                    const tokenTicker = order.order.ticker;
                    
                    if (tokenAddress !== '0' && !discoveredTokens.has(tokenAddress)) {
                      discoveredTokens.set(tokenAddress, {
                        address: tokenAddress,
                        ticker: tokenTicker,
                        source: 'market_api_expansion',
                        marketPair: `${ticker}/NXS`,
                        hasActiveMarket: true
                      });
                      console.log(`💹 Discovered additional token: ${tokenTicker} (${tokenAddress})`);
                    }
                  } catch (tokenError) {
                    // Skip invalid token data
                  }
                }
              });
            }
          } catch (marketError) {
            // No active market for this pair
          }
        }
        
      } catch (error) {
        console.warn('Market API discovery failed:', error.message);
      }
      
      // Step 7: Enhance discovered tokens from all sources with Register API data
      console.log('🔍 Step 7: Enhancing market-discovered tokens with Register API data...');
      
      const marketDiscoveredTokens = Array.from(discoveredTokens.values())
        .filter(token => token.source === 'market_api_discovery');
      
      for (const marketToken of marketDiscoveredTokens) {
        try {
          // Try to get full token information from Register API
          const fullTokenInfo = await NEXUS.utilities.apiCall('register/get/finance:token', {
            address: marketToken.address
          });
          
          if (fullTokenInfo) {
            // Update the token with full information
            discoveredTokens.set(marketToken.address, {
              ...fullTokenInfo,
              source: 'market_api_enhanced',
              marketPair: marketToken.marketPair,
              hasActiveMarket: true
            });
            console.log(`🔍 Enhanced market token: ${fullTokenInfo.ticker || marketToken.ticker}`);
          }
        } catch (error) {
          // Keep the basic market token info if Register API fails
          console.warn(`Could not enhance market token ${marketToken.ticker}:`, error.message);
        }
      }
      
      // Convert Map to Array and enhance with market data
      const tokensArray = Array.from(discoveredTokens.values());
      console.log(`🎯 Total unique tokens discovered: ${tokensArray.length}`);

      // Step 8: Enhance tokens with market activity data using parallel processing
      console.log('📈 Step 8: Enhancing tokens with market activity data...');
      
      const enhancedTokens = await Promise.allSettled(
        tokensArray.map(async (token) => {
          try {
            let marketActivity = {
              hasMarket: false,
              activeBids: 0,
              activeAsks: 0,
              lastPrice: 0,
              volume24h: 0
            };

            if (token.ticker && token.ticker !== 'NXS') {
              try {
                const marketPair = `${token.ticker}/NXS`;
                const marketData = await NEXUS.utilities.apiCall('market/list/order', {
                  market: marketPair,
                  limit: 10 // Reduced for performance
                });

                if (marketData && (marketData.bids?.length > 0 || marketData.asks?.length > 0)) {
                  marketActivity.hasMarket = true;
                  marketActivity.activeBids = marketData.bids?.length || 0;
                  marketActivity.activeAsks = marketData.asks?.length || 0;
                  
                  // Calculate basic market stats
                  if (marketData.bids?.length > 0) {
                    const prices = marketData.bids.map(bid => parseFloat(bid.price || 0));
                    marketActivity.lastPrice = Math.max(...prices);
                  }
                  if (marketData.asks?.length > 0 && marketActivity.lastPrice === 0) {
                    const prices = marketData.asks.map(ask => parseFloat(ask.price || 0));
                    marketActivity.lastPrice = Math.min(...prices);
                  }
                }
              } catch (marketError) {
                // No market activity for this token
              }
            }

            return {
              ...token,
              marketActivity,
              totalSupply: parseFloat(token.maxsupply || 0),
              currentSupply: parseFloat(token.currentsupply || 0),
              decimals: parseInt(token.decimals || 0),
              displayName: token.ticker || token.name || 'Unknown Token',
              isActive: marketActivity.hasMarket || (parseFloat(token.currentsupply || 0) > 0),
              lastModified: token.modified ? new Date(token.modified * 1000) : null,
              // Add search metadata
              searchable: {
                ticker: (token.ticker || '').toLowerCase(),
                name: (token.name || '').toLowerCase(),
                address: (token.address || '').toLowerCase(),
                globalName: (token.globalName || '').toLowerCase(),
                localName: (token.localName || '').toLowerCase()
              }
            };
          } catch (error) {
            console.warn(`Error enhancing token ${token.ticker}:`, error);
            return null;
          }
        })
      );

      // Filter successful results
      const validTokens = enhancedTokens
        .filter(result => result.status === 'fulfilled' && result.value !== null)
        .map(result => result.value);

      console.log(`✅ Successfully enhanced ${validTokens.length} tokens`);

      // Sort tokens by relevance and activity
      const sortedTokens = validTokens.sort((a, b) => {
        // Active markets first
        if (a.marketActivity.hasMarket !== b.marketActivity.hasMarket) {
          return b.marketActivity.hasMarket ? 1 : -1;
        }
        // Then by market activity
        const aActivity = a.marketActivity.activeBids + a.marketActivity.activeAsks;
        const bActivity = b.marketActivity.activeBids + b.marketActivity.activeAsks;
        if (aActivity !== bActivity) {
          return bActivity - aActivity;
        }
        // Then by current supply
        const aSupply = a.currentSupply || 0;
        const bSupply = b.currentSupply || 0;
        if (aSupply !== bSupply) {
          return bSupply - aSupply;
        }
        // Finally by ticker alphabetically
        const aTicker = a.ticker || '';
        const bTicker = b.ticker || '';
        return aTicker.localeCompare(bTicker);
      });

      setAllTokens(sortedTokens);
      setFilteredTokens(sortedTokens);
      
      // Log discovery statistics
      const sourceStats = {};
      sortedTokens.forEach(token => {
        const source = token.source || 'unknown';
        sourceStats[source] = (sourceStats[source] || 0) + 1;
      });
      
      console.log(`📊 Token discovery complete! Sources:`, sourceStats);
      console.log(`🎉 Total tokens loaded: ${sortedTokens.length}`);

      return sortedTokens;
      
    } catch (error) {
      console.error('Register API token discovery failed:', error);
      NEXUS.utilities.showErrorDialog({
        message: 'Register API Token Discovery Failed',
        note: error?.message || 'Could not discover tokens using Register API',
      });
      return [];
    } finally {
      setTokenSearchLoading(false);
    }
  };

  // Memoized order processing functions to avoid recalculation
  const processedMarketData = useMemo(() => {
    const processOrders = (orders) => {
      return orders?.map(order => {
        // Helper function to convert from divisible units (1 mill = 0.000001)
        const convertFromDivisibleUnits = (amount) => {
          return parseFloat(amount || 0) / 1000000;
        };

        // Parse market pair to understand base and quote tokens
        const [baseToken, quoteToken] = selectedMarket.split('/');
        
        // Get raw amounts from the order
        const contractAmountRaw = parseFloat(order.contract?.amount || 0);
        const orderAmountRaw = parseFloat(order.order?.amount || 0);
        
        // Price from API is already in correct format (quote token per base token)
        let price = parseFloat(order.price || 0);
        
        // For NXS quote token, price needs to be converted from divisible units
        if (quoteToken === 'NXS') {
          price = convertFromDivisibleUnits(price);
        }
        
        // Calculate amounts based on order type and market structure
        let baseAmount, quoteAmount, totalValue;
        let displayAmount, displayTotal, displayPrice;
        
        if (order.type === 'bid') {
          // BID: Buying base token with quote token
          // For GOLD/CARBON pair: buying GOLD with CARBON
          // API stores: contract.amount = quote token amount (total cost), order.amount = base token amount
          
          // Apply divisible unit conversion only when NXS is involved
          if (quoteToken === 'NXS') {
            // Quote token is NXS: convert from divisible units
            quoteAmount = convertFromDivisibleUnits(contractAmountRaw); // Total cost in NXS
            baseAmount = orderAmountRaw; // Base token amount (raw)
          } else if (baseToken === 'NXS') {
            // Base token is NXS: convert from divisible units
            quoteAmount = contractAmountRaw; // Total cost in quote token (raw)
            baseAmount = convertFromDivisibleUnits(orderAmountRaw); // Base token amount in NXS
          } else {
            // For non-NXS token pairs: use raw amounts directly
            quoteAmount = contractAmountRaw; // Total cost in quote token
            baseAmount = orderAmountRaw;     // Base token amount
          }
          
          // For display: show base amount and total cost
          displayAmount = baseAmount;  // Amount of base token being bought
          displayTotal = quoteAmount;  // Total quote token cost (what was actually sent to API)
          displayPrice = price;        // Price per base token unit
          
        } else {
          // ASK: Selling base token for quote token
          // For GOLD/CARBON pair: selling GOLD for CARBON
          // API stores: contract.amount = base token amount, order.amount = quote token amount
          
          // Apply divisible unit conversion only when NXS is involved
          if (baseToken === 'NXS') {
            // Base token is NXS: convert from divisible units
            baseAmount = convertFromDivisibleUnits(contractAmountRaw); // Base token amount in NXS
            quoteAmount = orderAmountRaw; // Quote token amount (raw)
          } else if (quoteToken === 'NXS') {
            // Quote token is NXS: convert from divisible units
            baseAmount = contractAmountRaw; // Base token amount (raw)
            quoteAmount = convertFromDivisibleUnits(orderAmountRaw); // Quote token amount in NXS
          } else {
            // For non-NXS token pairs: use raw amounts directly
            baseAmount = contractAmountRaw; // Base token amount
            quoteAmount = orderAmountRaw;   // Quote token amount
          }
          
          // Calculate total received: baseAmount * price
          totalValue = baseAmount * price;
          
          displayAmount = baseAmount; // Amount of base token being sold
          displayTotal = totalValue;  // Total quote token received
          displayPrice = price;       // Price per base token unit
        }

        // Calculate what the executor will receive/need
        let wantingAmount, wantingTicker;
        if (order.type === 'bid') {
          // For buy orders: executor (seller) will receive the total quote token amount
          wantingAmount = displayTotal; // Total quote token amount
          wantingTicker = quoteToken;
        } else {
          // For sell orders: executor (buyer) needs the total quote token amount
          wantingAmount = displayTotal; // Total quote token amount needed
          wantingTicker = quoteToken;
        }

        return {
          ...order,
          processedData: {
            baseAmount,
            quoteAmount,
            price: displayPrice,
            totalValue: displayTotal,
            formattedPrice: displayPrice.toFixed(6),
            formattedAmount: displayAmount.toFixed(6),
            formattedTotalValue: displayTotal.toFixed(6),
            formattedWanting: wantingAmount.toFixed(6),
            wantingTicker: wantingTicker,
            shortTxid: order.txid?.substring(0, 16),
            shortFromAddress: order.contract?.from?.substring(0, 20),
            shortToAddress: order.order?.to?.substring(0, 20),
            formattedTimestamp: new Date(order.timestamp * 1000).toLocaleString(),
            baseToken,
            quoteToken,
            orderType: order.type,
            // Add numerical price for sorting
            numericPrice: displayPrice,
            numericAmount: displayAmount,
            timestamp: order.timestamp
          }
        };
      }) || [];
    };

    // Process orders and apply proper order book sorting
    const processedBids = processOrders(marketData.bids);
    const processedAsks = processOrders(marketData.asks);

    // Sort bids (buy orders) by price: HIGHEST to LOWEST (best buy prices first)
    // In a standard order book, buyers want to pay the highest price to get filled first
    const sortedBids = processedBids.sort((a, b) => {
      const priceDiff = b.processedData.numericPrice - a.processedData.numericPrice;
      if (priceDiff !== 0) return priceDiff;
      // If prices are equal, sort by timestamp (older orders first)
      return a.processedData.timestamp - b.processedData.timestamp;
    });

    // Sort asks (sell orders) by price: LOWEST to HIGHEST (best sell prices first)
    // In a standard order book, sellers want to sell at the lowest price to get filled first
    const sortedAsks = processedAsks.sort((a, b) => {
      const priceDiff = a.processedData.numericPrice - b.processedData.numericPrice;
      if (priceDiff !== 0) return priceDiff;
      // If prices are equal, sort by timestamp (older orders first)
      return a.processedData.timestamp - b.processedData.timestamp;
    });

    return {
      bids: sortedBids,
      asks: sortedAsks
    };
  }, [marketData, selectedMarket]);

  // Enhanced filtering with Register API real-time search
  const filterAndSortTokens = async () => {
    try {
      let filtered = [...allTokens];

      // Enhanced Register API search with comprehensive capabilities
      if (tokenFilter && tokenFilter.length >= 1) {
        const searchTerm = tokenFilter.trim();
        
        // Advanced pattern detection
        const isAddress = /^8[A-Za-z0-9]{50,}$/.test(searchTerm);
        const isPartialAddress = /^8[A-Za-z0-9]{10,49}$/.test(searchTerm);
        const isGlobalName = searchTerm.includes('::');
        const isLocalName = searchTerm.includes(':') && !isGlobalName;
        const isNumeric = /^\d+(\.\d+)?$/.test(searchTerm);
        const isHex = /^[0-9a-fA-F]+$/.test(searchTerm) && searchTerm.length >= 8;

        console.log(`🔍 Enhanced Register API Search: "${searchTerm}"`);
        console.log(`📊 Pattern Analysis: Address=${isAddress}, PartialAddr=${isPartialAddress}, Global=${isGlobalName}, Local=${isLocalName}, Numeric=${isNumeric}, Hex=${isHex}`);

        try {
          // 1. Direct address lookup (exact match)
          if (isAddress) {
            console.log(`🎯 Direct address lookup: ${searchTerm}`);
            const directToken = await NEXUS.utilities.apiCall('register/get/finance:token', {
              address: searchTerm
            });
            
            if (directToken && directToken.address) {
              const existingToken = filtered.find(t => t.address === directToken.address);
              if (!existingToken) {
                const enhancedToken = await enhanceTokenData(directToken, 'direct_address_lookup');
                filtered.unshift(enhancedToken);
                console.log(`✅ Found token by direct address: ${directToken.ticker}`);
              }
            }
          }
          
          // 2. Partial address search using filtering
          else if (isPartialAddress) {
            console.log(`🔍 Partial address search: ${searchTerm}*`);
            const partialResults = await NEXUS.utilities.apiCall('register/list/finance:token', {
              where: `results.address=${searchTerm}*`,
              limit: 50,
              sort: 'ticker',
              order: 'asc'
            });
            
            if (partialResults && Array.isArray(partialResults)) {
              console.log(`✅ Partial address search: Found ${partialResults.length} tokens`);
              for (const token of partialResults) {
                const existingToken = filtered.find(t => t.address === token.address);
                if (!existingToken && token.address) {
                  const enhancedToken = await enhanceTokenData(token, 'partial_address_search');
                  filtered.push(enhancedToken);
                }
              }
            }
          }
          
          // 3. Name-based lookup (global and local names)
          else if (isGlobalName || isLocalName) {
            console.log(`🌐 Name-based lookup: ${searchTerm}`);
            const nameToken = await NEXUS.utilities.apiCall('register/get/finance:token', {
              name: searchTerm
            });
            
            if (nameToken && nameToken.address) {
              const existingToken = filtered.find(t => t.address === nameToken.address);
              if (!existingToken) {
                const enhancedToken = await enhanceTokenData(nameToken, 'direct_name_lookup');
                enhancedToken.searchable.globalName = isGlobalName ? searchTerm.toLowerCase() : '';
                enhancedToken.searchable.localName = isLocalName ? searchTerm.toLowerCase() : '';
                filtered.unshift(enhancedToken);
                console.log(`✅ Found token by name: ${nameToken.ticker}`);
              }
            }
            
            // Also search for partial name matches
            const nameSearches = [
              { where: `results.name=*${searchTerm}*`, type: 'name_contains' },
              { where: `results.name=${searchTerm}*`, type: 'name_prefix' }
            ];
            
            for (const search of nameSearches) {
              try {
                const nameResults = await NEXUS.utilities.apiCall('register/list/finance:token', {
                  where: search.where,
                  limit: 30,
                  sort: 'ticker',
                  order: 'asc'
                });
                
                if (nameResults && Array.isArray(nameResults)) {
                  console.log(`✅ ${search.type}: Found ${nameResults.length} tokens`);
                  for (const token of nameResults) {
                    const existingToken = filtered.find(t => t.address === token.address);
                    if (!existingToken && token.address) {
                      const enhancedToken = await enhanceTokenData(token, `name_search_${search.type}`);
                      filtered.push(enhancedToken);
                    }
                  }
                }
              } catch (error) {
                console.log(`${search.type} search failed:`, error.message);
              }
            }
          }
          
          // 4. Comprehensive wildcard and pattern searches
          else {
            console.log(`🔎 Comprehensive search patterns for: ${searchTerm}`);
            
            const searchPatterns = [
              // Exact matches (highest priority)
              { where: `results.ticker=${searchTerm.toUpperCase()}`, name: 'exact_ticker', priority: 1 },
              { where: `results.name=${searchTerm}`, name: 'exact_name', priority: 1 },
              
              // Prefix matches (high priority)
              { where: `results.ticker=${searchTerm.toUpperCase()}*`, name: 'prefix_ticker', priority: 2 },
              { where: `results.name=${searchTerm}*`, name: 'prefix_name', priority: 2 },
              
              // Contains matches (medium priority)
              { where: `results.ticker=*${searchTerm.toUpperCase()}*`, name: 'contains_ticker', priority: 3 },
              { where: `results.name=*${searchTerm}*`, name: 'contains_name', priority: 3 },
              
              // Case-insensitive variations
              { where: `results.ticker=*${searchTerm.toLowerCase()}*`, name: 'contains_ticker_lower', priority: 4 },
              { where: `results.name=*${searchTerm.toLowerCase()}*`, name: 'contains_name_lower', priority: 4 }
            ];
            
            // Add numeric-specific searches if applicable
            if (isNumeric) {
              const numValue = parseFloat(searchTerm);
              searchPatterns.push(
                { where: `results.currentsupply=${numValue}`, name: 'exact_supply', priority: 2 },
                { where: `results.maxsupply=${numValue}`, name: 'exact_max_supply', priority: 2 },
                { where: `results.decimals=${parseInt(searchTerm)}`, name: 'exact_decimals', priority: 2 }
              );
            }
            
            // Sort patterns by priority
            searchPatterns.sort((a, b) => a.priority - b.priority);
            
            for (const pattern of searchPatterns) {
              try {
                console.log(`🔍 Trying ${pattern.name}: ${pattern.where}`);
                
                const searchResults = await NEXUS.utilities.apiCall('register/list/finance:token', {
                  where: pattern.where,
                  limit: pattern.priority === 1 ? 10 : (pattern.priority === 2 ? 25 : 50),
                  sort: tokenSortBy === 'ticker' ? 'ticker' : (tokenSortBy === 'modified' ? 'modified' : 'ticker'),
                  order: tokenSortOrder || 'asc'
                });

                if (searchResults && Array.isArray(searchResults) && searchResults.length > 0) {
                  console.log(`✅ ${pattern.name}: Found ${searchResults.length} tokens`);
                  
                  for (const searchToken of searchResults) {
                    const existingToken = filtered.find(t => t.address === searchToken.address);
                    if (!existingToken && searchToken.address) {
                      const enhancedToken = await enhanceTokenData(searchToken, `pattern_search_${pattern.name}`);
                      enhancedToken.searchPriority = pattern.priority;
                      filtered.push(enhancedToken);
                    }
                  }
                  
                  // For exact matches, break early to prioritize results
                  if (pattern.priority === 1 && searchResults.length > 0) {
                    console.log(`🎯 Exact match found, prioritizing results`);
                    break;
                  }
                }
              } catch (searchError) {
                console.log(`Search failed for ${pattern.name}:`, searchError.message);
              }
            }
          }
          
          // 5. Advanced name resolution searches
          if (searchTerm.length >= 3) {
            console.log(`🌐 Advanced name resolution search`);
            
            try {
              // Search global names
              const globalNameResults = await NEXUS.utilities.apiCall('register/list/names:global', {
                where: `results.name=*${searchTerm}*`,
                limit: 20
              });
              
              if (globalNameResults && Array.isArray(globalNameResults)) {
                console.log(`🌍 Found ${globalNameResults.length} global names matching search`);
                
                for (const nameEntry of globalNameResults) {
                  if (nameEntry.name && (nameEntry.name.toLowerCase().includes('token') || 
                      nameEntry.name.toLowerCase().includes(searchTerm.toLowerCase()))) {
                    try {
                      const resolvedToken = await NEXUS.utilities.apiCall('register/get/finance:token', {
                        name: nameEntry.name
                      });
                      
                      if (resolvedToken && resolvedToken.address) {
                        const existingToken = filtered.find(t => t.address === resolvedToken.address);
                        if (!existingToken) {
                          const enhancedToken = await enhanceTokenData(resolvedToken, 'global_name_resolution');
                          enhancedToken.searchable.globalName = nameEntry.name.toLowerCase();
                          filtered.push(enhancedToken);
                          console.log(`✅ Resolved global name ${nameEntry.name} to token ${resolvedToken.ticker}`);
                        }
                      }
                    } catch (resolveError) {
                      // Silent fail for name resolution
                    }
                  }
                }
              }
              
              // Search local names
              const localNameResults = await NEXUS.utilities.apiCall('register/list/names:name', {
                where: `results.name=*${searchTerm}*`,
                limit: 20
              });
              
              if (localNameResults && Array.isArray(localNameResults)) {
                console.log(`🏠 Found ${localNameResults.length} local names matching search`);
                
                for (const nameEntry of localNameResults) {
                  if (nameEntry.name && (nameEntry.name.toLowerCase().includes('token') || 
                      nameEntry.name.toLowerCase().includes(searchTerm.toLowerCase()))) {
                    try {
                      const resolvedToken = await NEXUS.utilities.apiCall('register/get/finance:token', {
                        name: nameEntry.name
                      });
                      
                      if (resolvedToken && resolvedToken.address) {
                        const existingToken = filtered.find(t => t.address === resolvedToken.address);
                        if (!existingToken) {
                          const enhancedToken = await enhanceTokenData(resolvedToken, 'local_name_resolution');
                          enhancedToken.searchable.localName = nameEntry.name.toLowerCase();
                          filtered.push(enhancedToken);
                          console.log(`✅ Resolved local name ${nameEntry.name} to token ${resolvedToken.ticker}`);
                        }
                      }
                    } catch (resolveError) {
                      // Silent fail for name resolution
                    }
                  }
                }
              }
            } catch (nameSearchError) {
              console.log('Name resolution search failed:', nameSearchError.message);
            }
          }
          
        } catch (searchError) {
          console.warn('Enhanced Register API search failed, using local filter:', searchError.message);
        }
      }

      // Apply enhanced local text filter as fallback or enhancement
      if (tokenFilter) {
        const filterLower = tokenFilter.toLowerCase();
        filtered = filtered.filter(token => {
          if (!token.searchable) {
            // Fallback for tokens without searchable metadata
            return (
              (token.ticker && token.ticker.toLowerCase().includes(filterLower)) ||
              (token.name && token.name.toLowerCase().includes(filterLower)) ||
              (token.address && token.address.toLowerCase().includes(filterLower))
            );
          }
          
          return (
            token.searchable.ticker.includes(filterLower) ||
            token.searchable.name.includes(filterLower) ||
            token.searchable.address.includes(filterLower) ||
            token.searchable.globalName.includes(filterLower) ||
            token.searchable.localName.includes(filterLower)
          );
        });
      }

      // Remove duplicates by address and enhance with search scoring
      const uniqueFiltered = filtered.filter((token, index, self) => 
        index === self.findIndex(t => t.address === token.address)
      );

      // Calculate search relevance scores for better ranking
      if (tokenFilter && tokenFilter.length >= 1) {
        const searchLower = tokenFilter.toLowerCase();
        uniqueFiltered.forEach(token => {
          let relevanceScore = 0;
          
          // Exact matches get highest score
          if (token.searchable?.ticker === searchLower) relevanceScore += 100;
          if (token.searchable?.name === searchLower) relevanceScore += 90;
          if (token.searchable?.address === searchLower) relevanceScore += 95;
          
          // Prefix matches get high score
          if (token.searchable?.ticker.startsWith(searchLower)) relevanceScore += 80;
          if (token.searchable?.name.startsWith(searchLower)) relevanceScore += 70;
          
          // Contains matches get medium score
          if (token.searchable?.ticker.includes(searchLower)) relevanceScore += 60;
          if (token.searchable?.name.includes(searchLower)) relevanceScore += 50;
          if (token.searchable?.address.includes(searchLower)) relevanceScore += 40;
          
          // Name resolution matches get bonus
          if (token.searchable?.globalName.includes(searchLower)) relevanceScore += 30;
          if (token.searchable?.localName.includes(searchLower)) relevanceScore += 25;
          
          // Search priority bonus (from pattern matching)
          if (token.searchPriority) {
            relevanceScore += (6 - token.searchPriority) * 10; // Higher priority = lower number = higher score
          }
          
          // Market activity bonus
          if (token.marketActivity?.hasMarket) relevanceScore += 10;
          if (token.marketActivity?.activeBids > 0) relevanceScore += 5;
          if (token.marketActivity?.activeAsks > 0) relevanceScore += 5;
          
          token.relevanceScore = relevanceScore;
        });
      }

      // Enhanced sorting with multiple criteria
      uniqueFiltered.sort((a, b) => {
        // If we have a search filter, prioritize relevance first
        if (tokenFilter && tokenFilter.length >= 1) {
          const relevanceDiff = (b.relevanceScore || 0) - (a.relevanceScore || 0);
          if (relevanceDiff !== 0) return relevanceDiff;
        }
        
        let aVal, bVal;
        
        switch (tokenSortBy) {
          case 'ticker':
            aVal = (a.ticker || '').toLowerCase();
            bVal = (b.ticker || '').toLowerCase();
            break;
          case 'name':
            aVal = (a.name || a.ticker || '').toLowerCase();
            bVal = (b.name || b.ticker || '').toLowerCase();
            break;
          case 'supply':
            aVal = a.currentSupply || 0;
            bVal = b.currentSupply || 0;
            break;
          case 'marketActivity':
            aVal = (a.marketActivity?.activeBids || 0) + (a.marketActivity?.activeAsks || 0);
            bVal = (b.marketActivity?.activeBids || 0) + (b.marketActivity?.activeAsks || 0);
            break;
          case 'lastPrice':
            aVal = a.marketActivity?.lastPrice || 0;
            bVal = b.marketActivity?.lastPrice || 0;
            break;
          case 'modified':
            aVal = a.modified || 0;
            bVal = b.modified || 0;
            break;
          case 'relevance':
            aVal = a.relevanceScore || 0;
            bVal = b.relevanceScore || 0;
            break;
          default:
            aVal = (a.ticker || '').toLowerCase();
            bVal = (b.ticker || '').toLowerCase();
        }

        if (tokenSortOrder === 'asc') {
          return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        } else {
          return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        }
      });

      // Apply advanced result prioritization
      if (tokenFilter && tokenFilter.length >= 1) {
        const directResults = uniqueFiltered.filter(token => 
          token.source && (
            token.source.includes('direct_') || 
            token.source.includes('exact_')
          )
        );
        const patternResults = uniqueFiltered.filter(token => 
          token.source && (
            token.source.includes('pattern_search_') ||
            token.source.includes('wildcard_') ||
            token.source.includes('name_search_')
          )
        );
        const nameResolutionResults = uniqueFiltered.filter(token => 
          token.source && token.source.includes('_name_resolution')
        );
        const otherResults = uniqueFiltered.filter(token => 
          !token.source || (
            !token.source.includes('direct_') && 
            !token.source.includes('exact_') &&
            !token.source.includes('pattern_search_') &&
            !token.source.includes('wildcard_') &&
            !token.source.includes('name_search_') &&
            !token.source.includes('_name_resolution')
          )
        );
        
        // Combine results with priority: direct > pattern > name resolution > others
        const prioritizedResults = [
          ...directResults,
          ...patternResults,
          ...nameResolutionResults,
          ...otherResults
        ];
        
        setFilteredTokens(prioritizedResults);
        console.log(`🎯 Search Results Summary: Direct=${directResults.length}, Pattern=${patternResults.length}, NameRes=${nameResolutionResults.length}, Other=${otherResults.length}, Total=${prioritizedResults.length}`);
      } else {
        setFilteredTokens(uniqueFiltered);
      }
      
      setTokenPage(0); // Reset to first page when filtering
      
    } catch (error) {
      console.error('Token filtering failed:', error);
      // Fallback to basic local filtering
      let filtered = allTokens;
      if (tokenFilter) {
        const filterLower = tokenFilter.toLowerCase();
        filtered = filtered.filter(token =>
          (token.ticker && token.ticker.toLowerCase().includes(filterLower)) ||
          (token.address && token.address.toLowerCase().includes(filterLower))
        );
      }
      setFilteredTokens(filtered);
      setTokenPage(0);
    }
  };

  // Helper function to enhance token data with consistent structure
  const enhanceTokenData = async (tokenData, source) => {
    try {
      // Get market activity data if available
      let marketActivity = { hasMarket: false, activeBids: 0, activeAsks: 0, lastPrice: 0, volume24h: 0 };
      
      if (tokenData.ticker) {
        try {
          const marketData = await NEXUS.utilities.apiCall('market/list/order', {
            where: `results.market=${tokenData.ticker}/NXS`,
            limit: 100
          });
          
          if (marketData && Array.isArray(marketData)) {
            const activeBids = marketData.filter(order => order.type === 'bid').length;
            const activeAsks = marketData.filter(order => order.type === 'ask').length;
            const lastPrice = marketData.length > 0 ? (marketData[0].price || 0) : 0;
            
            marketActivity = {
              hasMarket: marketData.length > 0,
              activeBids,
              activeAsks,
              lastPrice,
              volume24h: 0 // Could be calculated from recent orders
            };
          }
        } catch (marketError) {
          // Silent fail for market data
        }
      }
      
      return {
        ...tokenData,
        source,
        marketActivity,
        totalSupply: parseFloat(tokenData.maxsupply || 0),
        currentSupply: parseFloat(tokenData.currentsupply || 0),
        decimals: parseInt(tokenData.decimals || 0),
        displayName: tokenData.ticker || tokenData.name || 'Unknown Token',
        isActive: parseFloat(tokenData.currentsupply || 0) > 0,
        lastModified: tokenData.modified ? new Date(tokenData.modified * 1000) : null,
        searchable: {
          ticker: (tokenData.ticker || '').toLowerCase(),
          name: (tokenData.name || '').toLowerCase(),
          address: (tokenData.address || '').toLowerCase(),
          globalName: '',
          localName: ''
        },
        searchPriority: 5 // Default priority
      };
    } catch (error) {
      console.error('Error enhancing token data:', error);
      return {
        ...tokenData,
        source,
        marketActivity: { hasMarket: false, activeBids: 0, activeAsks: 0, lastPrice: 0, volume24h: 0 },
        totalSupply: parseFloat(tokenData.maxsupply || 0),
        currentSupply: parseFloat(tokenData.currentsupply || 0),
        decimals: parseInt(tokenData.decimals || 0),
        displayName: tokenData.ticker || tokenData.name || 'Unknown Token',
        isActive: parseFloat(tokenData.currentsupply || 0) > 0,
        lastModified: tokenData.modified ? new Date(tokenData.modified * 1000) : null,
        searchable: {
          ticker: (tokenData.ticker || '').toLowerCase(),
          name: (tokenData.name || '').toLowerCase(),
          address: (tokenData.address || '').toLowerCase(),
          globalName: '',
          localName: ''
        },
        searchPriority: 5
      };
    }
  };

  // Effect to re-filter when filter criteria change
  useEffect(() => {
    filterAndSortTokens();
  }, [allTokens, tokenFilter, tokenSortBy, tokenSortOrder]);

  // Function to refresh market data for a specific trading pair
  const refreshMarketDataForPair = async (marketPair) => {
    try {
      console.log(`🔄 Refreshing market data for: ${marketPair}`);
      
      // Use Promise.allSettled to load market data and user orders in parallel
      const [marketResult, userResult] = await Promise.allSettled([
        NEXUS.utilities.apiCall('market/list/order', {
          market: marketPair,
          limit: 100
        }),
        NEXUS.utilities.apiCall('market/user/order', {
          market: marketPair
        })
      ]);

      // Only update state if this is still the selected market (prevent race conditions)
      if (marketPair === selectedMarket) {
        // Handle market data result
        if (marketResult.status === 'fulfilled') {
          console.log(`✅ Market data loaded for ${marketPair}:`, marketResult.value);
          setMarketData(marketResult.value || { bids: [], asks: [] });
        } else {
          console.error(`Failed to load market data for ${marketPair}:`, marketResult.reason);
          setMarketData({ bids: [], asks: [] });
        }

        // Handle user orders result
        if (userResult.status === 'fulfilled') {
          console.log(`✅ User orders loaded for ${marketPair}:`, userResult.value);
          setUserOrders(userResult.value || { bids: [], asks: [] });
        } else {
          console.error(`Failed to load user orders for ${marketPair}:`, userResult.reason);
          setUserOrders({ bids: [], asks: [] });
        }
      } else {
        console.log(`⚠️ Market changed from ${marketPair} to ${selectedMarket}, discarding stale data`);
      }

    } catch (error) {
      console.error(`Failed to refresh market data for ${marketPair}:`, error);
      // Only clear data if this was for the current market
      if (marketPair === selectedMarket) {
        setMarketData({ bids: [], asks: [] });
        setUserOrders({ bids: [], asks: [] });
      }
    }
  };

  

  // Function to select a token for trading
  const selectTokenForTrading = (token) => {
    if (!token.ticker) {
      NEXUS.utilities.showErrorDialog({
        message: 'Invalid Token Selection',
        note: 'This token does not have a ticker and cannot be traded.',
      });
      return;
    }

    // Check if there are cross-token pairs available for this token
    const availableCrossTokenPairs = crossTokenPairs.filter(pair => 
      pair.pair.includes(token.ticker)
    );
    
    let tradingPair;
    if (availableCrossTokenPairs.length > 0 && activeTradingPair && activeTradingPair.includes('/') && !activeTradingPair.includes('/NXS')) {
      // If there's an active cross-token pair, maintain it
      tradingPair = activeTradingPair;
    } else if (availableCrossTokenPairs.length > 0) {
      // Use the first available cross-token pair
      tradingPair = availableCrossTokenPairs[0].pair;
    } else {
      // Fall back to NXS pair
      tradingPair = `${token.ticker}/NXS`;
    }
    
    console.log(`🎯 Selecting token for trading: ${tradingPair}`);
    
    // Clear existing market data immediately to prevent showing stale data
    setMarketData({ bids: [], asks: [] });
    setUserOrders({ bids: [], asks: [] });
    
    // Update available markets to include this token first
    setAvailableMarkets(prev => {
      if (!prev.includes(tradingPair)) {
        return [...prev, tradingPair];
      }
      return prev;
    });

    // Update state and immediately refresh market data
    setSelectedMarket(tradingPair);
    setSelectedTokenForTrading(token);
    
    // If this is a cross-token pair, also set it as active
    if (!tradingPair.includes('/NXS')) {
      setActiveTradingPair(tradingPair);
    }
    
    // Switch to marketplace tab
    dispatch(setActiveTab('marketplace'));
    
    NEXUS.utilities.showSuccessDialog({
      message: 'Token Selected for Trading',
      note: `Now trading ${tradingPair}. You can create buy/sell orders for ${token.ticker} tokens.`,
    });

    // Force immediate refresh of market data for the new trading pair
    refreshMarketDataForPair(tradingPair);
  };

  // Enhanced trading pair selection for Token Browser
  const addTradingPair = (baseToken, quoteToken = 'NXS') => {
    const tradingPair = `${baseToken.ticker}/${quoteToken}`;
    console.log(`🔗 Adding trading pair: ${tradingPair}`);
    
    setSelectedTradingPairs(prev => {
      if (!prev.find(pair => pair.pair === tradingPair)) {
        const newPair = {
          pair: tradingPair,
          baseToken,
          quoteToken,
          addedAt: new Date().toISOString()
        };
        return [...prev, newPair];
      }
      return prev;
    });
    
    // Update available markets
    setAvailableMarkets(prev => {
      if (!prev.includes(tradingPair)) {
        return [...prev, tradingPair];
      }
      return prev;
    });
    
    NEXUS.utilities.showSuccessDialog({
      message: 'Trading Pair Added',
      note: `${tradingPair} has been added to your trading pairs. Switch to the P2P Marketplace to start trading.`,
    });
  };

  const removeTradingPair = (tradingPair) => {
    console.log(`🗑️ Removing trading pair: ${tradingPair}`);
    
    setSelectedTradingPairs(prev => 
      prev.filter(pair => pair.pair !== tradingPair)
    );
    
    // If this was the active pair, clear it
    if (activeTradingPair === tradingPair) {
      setActiveTradingPair('');
    }
    
    // If this was the selected market, reset to first available
    if (selectedMarket === tradingPair) {
      const remainingPairs = selectedTradingPairs.filter(pair => pair.pair !== tradingPair);
      if (remainingPairs.length > 0) {
        setSelectedMarket(remainingPairs[0].pair);
      } else {
        setSelectedMarket('');
      }
    }
  };

  const activateTradingPair = (tradingPair) => {
    console.log(`⚡ Activating trading pair: ${tradingPair}`);
    
    // Clear existing market data
    setMarketData({ bids: [], asks: [] });
    setUserOrders({ bids: [], asks: [] });
    
    // Set as active pair and selected market
    setActiveTradingPair(tradingPair);
    setSelectedMarket(tradingPair);
    
    // Switch to marketplace tab
    dispatch(setActiveTab('marketplace'));
    
    // Refresh market data for the new pair
    refreshMarketDataForPair(tradingPair);
    
    NEXUS.utilities.showSuccessDialog({
      message: 'Trading Pair Activated',
      note: `Now trading ${tradingPair}. You can create buy/sell orders in the P2P Marketplace.`,
    });
  };

  // Generate cross-token trading pairs from selected tokens
  const generateCrossTokenPairs = (tokens) => {
    const pairs = [];
    for (let i = 0; i < tokens.length; i++) {
      for (let j = i + 1; j < tokens.length; j++) {
        const token1 = tokens[i];
        const token2 = tokens[j];
        if (token1.ticker && token2.ticker) {
          pairs.push({
            pair: `${token1.ticker}/${token2.ticker}`,
            baseToken: token1,
            quoteToken: token2.ticker,
            type: 'cross-token'
          });
          pairs.push({
            pair: `${token2.ticker}/${token1.ticker}`,
            baseToken: token2,
            quoteToken: token1.ticker,
            type: 'cross-token'
          });
        }
      }
    }
    return pairs;
  };

  // Token selection for cross-token pair creation
  const toggleTokenSelection = (token) => {
    setSelectedTokensForPairs(prev => {
      const isSelected = prev.find(t => t.ticker === token.ticker);
      if (isSelected) {
        return prev.filter(t => t.ticker !== token.ticker);
      } else {
        return [...prev, token];
      }
    });
  };

  // Create cross-token trading pairs from selected tokens
  const createCrossTokenPairs = () => {
    if (selectedTokensForPairs.length < 2) {
      NEXUS.utilities.showErrorDialog({
        message: 'Insufficient Tokens Selected',
        note: 'Please select at least 2 tokens to create cross-token pairs.',
      });
      return;
    }

    const newPairs = [];
    for (let i = 0; i < selectedTokensForPairs.length; i++) {
      for (let j = i + 1; j < selectedTokensForPairs.length; j++) {
        const token1 = selectedTokensForPairs[i];
        const token2 = selectedTokensForPairs[j];
        
        // Create both directions of the pair
        const pair1 = `${token1.ticker}/${token2.ticker}`;
        const pair2 = `${token2.ticker}/${token1.ticker}`;
        
        // Check if pairs already exist
        const existingPair1 = selectedTradingPairs.find(p => p.pair === pair1);
        const existingPair2 = selectedTradingPairs.find(p => p.pair === pair2);
        
        if (!existingPair1) {
          newPairs.push({
            pair: pair1,
            baseToken: token1,
            quoteToken: token2.ticker,
            type: 'cross-token',
            addedAt: new Date().toISOString()
          });
        }
        
        if (!existingPair2) {
          newPairs.push({
            pair: pair2,
            baseToken: token2,
            quoteToken: token1.ticker,
            type: 'cross-token',
            addedAt: new Date().toISOString()
          });
        }
      }
    }

    if (newPairs.length > 0) {
      setSelectedTradingPairs(prev => [...prev, ...newPairs]);
      
      // Update available markets
      const newMarkets = newPairs.map(pair => pair.pair);
      setAvailableMarkets(prev => [...new Set([...prev, ...newMarkets])]);
      
      NEXUS.utilities.showSuccessDialog({
        message: 'Cross-Token Pairs Created',
        note: `Added ${newPairs.length} new trading pairs. You can now activate them for trading.`,
      });
      
      // Clear selection
      setSelectedTokensForPairs([]);
      setShowCrossTokenCreator(false);
    } else {
      NEXUS.utilities.showInfoDialog({
        message: 'No New Pairs Created',
        note: 'All possible pairs from selected tokens already exist.',
      });
    }
  };

  // Clear token selection
  const clearTokenSelection = () => {
    setSelectedTokensForPairs([]);
    setShowCrossTokenCreator(false);
  };

  // Optimized initial load effect
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([
        loadAvailableTokens(),
        loadUserAccounts(),
        refreshWalletData() // Also load wallet data for account dropdowns
      ]);
    };

    loadInitialData();
  }, []);

  // Synchronize selectedMarket with activeTradingPair
  useEffect(() => {
    if (activeTradingPair && activeTradingPair !== selectedMarket) {
      console.log(`🔗 Syncing selectedMarket with activeTradingPair: ${activeTradingPair}`);
      setSelectedMarket(activeTradingPair);
    }
  }, [activeTradingPair]);

  // Separate effect to handle selectedMarket changes
  useEffect(() => {
    if (selectedMarket) {
      console.log(`📊 Market changed to: ${selectedMarket}, refreshing data...`);
      refreshMarketDataForPair(selectedMarket);
    }
  }, [selectedMarket]);

  // Reset transaction page when trading pair filter changes
  useEffect(() => {
    setTransactionPage(0);
  }, [selectedTradingPair]);

  // Load all tokens when Token Browser tab is selected
  useEffect(() => {
    if (activeTab === 'tokenbrowser' && allTokens.length === 0) {
      loadAllTokens();
    }
  }, [activeTab]);

  // Optimized auto-refresh effect
  useEffect(() => {
    let intervalId = null;

    if (autoRefresh && selectedMarket) {
      intervalId = setInterval(() => {
        // Only refresh if not currently loading and we have a selected market
        if (!loading) {
          console.log(`🔄 Auto-refreshing market data for: ${selectedMarket}`);
          refreshMarketDataForPair(selectedMarket);
        }
      }, 10000); // Reduced to 10 seconds for faster updates
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [autoRefresh, loading, selectedMarket]);

  const renderMarketplace = () => (
    <div>
      <Card>
        <h2 style={{ color: '#00d4aa', marginBottom: '16px' }}>🔄 Nexus P2P Marketplace</h2>
        <p style={{ color: '#8892b0', marginBottom: '24px' }}>
          Trade tokens on the decentralized Nexus network using the Market API. 
          Support for all token pairs with any custom tokens paired with NXS.
        </p>

        {/* Market Selection & Statistics */}
        <FieldSet legend="Market Overview">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '16px', 
            marginBottom: '20px',
            alignItems: 'center'
          }}>
            {/* Active Trading Pair Display */}
            <div>
              <label style={{ color: '#8892b0', marginBottom: '8px', display: 'block', fontSize: '14px', fontWeight: '500' }}>
                Active Trading Pair
              </label>
              <div style={{
                width: '100%',
                padding: '16px',
                borderRadius: '8px',
                border: activeTradingPair 
                  ? '2px solid rgba(139, 92, 246, 0.6)'
                  : '2px dashed rgba(107, 114, 128, 0.3)',
                background: activeTradingPair
                  ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)'
                  : 'rgba(31, 41, 55, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                minHeight: '80px'
              }}>
                {activeTradingPair ? (
                  <>
                    <div>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#8b5cf6',
                        marginBottom: '4px'
                      }}>
                        ⚡ {activeTradingPair}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#a855f7'
                      }}>
                        Ready for Trading
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <div style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        marginBottom: '4px'
                      }}>
                        No Trading Pair Selected
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#8892b0'
                      }}>
                        Select a trading pair from Token Browser
                      </div>
                    </div>
                    <ActionButton
                      variant="secondary"
                      onClick={() => dispatch(setActiveTab('tokenbrowser'))}
                      style={{
                        fontSize: '12px',
                        padding: '8px 16px',
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                        color: '#ffffff',
                        border: 'none'
                      }}
                    >
                      🔗 Select Trading Pair
                    </ActionButton>
                  </>
                )}
              </div>
              
              {/* Change Pair Button - Moved above Your Tokens */}
              {activeTradingPair && (
                <div style={{ marginTop: '12px', marginBottom: '8px' }}>
                  <ActionButton
                    variant="secondary"
                    onClick={() => dispatch(setActiveTab('tokenbrowser'))}
                    style={{
                      fontSize: '11px',
                      padding: '8px 14px',
                      background: 'rgba(139, 92, 246, 0.2)',
                      color: '#8b5cf6',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    🔗 Change Pair
                  </ActionButton>
                </div>
              )}
              
              {/* Trading Pair Information */}
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                {allUserTokens.length > 0 && (
                  <div>
                    📊 Your Tokens: {allUserTokens.map(t => t.ticker).join(', ')}
                  </div>
                )}
                {crossTokenPairs.length > 0 && (
                  <div style={{ color: '#f59e0b', marginTop: '4px' }}>
                    ⚡ {crossTokenPairs.length} cross-token pairs available
                  </div>
                )}
              </div>
            </div>
            
            {/* Token Browser Link */}
            <div>
              <label style={{ color: '#8892b0', marginBottom: '8px', display: 'block', fontSize: '14px', fontWeight: '500' }}>
                Discover More Tokens
              </label>
              <ActionButton
                variant="primary"
                onClick={() => dispatch(setActiveTab('tokenbrowser'))}
                style={{
                  width: '100%',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                }}
              >
                🔍 Browse All Tokens
              </ActionButton>
            </div>
            <div>
              <label style={{ color: '#8892b0', marginBottom: '8px', display: 'block', fontSize: '14px', fontWeight: '500' }}>
                Market Actions
              </label>
              <ActionButton
                variant="secondary"
                onClick={refreshMarketData}
                disabled={loading}
                style={{
                  width: '100%',
                  marginBottom: '8px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                }}
              >
                {loading ? 'Refreshing...' : '🔄 Refresh Market'}
              </ActionButton>
            </div>
            <div>
              <label style={{ color: '#8892b0', marginBottom: '8px', display: 'block', fontSize: '14px', fontWeight: '500' }}>
                Auto-Refresh
              </label>
              <ActionButton
                variant={autoRefresh ? 'success' : 'secondary'}
                onClick={() => setAutoRefresh(!autoRefresh)}
                style={{
                  width: '100%',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  background: autoRefresh 
                    ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' 
                    : 'linear-gradient(135deg, #0891b2 0%, #0284c7 100%)',
                  border: autoRefresh ? 'none' : '1px solid rgba(0, 212, 250, 0.3)'
                }}
              >
                {autoRefresh ? '⏸️ Auto-Refresh ON' : '▶️ Auto-Refresh OFF'}
              </ActionButton>
            </div>
          </div>

          {/* Market Statistics & Token Info */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
            gap: '12px',
            padding: '16px',
            background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
            borderRadius: '12px',
            border: '1px solid #4b5563'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Trading Pair</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#8b5cf6' }}>
                {selectedMarket}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Available Tokens</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#00d4aa' }}>
                {availableTokens.length + 1} {/* +1 for NXS */}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Last Price</div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#00d4aa' }}>
                {marketStats.lastPrice.toFixed(4)} NXS
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>24h Volume</div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#8892b0' }}>
                {marketStats.volume24h.toFixed(2)} {selectedMarket.split('/')[0]}
              </div>
            </div>
          </div>
        </FieldSet>

        {/* Create Order */}
        <FieldSet legend="Create Order">
          {/* Order Type Selection */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#8892b0', marginBottom: '12px', display: 'block', fontSize: '16px', fontWeight: '500' }}>
              Select Order Type
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {(() => {
                const [baseToken, quoteToken] = selectedMarket.split('/');
                return (
                  <>
                    <button
                      onClick={() => setOrderForm({ ...orderForm, type: 'bid' })}
                      style={{
                        background: orderForm.type === 'bid' 
                          ? 'linear-gradient(135deg, #4ade80 0%, #059669 100%)' 
                          : 'linear-gradient(135deg, #0891b2 0%, #0284c7 100%)',
                        border: orderForm.type === 'bid' ? '2px solid #4ade80' : '1px solid rgba(0, 212, 250, 0.4)',
                        color: '#ffffff',
                        padding: '16px',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        textAlign: 'center',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                        boxShadow: orderForm.type === 'bid' 
                          ? '0 8px 32px rgba(74, 222, 128, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2)'
                          : '0 8px 32px rgba(0, 212, 250, 0.25), 0 4px 16px rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      🟢 BUY ORDER (Bid)
                      <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.9 }}>
                        Buy {baseToken} with {quoteToken}
                      </div>
                    </button>
                    <button
                      onClick={() => setOrderForm({ ...orderForm, type: 'ask' })}
                      style={{
                        background: orderForm.type === 'ask' 
                          ? 'linear-gradient(135deg, #f87171 0%, #dc2626 100%)' 
                          : 'linear-gradient(135deg, #0891b2 0%, #0284c7 100%)',
                        border: orderForm.type === 'ask' ? '2px solid #f87171' : '1px solid rgba(0, 212, 250, 0.4)',
                        color: '#ffffff',
                        padding: '16px',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        textAlign: 'center',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                        boxShadow: orderForm.type === 'ask' 
                          ? '0 8px 32px rgba(248, 113, 113, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2)'
                          : '0 8px 32px rgba(0, 212, 250, 0.25), 0 4px 16px rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      🔴 SELL ORDER (Ask)
                      <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.9 }}>
                        Sell {baseToken} for {quoteToken}
                      </div>
                    </button>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Order Details Card */}
          <div style={{
            background: orderForm.type === 'bid' 
              ? 'rgba(74, 222, 128, 0.1)' 
              : 'rgba(248, 113, 113, 0.1)',
            border: `1px solid ${orderForm.type === 'bid' ? 'rgba(74, 222, 128, 0.3)' : 'rgba(248, 113, 113, 0.3)'}`,
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            {(() => {
              const [baseToken, quoteToken] = selectedMarket.split('/');
              return (
                <h4 style={{ 
                  color: orderForm.type === 'bid' ? '#4ade80' : '#f87171',
                  marginBottom: '16px',
                  fontSize: '16px'
                }}>
                  {orderForm.type === 'bid' ? `🟢 Buy ${baseToken} Order Details` : `🔴 Sell ${baseToken} Order Details`}
                </h4>
              );
            })()}

            {/* Order Flow Explanation */}
            <div style={{
              background: 'rgba(26, 32, 44, 0.8)',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '13px',
              color: '#8892b0'
            }}>
              <strong>Order Flow:</strong><br/>
              {(() => {
                const [baseToken, quoteToken] = selectedMarket.split('/');
                return orderForm.type === 'bid' ? (
                  <>
                    • You will <strong style={{color: '#4ade80'}}>spend {quoteToken}</strong> from your {quoteToken} account<br/>
                    • You will <strong style={{color: '#4ade80'}}>receive {baseToken}</strong> tokens to your {baseToken} account<br/>
                    • Price: How much {quoteToken} you pay per {baseToken} token
                  </>
                ) : (
                  <>
                    • You will <strong style={{color: '#f87171'}}>spend {baseToken}</strong> tokens from your {baseToken} account<br/>
                    • You will <strong style={{color: '#f87171'}}>receive {quoteToken}</strong> to your {quoteToken} account<br/>
                    • Price: How much {quoteToken} you get per {baseToken} token
                  </>
                );
              })()}
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
              gap: '20px', 
              marginBottom: '16px' 
            }}>
              {/* Amount and Price */}
              {(() => {
                const [baseToken, quoteToken] = selectedMarket.split('/');
                return (
                  <>
                    <StyledTextField
                      variant="default"
                      placeholder={`Amount of ${baseToken} tokens to ${orderForm.type === 'bid' ? 'buy' : 'sell'}`}
                      value={orderForm.amount}
                      onChange={(e) => setOrderForm({ ...orderForm, amount: e.target.value })}
                    />
                    <StyledTextField
                      variant="default"
                      placeholder={`Price (${quoteToken} per ${baseToken})`}
                      value={orderForm.price}
                      onChange={(e) => setOrderForm({ ...orderForm, price: e.target.value })}
                    />
                  </>
                );
              })()}
            </div>

            {/* Account Selection Section with Better Layout */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
              gap: '24px', 
              marginBottom: '16px' 
            }}>
              {/* FROM Account Selection */}
              <div>
                <label style={{ 
                  color: orderForm.type === 'bid' ? '#4ade80' : '#f87171', 
                  marginBottom: '12px', 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  {(() => {
                    const [baseToken, quoteToken] = selectedMarket.split('/');
                    return (
                      <>
                        <span>{orderForm.type === 'bid' ? '💰' : '📤'}</span>
                        From: Your {orderForm.type === 'bid' ? quoteToken : baseToken} Account
                        <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#8892b0' }}>
                          (paying account)
                        </span>
                      </>
                    );
                  })()}
                </label>
                
                {(() => {
                  const [baseToken, quoteToken] = selectedMarket.split('/');
                  return (
                    <StyledTextField
                      variant="default"
                      placeholder={orderForm.type === 'bid' 
                        ? `${quoteToken} account name/address` 
                        : `${baseToken} token account name/address`
                      }
                      value={orderForm.from}
                      onChange={(e) => setOrderForm({ ...orderForm, from: e.target.value })}
                      style={{ marginBottom: '8px' }}
                    />
                  );
                })()}
                
                <select
                  value={orderForm.from}
                  onChange={(e) => setOrderForm({ ...orderForm, from: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    background: 'linear-gradient(135deg, rgba(26, 32, 44, 0.9) 0%, rgba(45, 55, 72, 0.8) 100%)',
                    color: '#e2e8f0',
                    fontSize: '14px',
                    fontWeight: '400',
                    marginBottom: '8px',
                    cursor: 'pointer'
                  }}
                >
                  {(() => {
                    const [baseToken, quoteToken] = selectedMarket.split('/');
                    const expectedToken = orderForm.type === 'bid' ? quoteToken : baseToken;
                    return (
                      <>
                        <option value="" style={{ background: '#1a202c', color: '#e2e8f0' }}>
                          {orderForm.type === 'bid' ? `🏪 Select your ${quoteToken} account` : `🏪 Select your ${baseToken} account`}
                        </option>
                        {walletData.accounts
                          ?.filter(account => {
                            if (orderForm.type === 'bid') {
                              // For buy orders, user pays with quote token
                              return account.ticker === quoteToken;
                            } else {
                              // For sell orders, user pays with base token
                              return account.ticker === baseToken;
                            }
                          })
                          ?.map((account, idx) => (
                          <option key={idx} value={account.name || account.address} style={{ background: '#1a202c', color: '#e2e8f0' }}>
                            {account.ticker || expectedToken} - {account.name || account.address.substring(0, 20)}... - Balance: {parseFloat(account.balance || 0).toFixed(2)}
                          </option>
                        ))}
                      </>
                    );
                  })()}
                </select>

                {walletData.accounts?.length === 0 && (
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#f87171', 
                    padding: '8px', 
                    background: 'rgba(248, 113, 113, 0.1)', 
                    borderRadius: '6px',
                    border: '1px solid rgba(248, 113, 113, 0.2)'
                  }}>
                    ⚠️ No accounts found. Please create accounts in the Wallet tab first.
                  </div>
                )}
              </div>

              {/* TO Account Selection */}
              <div>
                <label style={{ 
                  color: orderForm.type === 'bid' ? '#4ade80' : '#f87171', 
                  marginBottom: '12px', 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  {(() => {
                    const [baseToken, quoteToken] = selectedMarket.split('/');
                    return (
                      <>
                        <span>{orderForm.type === 'bid' ? '📥' : '💰'}</span>
                        To: Your {orderForm.type === 'bid' ? baseToken : quoteToken} Account
                        <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#8892b0' }}>
                          (receiving account)
                        </span>
                      </>
                    );
                  })()}
                </label>
                
                {(() => {
                  const [baseToken, quoteToken] = selectedMarket.split('/');
                  return (
                    <StyledTextField
                      variant="default"
                      placeholder={orderForm.type === 'bid' 
                        ? `${baseToken} token account name/address` 
                        : `${quoteToken} account name/address`
                      }
                      value={orderForm.to}
                      onChange={(e) => setOrderForm({ ...orderForm, to: e.target.value })}
                      style={{ marginBottom: '8px' }}
                    />
                  );
                })()}
                
                <select
                  value={orderForm.to}
                  onChange={(e) => setOrderForm({ ...orderForm, to: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    background: 'linear-gradient(135deg, rgba(26, 32, 44, 0.9) 0%, rgba(45, 55, 72, 0.8) 100%)',
                    color: '#e2e8f0',
                    fontSize: '14px',
                    fontWeight: '400',
                    marginBottom: '8px',
                    cursor: 'pointer'
                  }}
                >
                  {(() => {
                    const [baseToken, quoteToken] = selectedMarket.split('/');
                    const expectedToken = orderForm.type === 'bid' ? baseToken : quoteToken;
                    return (
                      <>
                        <option value="" style={{ background: '#1a202c', color: '#e2e8f0' }}>
                          {orderForm.type === 'bid' ? `🏪 Select your ${baseToken} account` : `🏪 Select your ${quoteToken} account`}
                        </option>
                        {walletData.accounts
                          ?.filter(account => {
                            if (orderForm.type === 'bid') {
                              // For buy orders, user receives base token
                              return account.ticker === baseToken;
                            } else {
                              // For sell orders, user receives quote token
                              return account.ticker === quoteToken;
                            }
                          })
                          ?.map((account, idx) => (
                          <option key={idx} value={account.name || account.address} style={{ background: '#1a202c', color: '#e2e8f0' }}>
                            {account.ticker || expectedToken} - {account.name || account.address.substring(0, 20)}... - Balance: {parseFloat(account.balance || 0).toFixed(2)}
                          </option>
                        ))}
                      </>
                    );
                  })()}
                </select>

                {walletData.accounts?.length === 0 && (
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#f87171', 
                    padding: '8px', 
                    background: 'rgba(248, 113, 113, 0.1)', 
                    borderRadius: '6px',
                    border: '1px solid rgba(248, 113, 113, 0.2)'
                  }}>
                    ⚠️ No accounts found. Please create accounts in the Wallet tab first.
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            {orderForm.amount && orderForm.price && (
              <div style={{
                background: 'rgba(26, 32, 44, 0.9)',
                padding: '16px',
                borderRadius: '8px',
                marginTop: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h5 style={{ color: '#8b5cf6', marginBottom: '12px' }}>📋 Order Summary</h5>
                <div style={{ fontSize: '14px', color: '#8892b0', lineHeight: '1.6' }}>
                  {(() => {
                    const [baseToken, quoteToken] = selectedMarket.split('/');
                    return orderForm.type === 'bid' ? (
                      <>
                        <div>• You will <strong style={{color: '#4ade80'}}>buy {orderForm.amount} {baseToken}</strong> tokens</div>
                        <div>• At <strong style={{color: '#4ade80'}}>{orderForm.price} {quoteToken} per {baseToken}</strong></div>
                        <div>• Total cost: <strong style={{color: '#fbbf24'}}>{(parseFloat(orderForm.amount || 0) * parseFloat(orderForm.price || 0)).toFixed(6)} {quoteToken}</strong></div>
                        <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
                          💸 Spending from: {orderForm.from || `Select ${quoteToken} account`}<br/>
                          💰 Receiving to: {orderForm.to || `Select ${baseToken} account`}
                        </div>
                      </>
                    ) : (
                      <>
                        <div>• You will <strong style={{color: '#f87171'}}>sell {orderForm.amount} {baseToken}</strong> tokens</div>
                        <div>• At <strong style={{color: '#f87171'}}>{orderForm.price} {quoteToken} per {baseToken}</strong></div>
                        <div>• Total revenue: <strong style={{color: '#fbbf24'}}>{(parseFloat(orderForm.amount || 0) * parseFloat(orderForm.price || 0)).toFixed(6)} {quoteToken}</strong></div>
                        <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
                          💸 Sending from: {orderForm.from || `Select ${baseToken} account`}<br/>
                          💰 Receiving to: {orderForm.to || `Select ${quoteToken} account`}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={createMarketOrder}
            disabled={loading || !orderForm.amount || !orderForm.price || !orderForm.from || !orderForm.to}
            style={{
              background: !loading && orderForm.amount && orderForm.price && orderForm.from && orderForm.to
                ? (orderForm.type === 'bid' 
                  ? 'linear-gradient(135deg, #4ade80 0%, #059669 100%)' 
                  : 'linear-gradient(135deg, #f87171 0%, #dc2626 100%)')
                : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '16px 32px',
              fontWeight: '600',
              fontSize: '16px',
              transition: 'all 0.2s ease',
              cursor: !loading && orderForm.amount && orderForm.price && orderForm.from && orderForm.to ? 'pointer' : 'not-allowed',
              width: '100%',
              marginTop: '16px'
            }}
          >
            {(() => {
              const [baseToken, quoteToken] = selectedMarket.split('/');
              return loading ? (
                '⏳ Creating Order...'
              ) : (
                orderForm.type === 'bid' 
                  ? `🟢 Create Buy Order - Pay ${(parseFloat(orderForm.amount || 0) * parseFloat(orderForm.price || 0)).toFixed(6)} ${quoteToken}`
                  : `🔴 Create Sell Order - Receive ${(parseFloat(orderForm.amount || 0) * parseFloat(orderForm.price || 0)).toFixed(6)} ${quoteToken}`
              );
            })()}
          </Button>
          
          {/* Order Processing Indicator */}
          {orderProcessing && (
            <div style={{
              marginTop: '16px',
              padding: '16px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              animation: `${pulse} 2s infinite`
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid rgba(59, 130, 246, 0.3)',
                borderTop: '2px solid #3b82f6',
                borderRadius: '50%',
                animation: `${spin} 1s linear infinite`
              }}></div>
              <div style={{
                color: '#3b82f6',
                fontWeight: '500',
                fontSize: '14px'
              }}>
                {orderProcessingMessage}
              </div>
            </div>
          )}
        </FieldSet>

        {/* Simplified Market Orders Display */}
        <FieldSet legend="🌟 Active Market Orders - Easy to Understand">
          {/* Market Explanation Banner */}
          {(() => {
            const [baseToken, quoteToken] = selectedMarket.split('/');
            return (
              <div style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '24px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '8px' }}>
                  📊 {selectedMarket} Market Overview
                </div>
                <div style={{ fontSize: '14px', color: '#e2e8f0', lineHeight: '1.5' }}>
                  <strong style={{ color: '#4ade80' }}>🟢 Buy Orders:</strong> People wanting to buy <strong>{baseToken}</strong> and pay with <strong>{quoteToken}</strong><br/>
                  <strong style={{ color: '#f87171' }}>🔴 Sell Orders:</strong> People wanting to sell <strong>{baseToken}</strong> and receive <strong>{quoteToken}</strong>
                </div>
              </div>
            );
          })()}

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '24px',
            marginBottom: '24px'
          }}>
            {/* Buy Orders - Simple List */}
            <div>
              {(() => {
                const [baseToken, quoteToken] = selectedMarket.split('/');
                return (
                  <div>
                    <h4 style={{ 
                      color: '#4ade80', 
                      marginBottom: '8px',
                      fontSize: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      🟢 Buy Orders ({processedMarketData.bids?.length || 0})
                    </h4>
                    <div style={{
                      background: 'rgba(74, 222, 128, 0.1)',
                      border: '1px solid rgba(74, 222, 128, 0.3)',
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '12px',
                      fontSize: '13px',
                      color: '#4ade80'
                    }}>
                      💡 <strong>What this means for you:</strong><br/>
                      • If you <strong>SELL to these orders</strong>, you give <strong>{baseToken}</strong> → get <strong>{quoteToken}</strong><br/>
                      • You need <strong>{baseToken}</strong> tokens to sell to these buyers
                    </div>
                    <div style={{
                      background: 'rgba(139, 92, 246, 0.08)',
                      border: '1px solid rgba(139, 92, 246, 0.15)',
                      borderRadius: '6px',
                      padding: '8px',
                      marginBottom: '16px',
                      fontSize: '11px',
                      color: '#a5b4fc',
                      textAlign: 'center'
                    }}>
                      📊 <strong>Sorted by Price:</strong> Highest to Lowest (Best buy prices first)
                    </div>
                  </div>
                );
              })()}

              <div style={{ 
                background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.1) 0%, rgba(74, 222, 128, 0.05) 100%)',
                border: '1px solid rgba(74, 222, 128, 0.2)',
                borderRadius: '12px',
                padding: '16px',
                maxHeight: '500px',
                overflowY: 'auto'
              }}>
                {processedMarketData.bids?.length > 0 ? (
                  <>
                    {/* Header */}
                    {(() => {
                      const [baseToken, quoteToken] = selectedMarket.split('/');
                      return (
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr 1fr auto',
                          gap: '12px',
                          padding: '8px 12px',
                          borderBottom: '1px solid rgba(74, 222, 128, 0.3)',
                          marginBottom: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          color: '#4ade80'
                        }}>
                          <div>💰 Price ({quoteToken})</div>
                        <div>🏪 Amount ({baseToken})</div>
                        <div>💵 Total ({quoteToken})</div>
                        <div>Action</div>
                        </div>
                      );
                    })()}

                    {/* Orders List */}
                    {processedMarketData.bids.slice(0, 15).map((order, index) => (
                      <div 
                        key={order.txid}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr 1fr auto',
                          gap: '12px',
                          padding: '8px 12px',
                          borderBottom: index < Math.min(14, processedMarketData.bids.length - 1) 
                            ? '1px solid rgba(74, 222, 128, 0.1)' 
                            : 'none',
                          fontSize: '13px',
                          alignItems: 'center',
                          transition: 'all 0.2s ease',
                          borderRadius: '6px',
                          '&:hover': {
                            background: 'rgba(74, 222, 128, 0.1)'
                          }
                        }}
                      >
                        <div style={{ color: '#4ade80', fontWeight: '600' }}>
                          {order.processedData.formattedPrice}
                        </div>
                        <div style={{ color: '#e2e8f0' }}>
                          {order.processedData.formattedAmount}
                        </div>
                        <div style={{ color: '#fbbf24', fontWeight: '500' }}>
                          {order.processedData.formattedTotalValue}
                        </div>
                        <div>
                          {(() => {
                            const [baseToken, quoteToken] = selectedMarket.split('/');
                            return (
                              <button
                                onClick={() => executeOrder(order.txid, order)}
                                style={{
                                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                  color: '#ffffff',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '6px 10px',
                                  fontSize: '10px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  textAlign: 'center',
                                  lineHeight: '1.2'
                                }}
                                title={`Sell your ${baseToken} to this buyer and receive ${quoteToken}`}
                              >
                                💰 Sell {baseToken}<br/>
                                <span style={{ fontSize: '8px', opacity: '0.8' }}>Get {quoteToken}</span>
                              </button>
                            );
                          })()}
                        </div>
                      </div>
                    ))}

                    {processedMarketData.bids.length > 15 && (
                      <div style={{ 
                        textAlign: 'center', 
                        marginTop: '12px', 
                        fontSize: '12px', 
                        color: '#8892b0' 
                      }}>
                        ... and {processedMarketData.bids.length - 15} more orders
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ 
                    textAlign: 'center', 
                    color: '#8892b0', 
                    padding: '40px 20px',
                    fontSize: '14px'
                  }}>
                    No buy orders available
                  </div>
                )}
              </div>
            </div>

            {/* Sell Orders - Simple List */}
            <div>
              {(() => {
                const [baseToken, quoteToken] = selectedMarket.split('/');
                return (
                  <div>
                    <h4 style={{ 
                      color: '#f87171', 
                      marginBottom: '8px',
                      fontSize: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      🔴 Sell Orders ({processedMarketData.asks?.length || 0})
                    </h4>
                    <div style={{
                      background: 'rgba(248, 113, 113, 0.1)',
                      border: '1px solid rgba(248, 113, 113, 0.3)',
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '12px',
                      fontSize: '13px',
                      color: '#f87171'
                    }}>
                      💡 <strong>What this means for you:</strong><br/>
                      • If you <strong>BUY from these orders</strong>, you give <strong>{quoteToken}</strong> → get <strong>{baseToken}</strong><br/>
                      • You need <strong>{quoteToken}</strong> tokens to buy from these sellers
                    </div>
                    <div style={{
                      background: 'rgba(139, 92, 246, 0.08)',
                      border: '1px solid rgba(139, 92, 246, 0.15)',
                      borderRadius: '6px',
                      padding: '8px',
                      marginBottom: '16px',
                      fontSize: '11px',
                      color: '#a5b4fc',
                      textAlign: 'center'
                    }}>
                      📊 <strong>Sorted by Price:</strong> Lowest to Highest (Best sell prices first)
                    </div>
                  </div>
                );
              })()}

              <div style={{ 
                background: 'linear-gradient(135deg, rgba(248, 113, 113, 0.1) 0%, rgba(248, 113, 113, 0.05) 100%)',
                border: '1px solid rgba(248, 113, 113, 0.2)',
                borderRadius: '12px',
                padding: '16px',
                maxHeight: '500px',
                overflowY: 'auto'
              }}>
                {processedMarketData.asks?.length > 0 ? (
                  <>
                    {/* Header */}
                    {(() => {
                      const [baseToken, quoteToken] = selectedMarket.split('/');
                      return (
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr 1fr auto',
                          gap: '12px',
                          padding: '8px 12px',
                          borderBottom: '1px solid rgba(248, 113, 113, 0.3)',
                          marginBottom: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          color: '#f87171'
                        }}>
                          <div>💰 Price ({quoteToken})</div>
                          <div>🏪 Amount ({baseToken})</div>
                          <div>💵 Total ({quoteToken})</div>
                          <div>Action</div>
                        </div>
                      );
                    })()}

                    {/* Orders List */}
                    {processedMarketData.asks.slice(0, 15).map((order, index) => (
                      <div 
                        key={order.txid}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr 1fr auto',
                          gap: '12px',
                          padding: '8px 12px',
                          borderBottom: index < Math.min(14, processedMarketData.asks.length - 1) 
                            ? '1px solid rgba(248, 113, 113, 0.1)' 
                            : 'none',
                          fontSize: '13px',
                          alignItems: 'center',
                          transition: 'all 0.2s ease',
                          borderRadius: '6px',
                          '&:hover': {
                            background: 'rgba(248, 113, 113, 0.1)'
                          }
                        }}
                      >
                        <div style={{ color: '#f87171', fontWeight: '600' }}>
                          {order.processedData.formattedPrice}
                        </div>
                        <div style={{ color: '#e2e8f0' }}>
                          {order.processedData.formattedAmount}
                        </div>
                        <div style={{ color: '#fbbf24', fontWeight: '500' }}>
                          {order.processedData.formattedTotalValue}
                        </div>
                        <div>
                          {(() => {
                            const [baseToken, quoteToken] = selectedMarket.split('/');
                            return (
                              <button
                                onClick={() => executeOrder(order.txid, order)}
                                style={{
                                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                  color: '#ffffff',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '6px 10px',
                                  fontSize: '10px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  textAlign: 'center',
                                  lineHeight: '1.2'
                                }}
                                title={`Buy ${baseToken} from this seller and pay with ${quoteToken}`}
                              >
                                🛒 Buy {baseToken}<br/>
                                <span style={{ fontSize: '8px', opacity: '0.8' }}>Pay {quoteToken}</span>
                              </button>
                            );
                          })()}
                        </div>
                      </div>
                    ))}

                    {processedMarketData.asks.length > 15 && (
                      <div style={{ 
                        textAlign: 'center', 
                        marginTop: '12px', 
                        fontSize: '12px', 
                        color: '#8892b0' 
                      }}>
                        ... and {processedMarketData.asks.length - 15} more orders
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ 
                    textAlign: 'center', 
                    color: '#8892b0', 
                    padding: '40px 20px',
                    fontSize: '14px'
                  }}>
                    No sell orders available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Trading Guide */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '13px',
            color: '#a5b4fc'
          }}>
            <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '12px', textAlign: 'center' }}>
              🎯 How to Trade - Step by Step Guide
            </div>
            {(() => {
              const [baseToken, quoteToken] = selectedMarket.split('/');
              return (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{
                    background: 'rgba(74, 222, 128, 0.1)',
                    border: '1px solid rgba(74, 222, 128, 0.3)',
                    borderRadius: '8px',
                    padding: '12px'
                  }}>
                    <div style={{ color: '#4ade80', fontWeight: 'bold', marginBottom: '8px' }}>🟢 To Sell Your {baseToken}:</div>
                    <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
                      1️⃣ Make sure you have <strong>{baseToken}</strong> tokens<br/>
                      2️⃣ Click "💰 Sell {baseToken}" on any buy order<br/>
                      3️⃣ You'll give <strong>{baseToken}</strong> → receive <strong>{quoteToken}</strong>
                    </div>
                  </div>
                  <div style={{
                    background: 'rgba(248, 113, 113, 0.1)',
                    border: '1px solid rgba(248, 113, 113, 0.3)',
                    borderRadius: '8px',
                    padding: '12px'
                  }}>
                    <div style={{ color: '#f87171', fontWeight: 'bold', marginBottom: '8px' }}>🔴 To Buy {baseToken}:</div>
                    <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
                      1️⃣ Make sure you have <strong>{quoteToken}</strong> tokens<br/>
                      2️⃣ Click "🛒 Buy {baseToken}" on any sell order<br/>
                      3️⃣ You'll give <strong>{quoteToken}</strong> → receive <strong>{baseToken}</strong>
                    </div>
                  </div>
                </div>
              );
            })()}
            <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '12px', color: '#8892b0' }}>
              💡 <strong>Remember:</strong> Set your account details in the "Create Order" section above before trading!
            </div>
          </div>
        </FieldSet>

        {/* Detailed Market Orders (Original) */}
        <FieldSet legend="📋 Detailed Market Orders">
          <GridContainer>
            {/* Buy Orders (Bids) */}
            <Card>
              {(() => {
                const [baseToken, quoteToken] = selectedMarket.split('/');
                return (
                  <>
                    <h4 style={{ color: '#4ade80', marginBottom: '16px' }}>
                      🟢 Buy Orders (Bids) ({processedMarketData.bids?.length || 0})
                    </h4>
                    <div style={{ 
                      marginBottom: '12px', 
                      padding: '8px', 
                      background: 'rgba(74, 222, 128, 0.1)', 
                      borderRadius: '6px', 
                      fontSize: '12px', 
                      color: '#4ade80',
                      border: '1px solid rgba(74, 222, 128, 0.3)'
                    }}>
                      <strong>💡 Buy Orders:</strong> Users wanting to <strong>buy {baseToken} with {quoteToken}</strong>
                    </div>
                    <div style={{ 
                      marginBottom: '12px', 
                      padding: '6px 8px', 
                      background: 'rgba(139, 92, 246, 0.1)', 
                      borderRadius: '4px', 
                      fontSize: '11px', 
                      color: '#a5b4fc',
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                      textAlign: 'center'
                    }}>
                      📊 <strong>Sorted by Price:</strong> Highest to Lowest (Best buy prices first)
                    </div>
                  </>
                );
              })()}
              <div style={{ 
                maxHeight: '400px', 
                overflowY: 'auto',
                overflowX: 'hidden',
                padding: '4px',
                margin: '-4px'
              }}>
                {processedMarketData.bids?.length > 0 ? (
                  <>
                    {processedMarketData.bids.slice(bidPage * ORDERS_PER_PAGE, (bidPage + 1) * ORDERS_PER_PAGE).map((order) => (
                      <div 
                        key={order.txid} 
                        style={{ 
                          background: 'rgba(75, 222, 128, 0.1)', 
                          border: '1px solid rgba(75, 222, 128, 0.3)',
                          borderRadius: '8px', 
                          padding: '12px', 
                          marginBottom: '8px' 
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <div>
                            {(() => {
                              const [baseToken, quoteToken] = selectedMarket.split('/');
                              return (
                                <>
                                  <span style={{ fontWeight: '600', color: '#4ade80', fontSize: '16px' }}>
                                    💰 {order.processedData.formattedPrice} {quoteToken} per {baseToken}
                                  </span>
                                  <div style={{ fontSize: '11px', color: '#8892b0', marginTop: '2px' }}>
                                    Order ID: {order.processedData.shortTxid}...
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            {(() => {
                              const [baseToken, quoteToken] = selectedMarket.split('/');
                              return (
                                <>
                                  <div style={{ fontSize: '13px', color: '#4ade80', fontWeight: '500' }}>
                                    Buying: {order.processedData.formattedAmount} {baseToken}
                                  </div>
                                  <div style={{ fontSize: '11px', color: '#8892b0' }}>
                                    Total: {order.processedData.formattedTotalValue} {quoteToken}
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        </div>

                        {/* Account Flow Information */}
                        <div style={{ 
                          background: 'rgba(26, 32, 44, 0.8)', 
                          padding: '8px', 
                          borderRadius: '6px', 
                          marginBottom: '8px',
                          fontSize: '12px'
                        }}>
                          <div style={{ color: '#8892b0', marginBottom: '4px' }}>
                            <strong>💸 Buyer's Flow:</strong>
                          </div>
                          {(() => {
                            const [baseToken, quoteToken] = selectedMarket.split('/');
                            return (
                              <>
                                <div style={{ color: '#f87171', marginBottom: '2px' }}>
                                  • Paying from: {quoteToken} account ({order.processedData.shortFromAddress}...)
                                </div>
                                <div style={{ color: '#4ade80' }}>
                                  • Receiving to: {baseToken} account ({order.processedData.shortToAddress}...)
                                </div>
                              </>
                            );
                          })()}
                        </div>

                        {/* Execution Information for Sellers */}
                        <div style={{ 
                          background: 'rgba(139, 92, 246, 0.1)', 
                          padding: '8px', 
                          borderRadius: '6px', 
                          marginBottom: '8px',
                          border: '1px solid rgba(139, 92, 246, 0.3)'
                        }}>
                          <div style={{ color: '#8b5cf6', fontSize: '12px', fontWeight: '500', marginBottom: '4px' }}>
                            🎯 To Execute This Order (as seller):
                          </div>
                          {(() => {
                            const [baseToken] = selectedMarket.split('/');
                            return (
                              <div style={{ fontSize: '11px', color: '#a5b4fc' }}>
                                • You need: {order.processedData.formattedAmount} {baseToken} tokens<br/>
                                • You'll receive: {order.processedData.formattedWanting} {order.processedData.wantingTicker}<br/>
                                • Set your FROM account: Your {baseToken} token account<br/>
                                • Set your TO account: Your {order.processedData.wantingTicker} account
                              </div>
                            );
                          })()}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ fontSize: '10px', color: '#6b7280' }}>
                            {order.processedData.formattedTimestamp}
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <Button
                              onClick={() => executeOrder(order.txid, order)}
                              style={{
                                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '6px 12px',
                                fontSize: '11px',
                                fontWeight: '500'
                              }}
                            >
                              🎯 Sell to This Buyer
                            </Button>
                            {order.owner === sessionStatus?.genesis && (
                              <Button
                                onClick={() => cancelOrder(order.txid)}
                                style={{
                                  background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                                  color: '#ffffff',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '6px 12px',
                                  fontSize: '11px',
                                  fontWeight: '500'
                                }}
                              >
                                🗑️ Cancel My Order
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Pagination Controls for Bids */}
                    {marketData.bids.length > ORDERS_PER_PAGE && (
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        gap: '8px', 
                        marginTop: '16px',
                        padding: '8px'
                      }}>
                        <Button
                          onClick={() => setBidPage(Math.max(0, bidPage - 1))}
                          disabled={bidPage === 0}
                          style={{
                            background: bidPage === 0 ? '#374151' : 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '12px'
                          }}
                        >
                          ← Prev
                        </Button>
                        <span style={{ color: '#8892b0', fontSize: '12px' }}>
                          Page {bidPage + 1} of {Math.ceil(marketData.bids.length / ORDERS_PER_PAGE)}
                        </span>
                        <Button
                          onClick={() => setBidPage(Math.min(Math.ceil(marketData.bids.length / ORDERS_PER_PAGE) - 1, bidPage + 1))}
                          disabled={bidPage >= Math.ceil(marketData.bids.length / ORDERS_PER_PAGE) - 1}
                          style={{
                            background: bidPage >= Math.ceil(marketData.bids.length / ORDERS_PER_PAGE) - 1 ? '#374151' : 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '12px'
                          }}
                        >
                          Next →
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ color: '#8892b0', textAlign: 'center', padding: '20px' }}>
                    No buy orders available
                  </div>
                )}
              </div>
            </Card>

            {/* Sell Orders (Asks) */}
            <Card>
              {(() => {
                const [baseToken, quoteToken] = selectedMarket.split('/');
                return (
                  <>
                    <h4 style={{ color: '#f87171', marginBottom: '16px' }}>🔴 Sell Orders (Asks) ({processedMarketData.asks?.length || 0})</h4>
                    <div style={{ 
                      marginBottom: '12px', 
                      padding: '8px', 
                      background: 'rgba(248, 113, 113, 0.1)', 
                      borderRadius: '6px', 
                      fontSize: '12px', 
                      color: '#f87171',
                      border: '1px solid rgba(248, 113, 113, 0.3)'
                    }}>
                      <strong>💡 Sell Orders:</strong> Users wanting to <strong>sell {baseToken} for {quoteToken}</strong>
                    </div>
                    <div style={{ 
                      marginBottom: '12px', 
                      padding: '6px 8px', 
                      background: 'rgba(139, 92, 246, 0.1)', 
                      borderRadius: '4px', 
                      fontSize: '11px', 
                      color: '#a5b4fc',
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                      textAlign: 'center'
                    }}>
                      📊 <strong>Sorted by Price:</strong> Lowest to Highest (Best sell prices first)
                    </div>
                  </>
                );
              })()}
              <div style={{ 
                maxHeight: '400px', 
                overflowY: 'auto',
                overflowX: 'hidden',
                padding: '4px',
                margin: '-4px'
              }}>
                {processedMarketData.asks?.length > 0 ? (
                  <>
                    {processedMarketData.asks.slice(askPage * ORDERS_PER_PAGE, (askPage + 1) * ORDERS_PER_PAGE).map((order) => (
                      <div 
                        key={order.txid} 
                        style={{ 
                          background: 'rgba(248, 113, 113, 0.1)', 
                          border: '1px solid rgba(248, 113, 113, 0.3)',
                          borderRadius: '8px', 
                          padding: '12px', 
                          marginBottom: '8px' 
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <div>
                            {(() => {
                              const [baseToken, quoteToken] = selectedMarket.split('/');
                              return (
                                <>
                                  <span style={{ fontWeight: '600', color: '#f87171', fontSize: '16px' }}>
                                    💰 {order.processedData.formattedPrice} {quoteToken} per {baseToken}
                                  </span>
                                  <div style={{ fontSize: '11px', color: '#8892b0', marginTop: '2px' }}>
                                    Order ID: {order.processedData.shortTxid}...
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            {(() => {
                              const [baseToken, quoteToken] = selectedMarket.split('/');
                              return (
                                <>
                                  <div style={{ fontSize: '13px', color: '#f87171', fontWeight: '500' }}>
                                    Selling: {order.processedData.formattedAmount} {baseToken}
                                  </div>
                                  <div style={{ fontSize: '11px', color: '#8892b0' }}>
                                    For: {order.processedData.formattedTotalValue} {quoteToken}
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        </div>

                        {/* Account Flow Information */}
                        <div style={{ 
                          background: 'rgba(26, 32, 44, 0.8)', 
                          padding: '8px', 
                          borderRadius: '6px', 
                          marginBottom: '8px',
                          fontSize: '12px'
                        }}>
                          <div style={{ color: '#8892b0', marginBottom: '4px' }}>
                            <strong>💸 Seller's Flow:</strong>
                          </div>
                          {(() => {
                            const [baseToken, quoteToken] = selectedMarket.split('/');
                            return (
                              <>
                                <div style={{ color: '#f87171', marginBottom: '2px' }}>
                                  • Paying from: {baseToken} account ({order.processedData.shortFromAddress}...)
                                </div>
                                <div style={{ color: '#4ade80' }}>
                                  • Receiving to: {quoteToken} account ({order.processedData.shortToAddress}...)
                                </div>
                              </>
                            );
                          })()}
                        </div>

                        {/* Execution Information for Buyers */}
                        <div style={{ 
                          background: 'rgba(139, 92, 246, 0.1)', 
                          padding: '8px', 
                          borderRadius: '6px', 
                          marginBottom: '8px',
                          border: '1px solid rgba(139, 92, 246, 0.3)'
                        }}>
                          <div style={{ color: '#8b5cf6', fontSize: '12px', fontWeight: '500', marginBottom: '4px' }}>
                            🎯 To Execute This Order (as buyer):
                          </div>
                          {(() => {
                            const [baseToken] = selectedMarket.split('/');
                            return (
                              <div style={{ fontSize: '11px', color: '#a5b4fc' }}>
                                • You need: {order.processedData.formattedWanting} {order.processedData.wantingTicker}<br/>
                                • You'll receive: {order.processedData.formattedAmount} {baseToken} tokens<br/>
                                • Set your FROM account: Your {order.processedData.wantingTicker} account<br/>
                                • Set your TO account: Your {baseToken} token account
                              </div>
                            );
                          })()}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ fontSize: '10px', color: '#6b7280' }}>
                            {order.processedData.formattedTimestamp}
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <Button
                              onClick={() => executeOrder(order.txid, order)}
                              style={{
                                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '6px 12px',
                                fontSize: '11px',
                                fontWeight: '500'
                              }}
                            >
                              🎯 Buy from This Seller
                            </Button>
                            {order.owner === sessionStatus?.genesis && (
                              <Button
                                onClick={() => cancelOrder(order.txid)}
                                style={{
                                  background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                                  color: '#ffffff',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '6px 12px',
                                  fontSize: '11px',
                                  fontWeight: '500'
                                }}
                              >
                                🗑️ Cancel My Order
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Pagination Controls for Asks */}
                    {marketData.asks.length > ORDERS_PER_PAGE && (
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        gap: '8px', 
                        marginTop: '16px',
                        padding: '8px'
                      }}>
                        <Button
                          onClick={() => setAskPage(Math.max(0, askPage - 1))}
                          disabled={askPage === 0}
                          style={{
                            background: askPage === 0 ? '#374151' : 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '12px'
                          }}
                        >
                          ← Prev
                        </Button>
                        <span style={{ color: '#8892b0', fontSize: '12px' }}>
                          Page {askPage + 1} of {Math.ceil(marketData.asks.length / ORDERS_PER_PAGE)}
                        </span>
                        <Button
                          onClick={() => setAskPage(Math.min(Math.ceil(marketData.asks.length / ORDERS_PER_PAGE) - 1, askPage + 1))}
                          disabled={askPage >= Math.ceil(marketData.asks.length / ORDERS_PER_PAGE) - 1}
                          style={{
                            background: askPage >= Math.ceil(marketData.asks.length / ORDERS_PER_PAGE) - 1 ? '#374151' : 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '12px'
                          }}
                        >
                          Next →
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ color: '#8892b0', textAlign: 'center', padding: '20px' }}>
                    No sell orders available
                  </div>
                )}
              </div>
            </Card>
          </GridContainer>
        </FieldSet>

        {/* Enhanced Trading Activity Section */}
        <FieldSet legend="📊 My Trading Activity - Comprehensive Analysis">
          {/* Activity Overview Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
            padding: '16px',
            background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
            borderRadius: '12px',
            border: '1px solid #4b5563'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Total Transactions</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#8b5cf6' }}>
                {tradingActivity.totalTransactions}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Active Markets</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#00d4aa' }}>
                {tradingActivity.activeMarkets}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Active Buy Orders</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#4ade80' }}>
                {tradingActivity.activeBuyOrders}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Active Sell Orders</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#f87171' }}>
                {tradingActivity.activeSellOrders}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Executed Trades</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#fbbf24' }}>
                {tradingActivity.executedTrades}
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '20px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <ActionButton
              onClick={discoverTradingActivity}
              disabled={activityLoading}
              style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              {activityLoading ? '🔍 Discovering...' : '🔍 Discover Trading Activity'}
            </ActionButton>

            {tradingActivity.signatureChainGenesis && (
              <div style={{
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '12px',
                color: '#8b5cf6'
              }}>
                🔗 Genesis: {tradingActivity.signatureChainGenesis.substring(0, 16)}...
              </div>
            )}

            {tradingActivity.lastUpdated && (
              <div style={{
                background: 'rgba(0, 212, 170, 0.1)',
                border: '1px solid rgba(0, 212, 170, 0.3)',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '12px',
                color: '#00d4aa'
              }}>
                ⏰ Updated: {new Date(tradingActivity.lastUpdated).toLocaleTimeString()}
              </div>
            )}
          </div>

          {/* Error Display */}
          {activityError && (
            <div style={{
              background: 'rgba(248, 113, 113, 0.1)',
              border: '1px solid rgba(248, 113, 113, 0.3)',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '20px',
              color: '#f87171'
            }}>
              <strong>⚠️ Discovery Error:</strong> {activityError}
            </div>
          )}

          {/* Discovered Trading Pairs */}
          {tradingActivity.discoveredPairs.length > 0 && (
            <Card style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#00d4aa', marginBottom: '12px' }}>🔄 Discovered Trading Pairs</h4>
              <div style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                marginBottom: '16px'
              }}>
                <button
                  onClick={() => setSelectedTradingPair('all')}
                  style={{
                    background: selectedTradingPair === 'all' 
                      ? 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)'
                      : 'linear-gradient(135deg, #374151 0%, #4b5563 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  📊 All Pairs
                </button>
                {tradingActivity.discoveredPairs.map((pair, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedTradingPair(pair);
                      setSelectedMarket(pair);
                      refreshMarketData();
                    }}
                    style={{
                      background: selectedTradingPair === pair 
                        ? 'linear-gradient(135deg, #00d4aa 0%, #4ade80 100%)'
                        : 'linear-gradient(135deg, #374151 0%, #4b5563 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {pair}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: '12px', color: '#8892b0' }}>
                💡 Click a trading pair to filter transaction history and switch to that market
              </div>
            </Card>
          )}

          {/* Comprehensive Transaction History */}
          <Card>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <h4 style={{ color: '#8b5cf6', margin: 0 }}>📋 Complete Transaction History</h4>
              <div style={{ fontSize: '12px', color: '#8892b0' }}>
                {(() => {
                  const filteredTransactions = selectedTradingPair === 'all' 
                    ? tradingActivity.transactionHistory 
                    : tradingActivity.transactionHistory.filter(tx => tx.marketPair === selectedTradingPair);
                  return `${filteredTransactions.length} transactions found${selectedTradingPair !== 'all' ? ` (${selectedTradingPair})` : ''}`;
                })()}
              </div>
            </div>

            <div style={{
              maxHeight: '500px',
              overflowY: 'auto',
              overflowX: 'hidden',
              padding: '4px',
              margin: '-4px'
            }}>
              {(() => {
                const filteredTransactions = selectedTradingPair === 'all' 
                  ? tradingActivity.transactionHistory 
                  : tradingActivity.transactionHistory.filter(tx => tx.marketPair === selectedTradingPair);
                
                const TRANSACTIONS_PER_PAGE = 5;
                const startIndex = transactionPage * TRANSACTIONS_PER_PAGE;
                const endIndex = startIndex + TRANSACTIONS_PER_PAGE;
                const displayedTransactions = filteredTransactions.slice(startIndex, endIndex);
                const totalPages = Math.ceil(filteredTransactions.length / TRANSACTIONS_PER_PAGE);

                return filteredTransactions.length > 0 ? (
                  <>
                    {displayedTransactions.map((tx, index) => (
                  <div
                    key={tx.txid || index}
                    style={{
                      padding: '16px',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      marginBottom: '12px',
                      background: tx.status === 'active' 
                        ? 'linear-gradient(135deg, rgba(0, 212, 170, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)'
                        : 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
                      border: tx.status === 'active' 
                        ? '1px solid rgba(0, 212, 170, 0.3)'
                        : '1px solid #374151'
                    }}
                  >
                    {/* Transaction Header */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '12px'
                    }}>
                      <div>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: tx.orderType === 'buy' ? '#4ade80' : '#f87171',
                          marginBottom: '4px'
                        }}>
                          {tx.orderType === 'buy' ? '📈' : '📉'} {tx.type.replace(/_/g, ' ')}
                          {tx.status === 'active' && (
                            <span style={{
                              marginLeft: '8px',
                              background: 'rgba(0, 212, 170, 0.2)',
                              color: '#00d4aa',
                              padding: '2px 6px',
                              borderRadius: '10px',
                              fontSize: '10px',
                              fontWeight: '500'
                            }}>
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '12px', color: '#8892b0' }}>
                          Market: {tx.marketPair || 'Unknown'}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{
                          fontSize: '12px',
                          color: '#6b7280',
                          marginBottom: '2px'
                        }}>
                          {new Date(tx.timestamp * 1000).toLocaleString()}
                        </div>
                        <div style={{
                          fontSize: '10px',
                          color: tx.status === 'confirmed' ? '#4ade80' : tx.status === 'active' ? '#00d4aa' : '#f59e0b'
                        }}>
                          {tx.status?.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    {/* Transaction Details */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                      gap: '12px',
                      fontSize: '13px',
                      color: '#8892b0'
                    }}>
                      {tx.amount && (
                        <div>
                          <strong>Amount:</strong> {(() => {
                            const amount = parseFloat(tx.amount);
                            const ticker = tx.ticker || 'Unknown';
                            
                            // For market orders, show proper token amount formatting
                            if (tx.type === 'MARKET_BUY_ORDER' || tx.type === 'MARKET_SELL_ORDER') {
                              // Convert NXS from divisible units (1 mill per NXS)
                              if (ticker === 'NXS') {
                                const nxsAmount = amount / 1000000; // Convert from divisible units
                                return nxsAmount.toFixed(6);
                              } else {
                                // For other tokens, use standard formatting
                                return amount.toFixed(2);
                              }
                            }
                            
                            // For other transaction types, apply NXS conversion if needed
                            if (ticker === 'NXS') {
                              // Check if amount seems to be in divisible units (> 1000)
                              const nxsAmount = amount > 1000 ? amount / 1000000 : amount;
                              return nxsAmount.toFixed(6);
                            }
                            
                            return amount.toFixed(2);
                          })()} {tx.ticker || 'Unknown'}
                        </div>
                      )}
                      {tx.price && (
                        <div>
                          <strong>Price:</strong> {(() => {
                            const price = parseFloat(tx.price);
                            // Price should always be in NXS terms
                            const displayPrice = price > 1000 ? price / 1000000 : price;
                            return displayPrice.toFixed(6);
                          })()} NXS per {(() => {
                            // Show what token this price is for
                            if (tx.marketPair) {
                              const [baseToken] = tx.marketPair.split('/');
                              return baseToken;
                            }
                            return tx.ticker || 'token';
                          })()}
                        </div>
                      )}
                      {tx.sequence && (
                        <div>
                          <strong>Sequence:</strong> {tx.sequence}
                        </div>
                      )}
                      {tx.confirmations !== undefined && (
                        <div>
                          <strong>Confirmations:</strong> {tx.confirmations}
                        </div>
                      )}
                    </div>

                    {/* Transaction ID */}
                    <div style={{
                      marginTop: '12px',
                      padding: '8px',
                      background: 'rgba(26, 32, 44, 0.8)',
                      borderRadius: '6px',
                      fontSize: '11px',
                      color: '#9ca3af',
                      fontFamily: 'monospace',
                      wordBreak: 'break-all'
                    }}>
                      <strong>TxID:</strong> {tx.txid}
                    </div>

                    {/* Action Buttons */}
                    {tx.status === 'active' && (
                      <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                        <ActionButton
                          variant="danger"
                          onClick={() => cancelOrder(tx.txid)}
                          style={{
                            fontSize: '12px',
                            padding: '6px 12px',
                            minWidth: 'auto'
                          }}
                        >
                          🗑️ Cancel Order
                        </ActionButton>
                        <ActionButton
                          variant="secondary"
                          onClick={() => {
                            NEXUS.utilities.showInfoDialog({
                              message: 'Transaction Details',
                              note: JSON.stringify(tx, null, 2)
                            });
                          }}
                          style={{
                            fontSize: '12px',
                            padding: '6px 12px',
                            minWidth: 'auto'
                          }}
                        >
                          📋 View Details
                        </ActionButton>
                      </div>
                    )}
                  </div>
                ))}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        gap: '12px', 
                        marginTop: '20px',
                        padding: '16px',
                        background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
                        borderRadius: '8px',
                        border: '1px solid #4b5563'
                      }}>
                        <ActionButton
                          variant="secondary"
                          onClick={() => setTransactionPage(Math.max(0, transactionPage - 1))}
                          disabled={transactionPage === 0}
                          style={{ fontSize: '12px', padding: '8px 16px', minWidth: 'auto' }}
                        >
                          ← Previous
                        </ActionButton>
                        
                        <div style={{ 
                          display: 'flex', 
                          gap: '4px',
                          alignItems: 'center',
                          color: '#8892b0',
                          fontSize: '12px'
                        }}>
                          Page {transactionPage + 1} of {totalPages}
                        </div>

                        <ActionButton
                          variant="secondary"
                          onClick={() => setTransactionPage(Math.min(totalPages - 1, transactionPage + 1))}
                          disabled={transactionPage >= totalPages - 1}
                          style={{ fontSize: '12px', padding: '8px 16px', minWidth: 'auto' }}
                        >
                          Next →
                        </ActionButton>
                      </div>
                    )}
                  </>
                ) : activityLoading ? (
                <div style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  color: '#8892b0'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                  <div>Discovering trading activity...</div>
                  <div style={{ fontSize: '14px', marginTop: '8px' }}>
                    Analyzing LEDGER API and Market API data
                  </div>
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  color: '#6b7280'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
                  <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                    No Trading Activity Found
                  </div>
                  <div style={{ fontSize: '14px', marginBottom: '16px' }}>
                    Click "Discover Trading Activity" to analyze your signature chain for trading history
                  </div>
                  <ActionButton
                    onClick={discoverTradingActivity}
                    style={{
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                      fontSize: '14px'
                    }}
                  >
                    🔍 Start Discovery
                  </ActionButton>
                </div>
              );
            })()}
            </div>
          </Card>

          {/* Technical Information */}
          <Card style={{ marginTop: '16px' }}>
            <h4 style={{ color: '#06b6d4', marginBottom: '12px' }}>🔧 Technical Information</h4>
            <div style={{
              background: '#1f2937',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#8892b0'
            }}>
              <p style={{ marginBottom: '8px' }}>
                <strong>Multi-User Environment:</strong> This system identifies trading activity by analyzing 
                your specific signature chain genesis and cross-referencing with Market API data.
              </p>
              <p style={{ marginBottom: '8px' }}>
                <strong>LEDGER API Integration:</strong> Uses <code>ledger/list/transactions</code> to retrieve 
                comprehensive transaction history for accurate activity discovery.
              </p>
              <p style={{ marginBottom: '8px' }}>
                <strong>Session Validation:</strong> Automatically detects your current signature chain from 
                session status to ensure accurate user identification.
              </p>
              <p>
                <strong>Cross-API Validation:</strong> Combines LEDGER API, Market API, and Finance API data 
                for complete trading activity analysis.
              </p>
            </div>
          </Card>
        </FieldSet>
      </Card>
    </div>
  );

  // Finance API State
  const [walletData, setWalletData] = useState({
    balances: [],
    stakeInfo: null,
    accounts: [],
    tokens: [],
    transactions: []
  });

  const [debitForm, setDebitForm] = useState({
    from: '',
    to: '',
    amount: '',
    reference: '',
    expires: ''
  });

  const [creditForm, setCreditForm] = useState({
    txid: ''
  });

  const [tokenForm, setTokenForm] = useState({
    name: '',
    supply: '',
    decimals: '2'
  });

  const [accountForm, setAccountForm] = useState({
    name: '',
    token: 'NXS'
  });

  const [stakeForm, setStakeForm] = useState({
    amount: '',
    expires: '0'
  });

  const [burnForm, setBurnForm] = useState({
    account: '',
    amount: '',
    reference: ''
  });

  const [voidForm, setVoidForm] = useState({
    txid: ''
  });

  // Separate forms for account-to-account and token-to-account transfers
  const [accountTransferForm, setAccountTransferForm] = useState({
    from: '',
    to: '',
    amount: '',
    reference: '',
    expires: ''
  });

  const [tokenTransferForm, setTokenTransferForm] = useState({
    tokenAddress: '',
    to: '',
    amount: '',
    reference: '',
    expires: ''
  });

  const [selectedAccount, setSelectedAccount] = useState('');
  const [activeWalletTab, setActiveWalletTab] = useState('overview');

  // Finance API Functions
  const refreshWalletData = async () => {
    try {
      setLoading(true);

      // Fetch comprehensive balance information
      const balancesResult = await NEXUS.utilities.apiCall('finance/get/balances');

      // Fetch stake information
      let stakeResult = null;
      try {
        stakeResult = await NEXUS.utilities.apiCall('finance/get/stakeinfo');
      } catch (error) {
        console.log('Stake info not available:', error.message);
      }

      // Fetch accounts - try multiple methods to ensure we get all accounts
      let accountsResult = [];
      try {
        // Primary method
        accountsResult = await NEXUS.utilities.apiCall('finance/list/account');
      } catch (error) {
        console.log('Primary account list failed:', error.message);
        try {
          // Alternative method - list all accounts
          accountsResult = await NEXUS.utilities.apiCall('finance/list/accounts');
        } catch (error2) {
          console.log('Alternative account list failed:', error2.message);
        }
      }

      // Fetch tokens
      const tokensResult = await NEXUS.utilities.apiCall('finance/list/token');

      // Enhanced Token Discovery for Cross-Token Trading Pairs
      const userTokens = [];
      const tokenPairs = new Set();
      
      // Collect all user tokens from accounts and tokens
      if (accountsResult && Array.isArray(accountsResult)) {
        accountsResult.forEach(account => {
          if (account.ticker && account.ticker !== 'NXS' && parseFloat(account.balance || 0) > 0) {
            const tokenInfo = {
              ticker: account.ticker,
              balance: account.balance,
              address: account.address,
              name: account.name,
              source: 'account'
            };
            if (!userTokens.find(t => t.ticker === account.ticker)) {
              userTokens.push(tokenInfo);
            }
          }
        });
      }
      
      if (tokensResult && Array.isArray(tokensResult)) {
        tokensResult.forEach(token => {
          if (token.ticker && token.ticker !== 'NXS') {
            const tokenInfo = {
              ticker: token.ticker,
              supply: token.currentsupply,
              maxSupply: token.maxsupply,
              decimals: token.decimals,
              address: token.address,
              source: 'token'
            };
            if (!userTokens.find(t => t.ticker === token.ticker)) {
              userTokens.push(tokenInfo);
            }
          }
        });
      }
      
      // Generate all possible trading pairs
      // 1. Token/NXS pairs (existing functionality)
      userTokens.forEach(token => {
        tokenPairs.add(`${token.ticker}/NXS`);
      });
      
      // 2. Cross-token pairs (new functionality)
      const crossPairs = [];
      for (let i = 0; i < userTokens.length; i++) {
        for (let j = i + 1; j < userTokens.length; j++) {
          const token1 = userTokens[i];
          const token2 = userTokens[j];
          
          // Create both directions of the pair
          const pair1 = `${token1.ticker}/${token2.ticker}`;
          const pair2 = `${token2.ticker}/${token1.ticker}`;
          
          tokenPairs.add(pair1);
          tokenPairs.add(pair2);
          crossPairs.push(pair1, pair2);
        }
      }
      
      // Update state with discovered tokens and pairs
      setAllUserTokens(userTokens);
      setCrossTokenPairs(crossPairs);
      setAvailableMarkets(Array.from(tokenPairs).sort());
      
      console.log(`🎯 Enhanced Token Discovery Complete:`);
      console.log(`📊 Found ${userTokens.length} user tokens:`, userTokens.map(t => t.ticker));
      console.log(`🔄 Generated ${tokenPairs.size} trading pairs:`, Array.from(tokenPairs));
      console.log(`⚡ Cross-token pairs: ${crossPairs.length}`, crossPairs);

      setWalletData({
        balances: balancesResult || [],
        stakeInfo: stakeResult,
        accounts: accountsResult || [],
        tokens: tokensResult || [],
        transactions: []
      });

    } catch (error) {
      NEXUS.utilities.showErrorDialog({
        message: 'Failed to Refresh Wallet Data',
        note: error?.message || 'Unknown error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  // finance/debit/account - Transfer from account to account
  const debitFromAccount = async () => {
    if (!accountTransferForm.from || !accountTransferForm.to || !accountTransferForm.amount) {
      NEXUS.utilities.showErrorDialog({
        message: 'Missing Transfer Details',
        note: 'Please fill in from account, to account, and amount',
      });
      return;
    }

    try {
      setLoading(true);

      // Validate account name formats
      const validateAccountName = (account) => {
        if (account.includes(':') || account.includes('::') || account.length >= 51) {
          return account; // Already properly formatted
        }
        return account; // Local name, use as-is
      };

      const params = {
        from: validateAccountName(accountTransferForm.from.trim()),
        to: validateAccountName(accountTransferForm.to.trim()),
        amount: parseFloat(accountTransferForm.amount),
      };

      if (accountTransferForm.reference) {
        params.reference = parseInt(accountTransferForm.reference, 10);
      }

      if (accountTransferForm.expires) {
        params.expires = parseInt(accountTransferForm.expires, 10);
      }

      const result = await NEXUS.utilities.secureApiCall('finance/debit/account', params);

      NEXUS.utilities.showSuccessDialog({
        message: 'Account Transfer Successful',
        note: `Transaction ID: ${result.txid}`,
      });

      setAccountTransferForm({ from: '', to: '', amount: '', reference: '', expires: '' });
      await refreshWalletData();
    } catch (error) {
      NEXUS.utilities.showErrorDialog({
        message: 'Account Transfer Failed',
        note: error?.message || 'Unknown error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  // finance/debit/token - Transfer from token address to account
  const debitFromToken = async () => {
    if (!tokenTransferForm.tokenAddress || !tokenTransferForm.to || !tokenTransferForm.amount) {
      NEXUS.utilities.showErrorDialog({
        message: 'Missing Token Transfer Details',
        note: 'Please fill in token address, recipient account, and amount',
      });
      return;
    }

    try {
      setLoading(true);

      const params = {
        from: tokenTransferForm.tokenAddress.trim(),
        to: tokenTransferForm.to.trim(),
        amount: parseFloat(tokenTransferForm.amount),
      };

      if (tokenTransferForm.reference) {
        params.reference = parseInt(tokenTransferForm.reference, 10);
      }

      if (tokenTransferForm.expires) {
        params.expires = parseInt(tokenTransferForm.expires, 10);
      }

      const result = await NEXUS.utilities.secureApiCall('finance/debit/token', params);

      NEXUS.utilities.showSuccessDialog({
        message: 'Token Transfer Successful',
        note: `Transaction ID: ${result.txid}`,
      });

      setTokenTransferForm({ tokenAddress: '', to: '', amount: '', reference: '', expires: '' });
      await refreshWalletData();
    } catch (error) {
      NEXUS.utilities.showErrorDialog({
        message: 'Token Transfer Failed',
        note: error?.message || 'Unknown error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  // finance/credit/token - Increment tokens received from a token account
  const creditTokenTransaction = async () => {
    if (!creditForm.txid) {
      NEXUS.utilities.showErrorDialog({
        message: 'Missing Transaction ID',
        note: 'Please enter the transaction ID to credit',
      });
      return;
    }

    // Validate transaction ID format - allow various Nexus transaction ID formats
    const trimmedTxid = creditForm.txid.trim();
    if (trimmedTxid.length < 16 || !/^[0-9a-fA-F]+$/.test(trimmedTxid)) {
      NEXUS.utilities.showErrorDialog({
        message: 'Invalid Transaction ID Format',
        note: 'Transaction ID must be a hexadecimal string (typically 64 characters, but other lengths are accepted)',
      });
      return;
    }

    try {
      setLoading(true);

      // Call finance/credit/token endpoint
      const result = await NEXUS.utilities.secureApiCall('finance/credit/token', {
        txid: trimmedTxid
      });

      NEXUS.utilities.showSuccessDialog({
        message: 'Token Credit Successful',
        note: `Tokens credited successfully. Transaction ID: ${result.txid}`,
      });

      setCreditForm({ txid: '' });
      await refreshWalletData();

    } catch (error) {
      NEXUS.utilities.showErrorDialog({
        message: 'Token Credit Failed',
        note: error?.message || 'Transaction not found, already credited, or not a valid token transaction. Verify the transaction ID corresponds to a token debit sent to your account.',
      });
    } finally {
      setLoading(false);
    }
  };

  // finance/credit/account - Increment NXS received from an account
  const creditAccountTransaction = async () => {
    if (!creditForm.txid) {
      NEXUS.utilities.showErrorDialog({
        message: 'Missing Transaction ID',
        note: 'Please enter the transaction ID to credit',
      });
      return;
    }

    // Validate transaction ID format
    const trimmedTxid = creditForm.txid.trim();
    if (trimmedTxid.length < 16 || !/^[0-9a-fA-F]+$/.test(trimmedTxid)) {
      NEXUS.utilities.showErrorDialog({
        message: 'Invalid Transaction ID Format',
        note: 'Transaction ID must be a hexadecimal string (typically 64 characters, but other lengths are accepted)',
      });
      return;
    }

    try {
      setLoading(true);

      // Call finance/credit/account endpoint
      const result = await NEXUS.utilities.secureApiCall('finance/credit/account', {
        txid: trimmedTxid
      });

      NEXUS.utilities.showSuccessDialog({
        message: 'Account Credit Successful',
        note: `NXS credited successfully. Transaction ID: ${result.txid}`,
      });

      setCreditForm({ txid: '' });
      await refreshWalletData();

    } catch (error) {
      NEXUS.utilities.showErrorDialog({
        message: 'Account Credit Failed',
        note: error?.message || 'Transaction not found, already credited, or not a valid NXS transaction. Verify the transaction ID corresponds to an NXS debit sent to your account.',
      });
    } finally {
      setLoading(false);
    }
  };

  const createToken = async () => {
    if (!tokenForm.name || !tokenForm.supply) {
      NEXUS.utilities.showErrorDialog({
        message: 'Missing Token Details',
        note: 'Please fill in token name and supply',
      });
      return;
    }

    try {
      setLoading(true);
      const result = await NEXUS.utilities.secureApiCall('finance/create/token', {
        name: tokenForm.name,
        supply: parseFloat(tokenForm.supply),
        decimals: parseInt(tokenForm.decimals, 10)
      });

      NEXUS.utilities.showSuccessDialog({
        message: 'Token Created Successfully',
        note: `Token Address: ${result.address}`,
      });

      setTokenForm({ name: '', supply: '', decimals: '2' });
      await refreshWalletData();
    } catch (error) {
      NEXUS.utilities.showErrorDialog({
        message: 'Token Creation Failed',
        note: error?.message || 'Unknown error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  const createAccount = async () => {
    if (!accountForm.name) {
      NEXUS.utilities.showErrorDialog({
        message: 'Missing Account Name',
        note: 'Please enter an account name',
      });
      return;
    }

    try {
      setLoading(true);
      const result = await NEXUS.utilities.secureApiCall('finance/create/account', {
        name: accountForm.name,
        token: accountForm.token
      });

      NEXUS.utilities.showSuccessDialog({
        message: 'Account Created Successfully',
        note: `Account Address: ${result.address}`,
      });

      setAccountForm({ name: '', token: 'NXS' });

      // Wait a moment for the transaction to be processed, then refresh
      setTimeout(async () => {
        await refreshWalletData();
      }, 1000);

    } catch (error) {
      NEXUS.utilities.showErrorDialog({
        message: 'Account Creation Failed',
        note: error?.message || 'Unknown error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  const setStake = async () => {
    if (!stakeForm.amount) {
      NEXUS.utilities.showErrorDialog({
        message: 'Missing Stake Amount',
        note: 'Please enter the desired stake amount',
      });
      return;
    }

    try {
      setLoading(true);
      const result = await NEXUS.utilities.secureApiCall('finance/set/stake', {
        amount: parseFloat(stakeForm.amount),
        expires: parseInt(stakeForm.expires, 10)
      });

      NEXUS.utilities.showSuccessDialog({
        message: 'Stake Updated Successfully',
        note: `Transaction ID: ${result.txid}`,
      });

      setStakeForm({ amount: '', expires: '0' });
      await refreshWalletData();
    } catch (error) {
      NEXUS.utilities.showErrorDialog({
        message: 'Stake Update Failed',
        note: error?.message || 'Unknown error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  const burnTokens = async () => {
    if (!burnForm.account || !burnForm.amount) {
      NEXUS.utilities.showErrorDialog({
        message: 'Missing Burn Details',
        note: 'Please specify account and amount to burn',
      });
      return;
    }

    try {
      setLoading(true);
      const params = {
        name: burnForm.account,
        amount: parseFloat(burnForm.amount)
      };

      if (burnForm.reference) {
        params.reference = parseInt(burnForm.reference, 10);
      }

      const result = await NEXUS.utilities.secureApiCall('finance/burn/account', params);

      NEXUS.utilities.showSuccessDialog({
        message: 'Tokens Burned Successfully',
        note: `Transaction ID: ${result.txid}`,
      });

      setBurnForm({ account: '', amount: '', reference: '' });
      await refreshWalletData();
    } catch (error) {
      NEXUS.utilities.showErrorDialog({
        message: 'Token Burn Failed',
        note: error?.message || 'Unknown error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  const voidTransaction = async () => {
    if (!voidForm.txid) {
      NEXUS.utilities.showErrorDialog({
        message: 'Missing Transaction ID',
        note: 'Please enter the transaction ID to void',
      });
      return;
    }

    const confirmed = await NEXUS.utilities.confirm({
      question: 'Are you sure you want to void this transaction?',
      note: 'This action cannot be undone and only works on unclaimed transactions.',
    });

    if (confirmed) {
      try {
        setLoading(true);
        const result = await NEXUS.utilities.secureApiCall('finance/void/transaction', {
          txid: voidForm.txid
        });

        NEXUS.utilities.showSuccessDialog({
          message: 'Transaction Voided Successfully',
          note: `New Transaction Hash: ${result.hash}`,
        });

        setVoidForm({ txid: '' });
        await refreshWalletData();
      } catch (error) {
        NEXUS.utilities.showErrorDialog({
          message: 'Transaction Void Failed',
          note: error?.message || 'Unknown error occurred',
      });
    } finally {
      setLoading(false);
    }
    }
  };

  const getAccountDetails = async (accountName) => {
    try {
      const result = await NEXUS.utilities.apiCall('finance/get/account', {
        name: accountName
      });

      NEXUS.utilities.showInfoDialog({
        message: 'Account Details',
        note: JSON.stringify(result, null, 2)
      });
    } catch (error) {
      NEXUS.utilities.showErrorDialog({
        message: 'Failed to Get Account Details',
        note: error?.message || 'Unknown error occurred',
      });
    }
  };

  const getAccountHistory = async (accountName) => {
    try {
      const result = await NEXUS.utilities.apiCall('finance/history/account', {
        name: accountName
      });

      NEXUS.utilities.showInfoDialog({
        message: 'Account History',
        note: JSON.stringify(result, null, 2)
      });
    } catch (error) {
      NEXUS.utilities.showErrorDialog({
        message: 'Failed to Get Account History',
        note: error?.message || 'Unknown error occurred',
      });
    }
  };

  const getAccountTransactions = async (accountName) => {
    if (!accountName?.trim()) {
      NEXUS.utilities.showErrorDialog({
        message: 'Account Name Required',
        note: 'Please enter an account name or select one from the dropdown'
      });
      return;
    }

    try {
      setLoading(true);
      
      // Show loading notification
      NEXUS.utilities.showNotification({
        content: `Loading transactions for ${accountName}...`,
        type: 'info'
      });

      // Try different API endpoints based on account type
      let result = null;
      const trimmedAccountName = accountName.trim();
      
      try {
        // First try with account name
        result = await NEXUS.utilities.apiCall('finance/transactions/account', {
          name: trimmedAccountName,
          verbose: 'summary',
          limit: 100,
          sort: 'timestamp',
          order: 'desc'
        });
      } catch (nameError) {
        console.log('Account name lookup failed, trying address lookup:', nameError);
        
        // If name fails, try with address
        try {
          result = await NEXUS.utilities.apiCall('finance/transactions/account', {
            address: trimmedAccountName,
            verbose: 'summary',
            limit: 100,
            sort: 'timestamp',
            order: 'desc'
          });
        } catch (addressError) {
          console.log('Address lookup failed, trying token transactions:', addressError);
          
          // If both fail, try token transactions
          result = await NEXUS.utilities.apiCall('finance/transactions/token', {
            name: trimmedAccountName,
            verbose: 'summary',
            limit: 100,
            sort: 'timestamp',
            order: 'desc'
          });
        }
      }

      // Process and store the results
      const transactions = Array.isArray(result) ? result : [];
      
      setWalletData(prev => ({
        ...prev,
        transactions: transactions
      }));

      NEXUS.utilities.showSuccessDialog({
        message: 'Transactions Loaded Successfully',
        note: `Found ${transactions.length} transactions for ${trimmedAccountName}`
      });
      
    } catch (error) {
      console.error('Transaction loading error:', error);
      NEXUS.utilities.showErrorDialog({
        message: 'Failed to Load Transactions',
        note: `Error: ${error?.message || 'Unknown error occurred'}\n\nTip: Make sure the account name/address is correct and the account exists.`
      });
    } finally {
      setLoading(false);
    }
  };

  // Token Pair Creation Functions
  const createBaseToken = async () => {
    if (!tokenPairForm.baseToken.name || !tokenPairForm.baseToken.supply) {
      NEXUS.utilities.showErrorDialog({
        message: 'Missing Base Token Details',
        note: 'Please fill in base token name and supply',
      });
      return false;
    }

    try {
      setPairCreationLoading(true);
      const result = await NEXUS.utilities.secureApiCall('finance/create/token', {
        name: tokenPairForm.baseToken.name,
        supply: parseFloat(tokenPairForm.baseToken.supply),
        decimals: parseInt(tokenPairForm.baseToken.decimals, 10)
      });

      setCreatedTokens(prev => ({
        ...prev,
        baseToken: {
          ...result,
          name: tokenPairForm.baseToken.name,
          ticker: tokenPairForm.baseToken.name,
          supply: tokenPairForm.baseToken.supply,
          decimals: tokenPairForm.baseToken.decimals
        }
      }));

      NEXUS.utilities.showSuccessDialog({
        message: 'Base Token Created Successfully',
        note: `Token Address: ${result.address}`,
      });

      return true;
    } catch (error) {
      NEXUS.utilities.showErrorDialog({
        message: 'Base Token Creation Failed',
        note: error?.message || 'Unknown error occurred',
      });
      return false;
    } finally {
      setPairCreationLoading(false);
    }
  };

  const createQuoteToken = async () => {
    if (!tokenPairForm.quoteToken.name || !tokenPairForm.quoteToken.supply) {
      NEXUS.utilities.showErrorDialog({
        message: 'Missing Quote Token Details',
        note: 'Please fill in quote token name and supply',
      });
      return false;
    }

    try {
      setPairCreationLoading(true);
      const result = await NEXUS.utilities.secureApiCall('finance/create/token', {
        name: tokenPairForm.quoteToken.name,
        supply: parseFloat(tokenPairForm.quoteToken.supply),
        decimals: parseInt(tokenPairForm.quoteToken.decimals, 10)
      });

      setCreatedTokens(prev => ({
        ...prev,
        quoteToken: {
          ...result,
          name: tokenPairForm.quoteToken.name,
          ticker: tokenPairForm.quoteToken.name,
          supply: tokenPairForm.quoteToken.supply,
          decimals: tokenPairForm.quoteToken.decimals
        }
      }));

      NEXUS.utilities.showSuccessDialog({
        message: 'Quote Token Created Successfully',
        note: `Token Address: ${result.address}`,
      });

      return true;
    } catch (error) {
      NEXUS.utilities.showErrorDialog({
        message: 'Quote Token Creation Failed',
        note: error?.message || 'Unknown error occurred',
      });
      return false;
    } finally {
      setPairCreationLoading(false);
    }
  };

  const createTokenAccounts = async () => {
    if (!createdTokens.baseToken || !createdTokens.quoteToken) {
      NEXUS.utilities.showErrorDialog({
        message: 'Tokens Required',
        note: 'Please create both base and quote tokens first',
      });
      return false;
    }

    try {
      setPairCreationLoading(true);

      // Create base token account
      const baseAccountName = tokenPairForm.accounts.baseTokenAccount || `${createdTokens.baseToken.name}_Account`;
      const baseAccountResult = await NEXUS.utilities.secureApiCall('finance/create/account', {
        name: baseAccountName,
        token: createdTokens.baseToken.address
      });

      // Create quote token account
      const quoteAccountName = tokenPairForm.accounts.quoteTokenAccount || `${createdTokens.quoteToken.name}_Account`;
      const quoteAccountResult = await NEXUS.utilities.secureApiCall('finance/create/account', {
        name: quoteAccountName,
        token: createdTokens.quoteToken.address
      });

      setCreatedAccounts({
        baseTokenAccount: {
          ...baseAccountResult,
          name: baseAccountName,
          token: createdTokens.baseToken.address,
          ticker: createdTokens.baseToken.name
        },
        quoteTokenAccount: {
          ...quoteAccountResult,
          name: quoteAccountName,
          token: createdTokens.quoteToken.address,
          ticker: createdTokens.quoteToken.name
        }
      });

      NEXUS.utilities.showSuccessDialog({
        message: 'Token Accounts Created Successfully',
        note: `Base Account: ${baseAccountName}\nQuote Account: ${quoteAccountName}`,
      });

      return true;
    } catch (error) {
      NEXUS.utilities.showErrorDialog({
        message: 'Account Creation Failed',
        note: error?.message || 'Unknown error occurred',
      });
      return false;
    } finally {
      setPairCreationLoading(false);
    }
  };

  const createInitialBuyOrder = async () => {
    if (!tokenPairForm.initialOrders.buyOrder.amount || !tokenPairForm.initialOrders.buyOrder.price) {
      return true; // Skip if no buy order details provided
    }

    if (!createdTokens.baseToken || !createdTokens.quoteToken || !createdAccounts.baseTokenAccount || !createdAccounts.quoteTokenAccount) {
      NEXUS.utilities.showErrorDialog({
        message: 'Prerequisites Missing',
        note: 'Please complete token and account creation first',
      });
      return false;
    }

    try {
      setPairCreationLoading(true);
      const marketPair = `${createdTokens.baseToken.name}/${createdTokens.quoteToken.name}`;
      
      const result = await NEXUS.utilities.secureApiCall('market/create/bid', {
        market: marketPair,
        amount: parseFloat(tokenPairForm.initialOrders.buyOrder.amount),
        price: parseFloat(tokenPairForm.initialOrders.buyOrder.price),
        from: createdAccounts.quoteTokenAccount.name,
        to: createdAccounts.baseTokenAccount.name
      });

      NEXUS.utilities.showSuccessDialog({
        message: 'Initial Buy Order Created',
        note: `Market: ${marketPair}\nTransaction ID: ${result.txid}`,
      });

      return true;
    } catch (error) {
      NEXUS.utilities.showErrorDialog({
        message: 'Buy Order Creation Failed',
        note: error?.message || 'Unknown error occurred',
      });
      return false;
    } finally {
      setPairCreationLoading(false);
    }
  };

  const createInitialSellOrder = async () => {
    if (!tokenPairForm.initialOrders.sellOrder.amount || !tokenPairForm.initialOrders.sellOrder.price) {
      return true; // Skip if no sell order details provided
    }

    if (!createdTokens.baseToken || !createdTokens.quoteToken || !createdAccounts.baseTokenAccount || !createdAccounts.quoteTokenAccount) {
      NEXUS.utilities.showErrorDialog({
        message: 'Prerequisites Missing',
        note: 'Please complete token and account creation first',
      });
      return false;
    }

    try {
      setPairCreationLoading(true);
      const marketPair = `${createdTokens.baseToken.name}/${createdTokens.quoteToken.name}`;
      
      const result = await NEXUS.utilities.secureApiCall('market/create/ask', {
        market: marketPair,
        amount: parseFloat(tokenPairForm.initialOrders.sellOrder.amount),
        price: parseFloat(tokenPairForm.initialOrders.sellOrder.price),
        from: createdAccounts.baseTokenAccount.name,
        to: createdAccounts.quoteTokenAccount.name
      });

      NEXUS.utilities.showSuccessDialog({
        message: 'Initial Sell Order Created',
        note: `Market: ${marketPair}\nTransaction ID: ${result.txid}`,
      });

      return true;
    } catch (error) {
      NEXUS.utilities.showErrorDialog({
        message: 'Sell Order Creation Failed',
        note: error?.message || 'Unknown error occurred',
      });
      return false;
    } finally {
      setPairCreationLoading(false);
    }
  };

  const createCompleteTradingPair = async () => {
    try {
      setPairCreationStep(1);
      
      // Step 1: Create Base Token
      const baseTokenSuccess = await createBaseToken();
      if (!baseTokenSuccess) return;
      
      setPairCreationStep(2);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Brief pause
      
      // Step 2: Create Quote Token
      const quoteTokenSuccess = await createQuoteToken();
      if (!quoteTokenSuccess) return;
      
      setPairCreationStep(3);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 3: Create Accounts
      const accountsSuccess = await createTokenAccounts();
      if (!accountsSuccess) return;
      
      setPairCreationStep(4);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 4: Create Initial Orders (optional)
      await createInitialBuyOrder();
      await createInitialSellOrder();
      
      setPairCreationStep(5);
      
      // Final success message
      const marketPair = `${createdTokens.baseToken?.name || tokenPairForm.baseToken.name}/${createdTokens.quoteToken?.name || tokenPairForm.quoteToken.name}`;
      
      NEXUS.utilities.showSuccessDialog({
        message: 'Trading Pair Created Successfully!',
        note: `Market Pair: ${marketPair}\n\nThe trading pair is now available in the P2P Marketplace and will be discoverable in the Token Browser for other users.`,
      });

      // Refresh wallet data to show new tokens and accounts
      await refreshWalletData();
      
      // Switch to marketplace to show the new trading pair
      setTimeout(() => {
        dispatch(setActiveTab('marketplace'));
        setSelectedMarket(marketPair);
      }, 2000);

    } catch (error) {
      NEXUS.utilities.showErrorDialog({
        message: 'Trading Pair Creation Failed',
        note: error?.message || 'An error occurred during the creation process',
      });
    }
  };

  const resetTokenPairForm = () => {
    setTokenPairForm({
      baseToken: { name: '', supply: '', decimals: '2' },
      quoteToken: { name: '', supply: '', decimals: '2' },
      accounts: { baseTokenAccount: '', quoteTokenAccount: '' },
      initialOrders: { buyOrder: { amount: '', price: '' }, sellOrder: { amount: '', price: '' } }
    });
    setCreatedTokens({ baseToken: null, quoteToken: null });
    setCreatedAccounts({ baseTokenAccount: null, quoteTokenAccount: null });
    setPairCreationStep(1);
  };



  // Token Pair Creation State
  const [tokenPairForm, setTokenPairForm] = useState({
    baseToken: {
      name: '',
      supply: '',
      decimals: '2'
    },
    quoteToken: {
      name: '',
      supply: '',
      decimals: '2'
    },
    accounts: {
      baseTokenAccount: '',
      quoteTokenAccount: ''
    },
    initialOrders: {
      buyOrder: {
        amount: '',
        price: ''
      },
      sellOrder: {
        amount: '',
        price: ''
      }
    }
  });

  const [createdTokens, setCreatedTokens] = useState({
    baseToken: null,
    quoteToken: null
  });

  const [createdAccounts, setCreatedAccounts] = useState({
    baseTokenAccount: null,
    quoteTokenAccount: null
  });

  const [pairCreationStep, setPairCreationStep] = useState(1);
  const [pairCreationLoading, setPairCreationLoading] = useState(false);

  const WalletTabButton = styled.button(({ active }) => ({
    background: active 
      ? 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)' 
      : 'transparent',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    color: active ? '#ffffff' : '#8b5cf6',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    margin: '0 4px 8px 0',
    '&:hover': {
      background: active 
        ? 'linear-gradient(135deg, #0CA4FB 0%, #3b82f6 100%)' 
        : 'rgba(12, 164, 251, 0.1)',
      borderColor: 'rgba(12, 164, 251, 0.5)',
    },
  }));

  const renderWallet = () => (
    <div>
      <Card>
        <h2 style={{ color: '#8b5cf6', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          💰 Finance API - Comprehensive Wallet Management
          <ActionButton 
            variant="secondary" 
            onClick={refreshWalletData} 
            disabled={loading}
            style={{ fontSize: '12px', padding: '8px 16px', minWidth: 'auto' }}
          >
            {loading ? '🔄 Refreshing...' : '🔄 Refresh'}
          </ActionButton>
        </h2>

        {/* Wallet Navigation Tabs */}
        <div style={{ marginBottom: '24px', borderBottom: '1px solid rgba(139, 92, 246, 0.2)', paddingBottom: '16px' }}>
          <WalletTabButton 
            active={activeWalletTab === 'overview'} 
            onClick={() => setActiveWalletTab('overview')}
          >
            📊 Overview
          </WalletTabButton>
          <WalletTabButton 
            active={activeWalletTab === 'transactions'} 
            onClick={() => setActiveWalletTab('transactions')}
          >
            💸 Transactions
          </WalletTabButton>
          <WalletTabButton 
            active={activeWalletTab === 'accounts'} 
            onClick={() => setActiveWalletTab('accounts')}
          >
            📁 Accounts
          </WalletTabButton>
          <WalletTabButton 
            active={activeWalletTab === 'tokens'} 
            onClick={() => setActiveWalletTab('tokens')}
          >
            🪙 Tokens
          </WalletTabButton>
          <WalletTabButton 
            active={activeWalletTab === 'staking'} 
            onClick={() => setActiveWalletTab('staking')}
          >
            🥩 Staking
          </WalletTabButton>
          {/* Token Pairs tab removed - token creation handled via Finance API, trading pairs via Token Browser */}
          <WalletTabButton 
            active={activeWalletTab === 'advanced'} 
            onClick={() => setActiveWalletTab('advanced')}
          >
            ⚙️ Advanced
          </WalletTabButton>
        </div>

        {/* Overview Tab */}
        {activeWalletTab === 'overview' && (
          <div>
            {/* Balance Summary Cards */}
            <GridContainer>
              {walletData.balances?.length > 0 ? (
                walletData.balances.map((balance, index) => (
                  <Card key={index}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h3 style={{ color: '#8b5cf6', margin: 0 }}>
                        💳 {balance.ticker || 'Unknown'}
                      </h3>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#00d4aa' }}>
                        {parseFloat(balance.available || 0).toFixed(balance.decimals || 6)}
                      </div>
                    </div>
                    <div style={{ fontSize: '14px', color: '#8892b0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div><strong>Available:</strong> {parseFloat(balance.available || 0).toFixed(balance.decimals || 6)}</div>
                      <div><strong>Unclaimed:</strong> {parseFloat(balance.unclaimed || 0).toFixed(balance.decimals || 6)}</div>
                      <div><strong>Unconfirmed:</strong> {parseFloat(balance.unconfirmed || 0).toFixed(balance.decimals || 6)}</div>
                      <div><strong>Pending:</strong> {parseFloat(balance.pending || 0).toFixed(balance.decimals || 6)}</div>
                      {balance.stake && (
                        <>
                          <div><strong>Staked:</strong> {parseFloat(balance.stake || 0).toFixed(balance.decimals || 6)}</div>
                          <div><strong>Immature:</strong> {parseFloat(balance.immature || 0).toFixed(balance.decimals || 6)}</div>
                        </>
                      )}
                    </div>
                  </Card>
                ))
              ) : (
                <Card>
                  <p style={{ color: '#6b7280', textAlign: 'center', margin: 0 }}>
                    No balance information available. Try refreshing or creating an account.
                  </p>
                </Card>
              )}

              {/* Stake Information Card */}
              {walletData.stakeInfo && (
                <Card>
                  <h3 style={{ color: '#f59e0b', marginBottom: '16px' }}>🥩 Staking Status</h3>
                  <div style={{ fontSize: '14px', color: '#8892b0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div><strong>Balance:</strong> {parseFloat(walletData.stakeInfo.balance || 0).toFixed(6)} NXS</div>
                    <div><strong>Staked:</strong> {parseFloat(walletData.stakeInfo.stake || 0).toFixed(6)} NXS</div>
                    <div><strong>Trust Score:</strong> {walletData.stakeInfo.trust || 0}</div>
                    <div><strong>Stake Rate:</strong> {parseFloat(walletData.stakeInfo.stakerate || 0).toFixed(2)}%</div>
                    <div><strong>Trust Weight:</strong> {parseFloat(walletData.stakeInfo.trustweight || 0).toFixed(2)}%</div>
                    <div><strong>Block Weight:</strong> {parseFloat(walletData.stakeInfo.blockweight || 0).toFixed(2)}%</div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <StatusIndicator status={walletData.stakeInfo.staking ? 'connected' : 'disconnected'}>
                        {walletData.stakeInfo.staking ? '✅ Staking Active' : '❌ Staking Inactive'}
                      </StatusIndicator>
                      {walletData.stakeInfo.onhold && (
                        <StatusIndicator status="disconnected" style={{ marginLeft: '8px' }}>
                          ⏳ On Hold
                        </StatusIndicator>
                      )}
                    </div>
                  </div>
                </Card>
              )}
            </GridContainer>
          </div>
        )}

        {/* Transactions Tab */}
        {activeWalletTab === 'transactions' && (
          <div>
            {/* Account to Account Transfer (finance/debit/account) */}
            <Card>
              <h3 style={{ color: '#3b82f6' }}>🏦 Account to Account Transfer</h3>
              <FieldSet legend="finance/debit/account - Transfer between accounts">
                <div style={{ marginBottom: '12px', padding: '8px', background: '#1f2937', borderRadius: '6px', fontSize: '12px', color: '#8892b0' }}>
                  <strong>Account Name Formats:</strong><br/>
                  • Local: <code>myaccount</code><br/>
                  • User-scoped: <code>username:accountname</code><br/>
                  • Namespace: <code>namespace::accountname</code><br/>
                  • Register Address: <code>8ABC...51chars</code>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <StyledTextField
                      variant="wallet"
                      placeholder="From Account (name or address)"
                      value={accountTransferForm.from}
                      onChange={(e) => setAccountTransferForm(prev => ({ ...prev, from: e.target.value }))}
                    />
                    <select
                      value={accountTransferForm.from}
                      onChange={(e) => setAccountTransferForm(prev => ({ ...prev, from: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #374151',
                        background: '#1f2937',
                        color: '#ffffff',
                        fontSize: '13px',
                        marginBottom: '12px'
                      }}
                    >
                      <option value="">Select Account</option>
                      {walletData.accounts?.map((account, idx) => (
                        <option key={idx} value={account.name || account.address}>
                          {account.ticker} - {parseFloat(account.balance || 0).toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <StyledTextField
                    variant="wallet"
                    placeholder="To Account (name or address)"
                    value={accountTransferForm.to}
                    onChange={(e) => setAccountTransferForm(prev => ({ ...prev, to: e.target.value }))}
                  />

                  <StyledTextField
                    variant="wallet"
                    type="number"
                    step="any"
                    placeholder="Amount"
                    value={accountTransferForm.amount}
                    onChange={(e) => setAccountTransferForm(prev => ({ ...prev, amount: e.target.value }))}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                  <StyledTextField
                    variant="wallet"
                    placeholder="Reference (optional integer)"
                    value={accountTransferForm.reference}
                    onChange={(e) => setAccountTransferForm(prev => ({ ...prev, reference: e.target.value }))}
                  />
                  <StyledTextField
                    variant="wallet"
                    placeholder="Expires (seconds, 0 = never, default = 604800)"
                    value={accountTransferForm.expires}
                    onChange={(e) => setAccountTransferForm(prev => ({ ...prev, expires: e.target.value }))}
                  />
                </div>

                <ActionButton onClick={debitFromAccount} disabled={loading}>
                  {loading ? 'Processing...' : '🏦 Transfer from Account'}
                </ActionButton>
              </FieldSet>
            </Card>

            {/* Token to Account Transfer (finance/debit/token) */}
            <Card>
              <h3 style={{ color: '#8b5cf6' }}>🪙 Token to Account Transfer</h3>
              <FieldSet legend="finance/debit/token - Transfer from token address to account">
                <div style={{ marginBottom: '12px', padding: '8px', background: '#1f2937', borderRadius: '6px', fontSize: '12px', color: '#8892b0' }}>
                  <strong>Note:</strong> This transfers tokens from a token address (token issuer) to an account. Use the token's register address as the "from" field.
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <StyledTextField
                      variant="tokens"
                      placeholder="Token Address (register address)"
                      value={tokenTransferForm.tokenAddress}
                      onChange={(e) => setTokenTransferForm(prev => ({ ...prev, tokenAddress: e.target.value }))}
                    />
                    <select
                      value={tokenTransferForm.tokenAddress}
                      onChange={(e) => setTokenTransferForm(prev => ({ ...prev, tokenAddress: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #374151',
                        background: '#1f2937',
                        color: '#ffffff',
                        fontSize: '13px',
                        marginBottom: '12px'
                      }}
                    >
                      <option value="">Select Token</option>
                      {walletData.tokens?.map((token, idx) => (
                        <option key={idx} value={token.address}>
                          {token.ticker} - {parseFloat(token.currentsupply || 0).toFixed(2)} / {parseFloat(token.maxsupply || 0).toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <StyledTextField
                    variant="tokens"
                    placeholder="To Account (recipient account name or address)"
                    value={tokenTransferForm.to}
                    onChange={(e) => setTokenTransferForm(prev => ({ ...prev, to: e.target.value }))}
                  />

                  <StyledTextField
                    variant="tokens"
                    type="number"
                    step="any"
                    placeholder="Amount"
                    value={tokenTransferForm.amount}
                    onChange={(e) => setTokenTransferForm(prev => ({ ...prev, amount: e.target.value }))}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                  <StyledTextField
                    variant="tokens"
                    placeholder="Reference (optional integer)"
                    value={tokenTransferForm.reference}
                    onChange={(e) => setTokenTransferForm(prev => ({ ...prev, reference: e.target.value }))}
                  />
                  <StyledTextField
                    variant="tokens"
                    placeholder="Expires (seconds, 0 = never, default = 604800)"
                    value={tokenTransferForm.expires}
                    onChange={(e) => setTokenTransferForm(prev => ({ ...prev, expires: e.target.value }))}
                  />
                </div>

                <ActionButton onClick={debitFromToken} disabled={loading}>
                  {loading ? 'Processing...' : '🪙 Transfer from Token'}
                </ActionButton>
              </FieldSet>
            </Card>

            {/* Credit Transactions */}
            <Card>
              <h3 style={{ color: '#10b981' }}>💳 Credit (Receive) Transactions</h3>

              {/* Token Credit */}
              <FieldSet legend="finance/credit/token - Credit token transactions">
                <div style={{ marginBottom: '12px', padding: '8px', background: '#1f2937', borderRadius: '6px', fontSize: '12px', color: '#8892b0' }}>
                  <strong>Purpose:</strong> Increment an amount of tokens received from a token account. Use this for token debit transactions sent to your account.
                </div>

                <StyledTextField
                  variant="transactions"
                  placeholder="Transaction ID (txid) for token transaction"
                  value={creditForm.txid}
                  onChange={(e) => setCreditForm(prev => ({ ...prev, txid: e.target.value }))}
                />

                <ActionButton onClick={creditTokenTransaction} disabled={loading} style={{ marginBottom: '16px' }}>
                  {loading ? 'Processing...' : '🪙 Credit Token Transaction'}
                </ActionButton>
              </FieldSet>

              {/* Account Credit */}
              <FieldSet legend="finance/credit/account - Credit NXS transactions">
                <div style={{ marginBottom: '12px', padding: '8px', background: '#1f2937', borderRadius: '6px', fontSize: '12px', color: '#8892b0' }}>
                  <strong>Purpose:</strong> Increment an amount received from an NXS account. Use this for NXS debit transactions sent to your account.
                </div>

                <StyledTextField
                  variant="transactions"
                  placeholder="Transaction ID (txid) for NXS transaction"
                  value={creditForm.txid}
                  onChange={(e) => setCreditForm(prev => ({ ...prev, txid: e.target.value }))}
                />

                <ActionButton onClick={creditAccountTransaction} disabled={loading}>
                  {loading ? 'Processing...' : '🏦 Credit NXS Transaction'}
                </ActionButton>
              </FieldSet>
            </Card>

            {/* Transaction History */}
            <Card>
              <h3 style={{ color: '#8b5cf6' }}>📋 Recent Transactions</h3>
              <div style={{ 
                marginBottom: '16px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                flexWrap: 'wrap'
              }}>
                <div style={{ flex: '1', minWidth: '250px' }}>
                  <StyledTextField
                    variant="transactions"
                    placeholder="Account name to load transactions"
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
                <ActionButton 
                  variant="secondary" 
                  onClick={() => getAccountTransactions(selectedAccount)}
                  disabled={!selectedAccount?.trim() || loading}
                  style={{ minWidth: '180px' }}
                >
                  📋 Load Transactions
                </ActionButton>
              </div>
              
              {/* Account Selection Helper */}
              <div style={{ marginBottom: '16px' }}>
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #374151',
                    background: '#1f2937',
                    color: '#ffffff',
                    fontSize: '13px',
                    marginBottom: '8px'
                  }}
                >
                  <option value="">Select an account to load transactions</option>
                  {walletData.accounts?.map((account, idx) => (
                    <option key={idx} value={account.name || account.address}>
                      {account.name || account.address} ({account.ticker}) - Balance: {parseFloat(account.balance || 0).toFixed(2)}
                    </option>
                  ))}
                </select>
                <div style={{ fontSize: '12px', color: '#8892b0', marginBottom: '8px' }}>
                  💡 <strong>Tip:</strong> Select an account from the dropdown above or manually enter an account name/address
                </div>
              </div>

              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {walletData.transactions?.length > 0 ? (
                  walletData.transactions.map((tx, index) => (
                    <div key={index} style={{
                      padding: '12px',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      marginBottom: '8px',
                      background: '#1f2937'
                    }}>
                      <div style={{ fontSize: '13px', color: '#8892b0', marginBottom: '8px' }}>
                        <div><strong>TxID:</strong> {tx.txid?.substring(0, 32)}...</div>
                        <div><strong>Type:</strong> {tx.type} | <strong>Sequence:</strong> {tx.sequence}</div>
                        <div><strong>Time:</strong> {new Date(tx.timestamp * 1000).toLocaleString()}</div>
                        <div><strong>Confirmations:</strong> {tx.confirmations}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#6b7280', textAlign: 'center' }}>
                    No transactions loaded. Enter an account name and click "Load Transactions".
                  </p>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Accounts Tab */}
        {activeWalletTab === 'accounts' && (
          <div>
            <GridContainer>
              {/* Create Account */}
              <Card>
                <h3 style={{ color: '#06b6d4' }}>📁 Create New Account</h3>
                <FieldSet legend="Create a new token account">
                  <StyledTextField
                    variant="accounts"
                    placeholder="Account Name"
                    value={accountForm.name}
                    onChange={(e) => setAccountForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <StyledTextField
                    variant="accounts"
                    placeholder="Token (address, ticker, or 'NXS')"
                    value={accountForm.token}
                    onChange={(e) => setAccountForm(prev => ({ ...prev, token: e.target.value }))}
                  />
                  <ActionButton onClick={createAccount} disabled={loading}>
                    {loading ? 'Creating...' : '📁 Create Account'}
                  </ActionButton>
                </FieldSet>
              </Card>

              {/* Account Management */}
              <Card>
                <h3 style={{ color: '#8b5cf6' }}>📊 Account Management</h3>
                <FieldSet legend="Get account information">
                  <StyledTextField
                    variant="accounts"
                    placeholder="Account name for details/history"
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                  />
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <ActionButton 
                      variant="secondary" 
                      onClick={() => getAccountDetails(selectedAccount)}
                      disabled={!selectedAccount || loading}
                    >
                      📋 Get Details
                    </ActionButton>
                    <ActionButton 
                      variant="secondary" 
                      onClick={() => getAccountHistory(selectedAccount)}
                      disabled={!selectedAccount || loading}
                    >
                      📜 Get History
                    </ActionButton>
                  </div>
                </FieldSet>
              </Card>
            </GridContainer>

            {/* Accounts List */}
            <Card>
              <h3>📋 Your Accounts</h3>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {walletData.accounts?.length > 0 ? (
                  walletData.accounts.map((account, index) => (
                    <div key={index} style={{
                      padding: '12px',
                      borderBottom: '1px solid #374151',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <span style={{ fontWeight: 'bold', color: '#8b5cf6' }}>
                          {account.ticker || 'N/A'} Account
                        </span>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          Balance: {parseFloat(account.balance || 0).toFixed(account.decimals || 6)}
                        </div>
                        <div style={{ fontSize: '10px', color: '#4b5563' }}>
                          {account.address}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          onClick={() => setSelectedAccount(account.name || account.address)}
                          style={{
                            background: '#374151',
                            border: 'none',
                            color: '#8b5cf6',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            cursor: 'pointer'
                          }}
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#6b7280', textAlign: 'center' }}>
                    No accounts found. Create your first account above.
                  </p>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Tokens Tab */}
        {activeWalletTab === 'tokens' && (
          <div>
            <GridContainer>
              {/* Create Token */}
              <Card>
                <h3 style={{ color: '#8b5cf6' }}>🪙 Create New Token</h3>
                <FieldSet legend="Create a new token">
                  <StyledTextField
                    variant="tokens"
                    placeholder="Token Name"
                    value={tokenForm.name}
                    onChange={(e) => setTokenForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <StyledTextField
                    variant="tokens"
                    type="number"
                    placeholder="Total Supply"
                    value={tokenForm.supply}
                    onChange={(e) => setTokenForm(prev => ({ ...prev, supply: e.target.value }))}
                  />
                  <div>
                    <label style={{ color: '#8892b0', marginBottom: '8px', display: 'block', fontSize: '14px' }}>
                      Token Decimals (0-18, default: 2)
                    </label>
                    <StyledTextField
                      variant="tokens"
                      type="number"
                      placeholder="2"
                      value={tokenForm.decimals}
                      min="0"
                      max="18"
                      onChange={(e) => {
                        const value = Math.max(0, Math.min(18, parseInt(e.target.value) || 0));
                        setTokenForm(prev => ({ ...prev, decimals: value.toString() }));
                      }}
                    />
                  </div>
                  <ActionButton onClick={createToken} disabled={loading}>
                    {loading ? 'Creating...' : '🪙 Create Token'}
                  </ActionButton>
                </FieldSet>
              </Card>

              {/* Burn Tokens */}
              <Card>
                <h3 style={{ color: '#ef4444' }}>🔥 Burn Tokens</h3>
                <FieldSet legend="Permanently remove tokens from circulation">
                  <StyledTextField
                    variant="tokens"
                    placeholder="Account Name or Address"
                    value={burnForm.account}
                    onChange={(e) => setBurnForm(prev => ({ ...prev, account: e.target.value }))}
                  />
                  <StyledTextField
                    variant="tokens"
                    type="number"
                    placeholder="Amount to Burn"
                    value={burnForm.amount}
                    onChange={(e) => setBurnForm(prev => ({ ...prev, amount: e.target.value }))}
                  />
                  <StyledTextField
                    variant="tokens"
                    placeholder="Reference (optional)"
                    value={burnForm.reference}
                    onChange={(e) => setBurnForm(prev => ({ ...prev, reference: e.target.value }))}
                  />
                  <ActionButton variant="danger" onClick={burnTokens} disabled={loading}>
                    {loading ? 'Burning...' : '🔥 Burn Tokens'}
                  </ActionButton>
                </FieldSet>
              </Card>
            </GridContainer>

            {/* Tokens List */}
            <Card>
              <h3>🪙 Your Tokens</h3>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {walletData.tokens?.length > 0 ? (
                  walletData.tokens.map((token, index) => (
                    <div key={index} style={{
                      padding: '12px',
                      borderBottom: '1px solid #374151',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <span style={{ fontWeight: 'bold', color: '#8b5cf6' }}>
                          {token.ticker || 'Unknown Token'}
                        </span>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          Supply: {parseFloat(token.currentsupply || 0).toFixed(token.decimals || 2)} / {parseFloat(token.maxsupply || 0).toFixed(token.decimals || 2)}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          Decimals: {token.decimals || 0}
                        </div>
                        <div style={{ fontSize: '10px', color: '#4b5563' }}>
                          {token.address}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#6b7280', textAlign: 'center' }}>
                    No tokens found. Create your first token above.
                  </p>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Staking Tab */}
        {activeWalletTab === 'staking' && (
          <div>
            <GridContainer>
              {/* Set Stake */}
              <Card>
                <h3 style={{ color: '#f59e0b' }}>🥩 Manage Stake</h3>
                <FieldSet legend="Set staking amount">
                  <StyledTextField
                    variant="staking"
                    type="number"
                    placeholder="New Stake Amount (total stake, not additional)"
                    value={stakeForm.amount}
                    onChange={(e) => setStakeForm(prev => ({ ...prev, amount: e.target.value }))}
                  />
                  <StyledTextField
                    variant="staking"
                    type="number"
                    placeholder="Expires (seconds, 0 = never)"
                    value={stakeForm.expires}
                    onChange={(e) => setStakeForm(prev => ({ ...prev, expires: e.target.value }))}
                  />
                  <ActionButton onClick={setStake} disabled={loading}>
                    {loading ? 'Updating...' : '🥩 Update Stake'}
                  </ActionButton>
                </FieldSet>
                <div style={{ marginTop: '16px', padding: '12px', background: '#1f2937', borderRadius: '8px', fontSize: '13px', color: '#8892b0' }}>
                  <strong>Note:</strong> This sets the total stake amount. If you currently have 10,000 NXS staked and want to add 5,000 more, enter 15,000.
                </div>
              </Card>

              {/* Staking Information */}
              {walletData.stakeInfo && (
                <Card>
                  <h3 style={{ color: '#10b981' }}>📊 Current Staking Status</h3>
                  <div style={{ background: '#1f2937', padding: '16px', borderRadius: '8px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px', color: '#8892b0' }}>
                      <div><strong>Address:</strong></div>
                      <div style={{ fontSize: '12px', wordBreak: 'break-all' }}>{walletData.stakeInfo.address}</div>

                      <div><strong>Available Balance:</strong></div>
                      <div>{parseFloat(walletData.stakeInfo.balance || 0).toFixed(6)} NXS</div>

                      <div><strong>Staked Amount:</strong></div>
                      <div>{parseFloat(walletData.stakeInfo.stake || 0).toFixed(6)} NXS</div>

                      <div><strong>Trust Score:</strong></div>
                      <div>{walletData.stakeInfo.trust || 0}</div>

                      <div><strong>Annual Stake Rate:</strong></div>
                      <div>{parseFloat(walletData.stakeInfo.stakerate || 0).toFixed(4)}%</div>

                      <div><strong>Trust Weight:</strong></div>
                      <div>{parseFloat(walletData.stakeInfo.trustweight || 0).toFixed(2)}%</div>

                      <div><strong>Block Weight:</strong></div>
                      <div>{parseFloat(walletData.stakeInfo.blockweight || 0).toFixed(2)}%</div>

                      <div><strong>Stake Weight:</strong></div>
                      <div>{parseFloat(walletData.stakeInfo.stakeweight || 0).toFixed(2)}%</div>
                    </div>

                    <div style={{ marginTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <StatusIndicator status={walletData.stakeInfo.staking ? 'connected' : 'disconnected'}>
                        {walletData.stakeInfo.staking ? '✅ Staking Active' : '❌ Staking Inactive'}
                      </StatusIndicator>
                      <StatusIndicator status={walletData.stakeInfo.onhold ? 'disconnected' : 'connected'}>
                        {walletData.stakeInfo.onhold ? '⏳ On Hold' : '🚀 Ready'}
                      </StatusIndicator>
                      {walletData.stakeInfo.change && (
                        <StatusIndicator status="disconnected">
                          🔄 Pending Change
                        </StatusIndicator>
                      )}
                    </div>
                  </div>
                </Card>
              )}
            </GridContainer>
          </div>
        )}

        {/* Token Pairs functionality moved to Token Browser - tokens can be created via Finance API */}

        {/* Advanced Tab */}
        {activeWalletTab === 'advanced' && (
          <div>
            <GridContainer>
              {/* Void Transaction */}
              <Card>
                <h3 style={{ color: '#ef4444' }}>❌ Void Transaction</h3>
                <FieldSet legend="Reverse unclaimed debit transactions">
                  <StyledTextField
                    variant="advanced"
                    placeholder="Transaction ID to void"
                    value={voidForm.txid}
                    onChange={(e) => setVoidForm(prev => ({ ...prev, txid: e.target.value }))}
                  />
                  <ActionButton variant="danger" onClick={voidTransaction} disabled={loading}>
                    {loading ? 'Voiding...' : '❌ Void Transaction'}
                  </ActionButton>
                </FieldSet>
                <div style={{ marginTop: '16px', padding: '12px', background: '#7f1d1d', borderRadius: '8px', fontSize: '13px', color: '#fecaca' }}>
                  <strong>Warning:</strong> Only works on unclaimed debit/transfer transactions. This action cannot be undone once confirmed.
                </div>
              </Card>

              {/* Migration Tools */}
              <Card>
                <h3 style={{ color: '#8b5cf6' }}>🔄 Migration & Tools</h3>
                <FieldSet legend="Advanced operations">
                  <ActionButton 
                    variant="secondary" 
                    onClick={async () => {
                      try {
                        setLoading(true);
                        const result = await NEXUS.utilities.secureApiCall('finance/migrate/accounts', {
                          createname: true
                        });
                        NEXUS.utilities.showSuccessDialog({
                          message: 'Legacy Accounts Migrated',
                          note: `Migrated ${result?.length || 0} accounts successfully`,
                        });
                        await refreshWalletData();
                      } catch (error) {
                        NEXUS.utilities.showErrorDialog({
                          message: 'Migration Failed',
                          note: error?.message || 'Unknown error occurred',
                        });
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={loading}
                  >
                    🔄 Migrate Legacy Accounts
                  </ActionButton>
                </FieldSet>
                <div style={{ marginTop: '16px', padding: '12px', background: '#1f2937', borderRadius: '8px', fontSize: '13px', color: '#8892b0' }}>
                  <strong>Info:</strong> This migrates legacy wallet accounts to signature chain accounts. Each migration incurs a 0.01 NXS fee per account.
                </div>
              </Card>
            </GridContainer>

            {/* API Information */}
            <Card>
              <h3 style={{ color: '#06b6d4' }}>📚 Finance API Endpoints Available</h3>
              <div style={{ background: '#1f2937', padding: '16px', borderRadius: '8px', fontSize: '13px', color: '#8892b0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                  <div><strong>Verbs:</strong> create, debit, credit, burn, get, list, history, transactions</div>
                  <div><strong>Nouns:</strong> account, trust, token, any, all</div>
                  <div><strong>Direct:</strong> get/balances, get/stakeinfo, set/stake, void/transaction, migrate/accounts</div>
                </div>
                <div style={{ marginTop: '12px' }}>
                  <strong>Pattern:</strong> finance/verb/noun/filter/operator
                </div>
              </div>
            </Card>
          </div>
        )}
      </Card>
    </div>
  );

  // Token Browser rendering
  // Render Simplified Token Listing
  const renderSimplifiedTokenListing = () => {
    // Filter tokens for simplified listing
    const filteredSimplifiedTokens = allTokens.filter(token => {
      if (!simplifiedFilter) return true;
      const searchTerm = simplifiedFilter.toLowerCase();
      return (
          token.ticker?.toLowerCase().includes(searchTerm) ||
          token.address?.toLowerCase().includes(searchTerm)
        );
    });

    // Sort tokens
    const sortedSimplifiedTokens = [...filteredSimplifiedTokens].sort((a, b) => {
      let aVal, bVal;
      
      // Map sorting fields to actual token properties
      if (simplifiedSortBy === 'name') {
        aVal = a.ticker;
        bVal = b.ticker;
      } else if (simplifiedSortBy === 'supply') {
        aVal = parseFloat(a.currentsupply || 0);
        bVal = parseFloat(b.currentsupply || 0);
      } else {
        aVal = a[simplifiedSortBy];
        bVal = b[simplifiedSortBy];
      }
      
      if (simplifiedSortBy === 'supply') {
        // Numeric comparison for supply
        return aVal - bVal;
      } else {
        // String comparison for other fields
        aVal = String(aVal || '').toLowerCase();
        bVal = String(bVal || '').toLowerCase();
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      }
    });

    // Pagination
    const startIndex = simplifiedPage * simplifiedPerPage;
    const endIndex = startIndex + simplifiedPerPage;
    const paginatedTokens = sortedSimplifiedTokens.slice(startIndex, endIndex);
    const totalPages = Math.ceil(sortedSimplifiedTokens.length / simplifiedPerPage);

    return (
      <FieldSet legend="📋 Quick Token Browser - Trading Ready">
        <div style={{ marginBottom: '20px' }}>
          {/* Header with stats and controls */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{ 
                color: '#00D4FA', 
                fontWeight: '700', 
                fontSize: '14px',
                textShadow: '0 0 8px rgba(0, 212, 250, 0.3)'
              }}>
                📊 {sortedSimplifiedTokens.length} Available Tokens
              </div>
              <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '500' }}>
                Page {simplifiedPage + 1} of {Math.max(1, totalPages)}
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {/* Per page selector */}
              <select
                value={simplifiedPerPage}
                onChange={(e) => {
                  setSimplifiedPerPage(Number(e.target.value));
                  setSimplifiedPage(0);
                }}
                style={{
                  background: 'linear-gradient(135deg, #1f2937 0%, #0f172a 100%)',
                  border: '1px solid rgba(0, 212, 250, 0.4)',
                  color: '#e5e7eb',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  boxShadow: '0 2px 8px rgba(0, 212, 250, 0.1)'
                }}
              >
                <option style={{ background: '#1f2937', color: '#00D4FA' }} value={5}>5 per page</option>
                <option style={{ background: '#1f2937', color: '#00D4FA' }} value={10}>10 per page</option>
                <option style={{ background: '#1f2937', color: '#00D4FA' }} value={20}>20 per page</option>
                <option style={{ background: '#1f2937', color: '#00D4FA' }} value={50}>50 per page</option>
              </select>
              
              {/* Sort selector */}
              <select
                value={simplifiedSortBy}
                onChange={(e) => setSimplifiedSortBy(e.target.value)}
                style={{
                  background: 'linear-gradient(135deg, #1f2937 0%, #0f172a 100%)',
                  border: '1px solid rgba(0, 212, 250, 0.4)',
                  color: '#e5e7eb',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  boxShadow: '0 2px 8px rgba(0, 212, 250, 0.1)'
                }}
              >
                <option style={{ background: '#1f2937', color: '#00D4FA' }} value="ticker">Sort by Ticker</option>
                <option style={{ background: '#1f2937', color: '#00D4FA' }} value="name">Sort by Name</option>
                <option style={{ background: '#1f2937', color: '#00D4FA' }} value="supply">Sort by Supply</option>
                <option style={{ background: '#1f2937', color: '#00D4FA' }} value="modified">Sort by Modified</option>
              </select>
            </div>
          </div>

          {/* Search bar */}
          <div style={{ marginBottom: '16px' }}>
            <input
              type="text"
              placeholder="🔍 Search tokens by ticker, name, or address..."
              value={simplifiedFilter}
              onChange={(e) => {
                setSimplifiedFilter(e.target.value);
                setSimplifiedPage(0);
              }}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'linear-gradient(135deg, #1f2937 0%, #0f172a 100%)',
                border: '2px solid rgba(0, 212, 250, 0.3)',
                borderRadius: '8px',
                color: '#e5e7eb',
                fontSize: '14px',
                outline: 'none',
                boxShadow: '0 4px 12px rgba(0, 212, 250, 0.1)',
                transition: 'all 0.3s ease'
              }}
            />
          </div>

          {/* Token list */}
          {tokenSearchLoading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '24px', marginBottom: '12px' }}>⏳</div>
              <div style={{ color: '#6b7280' }}>Loading tokens...</div>
            </div>
          ) : paginatedTokens.length > 0 ? (
            <div style={{
              display: 'grid',
              gap: '8px',
              marginBottom: '20px'
            }}>
              {/* List header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '40px 1fr 200px 150px 120px',
                padding: '10px 12px',
                background: 'linear-gradient(135deg, rgba(0, 212, 250, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%)',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#00D4FA',
                gap: '12px',
                border: '1px solid rgba(0, 212, 250, 0.2)',
                textShadow: '0 0 4px rgba(0, 212, 250, 0.3)'
              }}>
                <div>Select</div>
                <div>Token</div>
                <div>Supply</div>
                <div>Market Status</div>
                <div>Trade</div>
              </div>
              
              {/* Token rows */}
              {paginatedTokens.map((token, index) => {
                const hasMarketActivity = availableMarkets.includes(`${token.ticker}/NXS`);
                const isSelected = selectedTokensForPairs.find(t => t.ticker === token.ticker);
                
                return (
                  <div
                    key={token.address || `token-${index}`}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '40px 1fr 200px 150px 120px',
                      padding: '12px',
                      background: isSelected 
                        ? 'linear-gradient(135deg, rgba(0, 212, 250, 0.2) 0%, rgba(59, 130, 246, 0.15) 100%)'
                        : 'linear-gradient(135deg, rgba(31, 41, 55, 0.9) 0%, rgba(15, 23, 42, 0.8) 100%)',
                      borderRadius: '8px',
                      border: isSelected
                        ? '2px solid rgba(0, 212, 250, 0.6)'
                        : '1px solid rgba(75, 85, 99, 0.3)',
                      transition: 'all 0.2s ease',
                      gap: '12px',
                      alignItems: 'center'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 212, 250, 0.1) 0%, rgba(31, 41, 55, 1) 100%)';
                        e.currentTarget.style.borderColor = 'rgba(0, 212, 250, 0.5)';
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 212, 250, 0.2)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(31, 41, 55, 0.9) 0%, rgba(15, 23, 42, 0.8) 100%)';
                        e.currentTarget.style.borderColor = 'rgba(75, 85, 99, 0.3)';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  >
                    {/* Selection checkbox */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <input
                        type="checkbox"
                        checked={!!isSelected}
                        onChange={() => toggleTokenSelection(token)}
                        disabled={!token.ticker}
                        style={{
                          width: '16px',
                          height: '16px',
                          accentColor: '#00D4FA',
                          cursor: token.ticker ? 'pointer' : 'not-allowed'
                        }}
                      />
                    </div>

                    {/* Token info */}
                    <div>
                      <div style={{ 
                        fontWeight: '700', 
                        color: '#f1f5f9', 
                        fontSize: '14px',
                        marginBottom: '4px'
                      }}>
                        💎 {token.ticker || 'Unknown'}
                      </div>
                      <div style={{ 
                        color: '#cbd5e1', 
                        fontSize: '12px',
                        marginBottom: '2px',
                        fontWeight: '500'
                      }}>
                        {token.ticker || 'Unnamed Token'}
                      </div>
                      <div style={{ 
                        color: '#94a3b8', 
                        fontSize: '10px',
                        fontFamily: 'monospace',
                        fontWeight: '400'
                      }}>
                        {token.address ? `${token.address.substring(0, 12)}...` : 'No address'}
                      </div>
                    </div>

                    {/* Supply */}
                    <div style={{ 
                      color: '#34d399', 
                      fontSize: '13px',
                      fontWeight: '500'
                    }}>
                      {token.currentsupply ? parseFloat(token.currentsupply).toLocaleString() : '0'}
                    </div>

                    {/* Market status */}
                    <div>
                      {hasMarketActivity ? (
                        <span style={{
                          background: 'rgba(16, 185, 129, 0.2)',
                          color: '#10b981',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '600'
                        }}>
                          🟢 Active
                        </span>
                      ) : (
                        <span style={{
                          background: 'rgba(107, 114, 128, 0.2)',
                          color: '#6b7280',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '600'
                        }}>
                          ⚪ Inactive
                        </span>
                      )}
                    </div>

                    {/* Trading pair actions */}
                    <div style={{ display: 'flex', gap: '4px', flexDirection: 'column' }}>
                      {token.ticker ? (
                        <>
                          <ActionButton
                            variant="secondary"
                            onClick={() => addTradingPair(token, 'NXS')}
                            style={{
                              minWidth: '80px',
                              fontSize: '10px',
                              padding: '4px 6px',
                              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                              color: '#ffffff',
                              border: 'none'
                            }}
                          >
                            ➕ Add {token.ticker}/NXS
                          </ActionButton>
                          
                          {selectedTradingPairs.find(pair => pair.pair === `${token.ticker}/NXS`) && (
                            <ActionButton
                              variant="secondary"
                              onClick={() => activateTradingPair(`${token.ticker}/NXS`)}
                              style={{
                                minWidth: '80px',
                                fontSize: '10px',
                                padding: '4px 6px',
                                background: 'linear-gradient(135deg, #00D4FA 0%, #0ea5e9 100%)',
                                color: '#ffffff',
                                border: 'none'
                              }}
                            >
                              ⚡ Trade Now
                            </ActionButton>
                          )}
                        </>
                      ) : (
                        <span style={{ color: '#6b7280', fontSize: '10px' }}>N/A</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px 20px',
              background: 'rgba(31, 41, 55, 0.5)',
              borderRadius: '8px',
              border: '2px dashed rgba(75, 85, 99, 0.3)'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</div>
              <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>
                {allTokens.length === 0 ? 'No Tokens Available' : 'No Matching Tokens'}
              </div>
              <div style={{ color: '#cbd5e1', fontSize: '12px', fontWeight: '500' }}>
                {allTokens.length === 0 
                  ? 'Refresh the token browser to discover available tokens'
                  : 'Try adjusting your search criteria'
                }
              </div>
            </div>
          )}

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '16px'
            }}>
              <div style={{ color: '#6b7280', fontSize: '12px' }}>
                Showing {startIndex + 1}-{Math.min(endIndex, sortedSimplifiedTokens.length)} of {sortedSimplifiedTokens.length}
              </div>
              
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <ActionButton
                  variant="secondary"
                  onClick={() => setSimplifiedPage(Math.max(0, simplifiedPage - 1))}
                  disabled={simplifiedPage === 0}
                  style={{ minWidth: '70px', fontSize: '11px', padding: '6px 10px' }}
                >
                  ← Prev
                </ActionButton>
                
                <span style={{ 
                  color: '#00D4FA', 
                  fontSize: '12px', 
                  fontWeight: '600',
                  textShadow: '0 0 4px rgba(0, 212, 250, 0.4)'
                }}>
                  {simplifiedPage + 1} / {totalPages}
                </span>
                
                <ActionButton
                  variant="secondary"
                  onClick={() => setSimplifiedPage(Math.min(totalPages - 1, simplifiedPage + 1))}
                  disabled={simplifiedPage >= totalPages - 1}
                  style={{ minWidth: '70px', fontSize: '11px', padding: '6px 10px' }}
                >
                  Next →
                </ActionButton>
              </div>
            </div>
          )}
        </div>
      </FieldSet>
    );
  };

  // Render selected trading pairs section
  const renderSelectedTradingPairs = () => {
    if (selectedTradingPairs.length === 0) {
      return (
        <FieldSet legend="🔗 Your Selected Trading Pairs">
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            background: 'rgba(31, 41, 55, 0.5)',
            borderRadius: '8px',
            border: '2px dashed rgba(75, 85, 99, 0.3)'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔗</div>
            <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>
              No Trading Pairs Selected
            </div>
            <div style={{ color: '#cbd5e1', fontSize: '12px', fontWeight: '500' }}>
              Add tokens from the browser above to create trading pairs
            </div>
          </div>
        </FieldSet>
      );
    }

    return (
      <FieldSet legend={`🔗 Your Selected Trading Pairs (${selectedTradingPairs.length})`}>
        <div style={{ display: 'grid', gap: '8px' }}>
          {selectedTradingPairs.map((pairData, index) => {
            const isActive = activeTradingPair === pairData.pair;
            const hasMarketActivity = availableMarkets.includes(pairData.pair);
            
            return (
              <div
                key={`${pairData.pair}-${index}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 120px 100px 80px',
                  padding: '12px',
                  background: isActive 
                    ? 'linear-gradient(135deg, rgba(0, 212, 250, 0.25) 0%, rgba(59, 130, 246, 0.2) 100%)' 
                    : 'linear-gradient(135deg, rgba(31, 41, 55, 0.9) 0%, rgba(15, 23, 42, 0.8) 100%)',
                  borderRadius: '8px',
                  border: isActive 
                    ? '2px solid rgba(0, 212, 250, 0.7)'
                    : '1px solid rgba(75, 85, 99, 0.3)',
                  gap: '12px',
                  alignItems: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Pair info */}
                <div>
                  <div style={{
                    fontWeight: '700',
                    color: isActive ? '#00D4FA' : '#f1f5f9',
                    fontSize: '14px',
                    marginBottom: '4px'
                  }}>
                    {isActive ? '⚡' : '🔗'} {pairData.pair}
                  </div>
                  <div style={{
                    color: '#cbd5e1',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    Added: {new Date(pairData.addedAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Market status */}
                <div>
                  {hasMarketActivity ? (
                    <span style={{
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#10b981',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}>
                      🟢 Active
                    </span>
                  ) : (
                    <span style={{
                      background: 'rgba(107, 114, 128, 0.2)',
                      color: '#6b7280',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}>
                      ⚪ Inactive
                    </span>
                  )}
                </div>

                {/* Trade button */}
                <div>
                  <ActionButton
                    variant="secondary"
                    onClick={() => activateTradingPair(pairData.pair)}
                    disabled={isActive}
                    style={{
                      minWidth: '80px',
                      fontSize: '11px',
                      padding: '6px 8px',
                      background: isActive
                        ? 'rgba(107, 114, 128, 0.3)'
                        : 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                      color: isActive ? '#6b7280' : '#ffffff',
                      border: 'none'
                    }}
                  >
                    {isActive ? '✅ Active' : '⚡ Trade'}
                  </ActionButton>
                </div>

                {/* Remove button */}
                <div>
                  <ActionButton
                    variant="danger"
                    onClick={() => removeTradingPair(pairData.pair)}
                    style={{
                      minWidth: '60px',
                      fontSize: '11px',
                      padding: '6px 8px',
                      background: 'rgba(239, 68, 68, 0.2)',
                      color: '#ef4444',
                      border: '1px solid rgba(239, 68, 68, 0.3)'
                    }}
                  >
                    🗑️
                  </ActionButton>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Quick actions */}
        <div style={{
          marginTop: '16px',
          padding: '12px',
          background: 'rgba(31, 41, 55, 0.5)',
          borderRadius: '6px',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap'
        }}>
          <div style={{ color: '#cbd5e1', fontSize: '12px', fontWeight: '500' }}>
            💡 Select trading pairs above, then switch to P2P Marketplace to start trading
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <ActionButton
              variant="secondary"
              onClick={() => dispatch(setActiveTab('marketplace'))}
              disabled={selectedTradingPairs.length === 0}
              style={{
                fontSize: '12px',
                padding: '8px 12px',
                background: selectedTradingPairs.length > 0
                  ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
                  : 'rgba(107, 114, 128, 0.3)',
                color: selectedTradingPairs.length > 0 ? '#ffffff' : '#6b7280',
                border: 'none'
              }}
            >
              📈 Go to Marketplace
            </ActionButton>
            
            <ActionButton
              variant="secondary"
              onClick={() => setSelectedTradingPairs([])}
              disabled={selectedTradingPairs.length === 0}
              style={{
                fontSize: '12px',
                padding: '8px 12px',
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}
            >
              🗑️ Clear All
            </ActionButton>
          </div>
        </div>
      </FieldSet>
    );
  };

  // Render cross-token pair creator section
  const renderCrossTokenPairCreator = () => {
    return (
      <FieldSet legend={`⚡ Cross-Token Pair Creator (${selectedTokensForPairs.length} tokens selected)`}>
        {selectedTokensForPairs.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '30px 20px',
            background: 'rgba(31, 41, 55, 0.5)',
            borderRadius: '8px',
            border: '2px dashed rgba(75, 85, 99, 0.3)'
          }}>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>⚡</div>
            <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>
              No Tokens Selected for Cross-Token Pairs
            </div>
            <div style={{ color: '#8892b0', fontSize: '12px' }}>
              Select tokens from the browser above using checkboxes to create cross-token trading pairs
            </div>
          </div>
        ) : (
          <div>
            {/* Selected tokens display */}
            <div style={{
              marginBottom: '20px',
              padding: '16px',
              background: 'rgba(139, 92, 246, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(139, 92, 246, 0.3)'
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#8b5cf6',
                marginBottom: '12px'
              }}>
                Selected Tokens for Cross-Token Pairs:
              </div>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {selectedTokensForPairs.map((token, index) => (
                  <div
                    key={`selected-${token.ticker}-${index}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                      borderRadius: '20px',
                      color: '#ffffff',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}
                  >
                    💎 {token.ticker}
                    <button
                      onClick={() => toggleTokenSelection(token)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        color: '#ffffff',
                        cursor: 'pointer',
                        fontSize: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Pair preview */}
            {selectedTokensForPairs.length >= 2 && (
              <div style={{
                marginBottom: '20px',
                padding: '16px',
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#10b981',
                  marginBottom: '12px'
                }}>
                  Pairs to be Created ({(selectedTokensForPairs.length * (selectedTokensForPairs.length - 1))} total):
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                  gap: '8px',
                  maxHeight: '120px',
                  overflowY: 'auto'
                }}>
                  {selectedTokensForPairs.map((token1, i) => 
                    selectedTokensForPairs.map((token2, j) => {
                      if (i !== j) {
                        const pairName = `${token1.ticker}/${token2.ticker}`;
                        const exists = selectedTradingPairs.find(p => p.pair === pairName);
                        return (
                          <div
                            key={`preview-${pairName}`}
                            style={{
                              padding: '6px 10px',
                              background: exists 
                                ? 'rgba(107, 114, 128, 0.2)'
                                : 'rgba(16, 185, 129, 0.2)',
                              borderRadius: '12px',
                              fontSize: '11px',
                              fontWeight: '600',
                              color: exists ? '#6b7280' : '#10b981',
                              textAlign: 'center'
                            }}
                          >
                            {exists ? '✓' : '+'} {pairName}
                          </div>
                        );
                      }
                      return null;
                    })
                  ).flat().filter(Boolean)}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <div style={{ color: '#8892b0', fontSize: '12px' }}>
                💡 Cross-token pairs allow direct trading between any two tokens without NXS
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <ActionButton
                  variant="secondary"
                  onClick={clearTokenSelection}
                  style={{
                    fontSize: '12px',
                    padding: '8px 12px',
                    background: 'rgba(239, 68, 68, 0.2)',
                    color: '#ef4444',
                    border: '1px solid rgba(239, 68, 68, 0.3)'
                  }}
                >
                  🗑️ Clear Selection
                </ActionButton>
                
                <ActionButton
                  variant="secondary"
                  onClick={createCrossTokenPairs}
                  disabled={selectedTokensForPairs.length < 2}
                  style={{
                    fontSize: '12px',
                    padding: '8px 16px',
                    background: selectedTokensForPairs.length >= 2
                      ? 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)'
                      : 'rgba(107, 114, 128, 0.3)',
                    color: selectedTokensForPairs.length >= 2 ? '#ffffff' : '#6b7280',
                    border: 'none'
                  }}
                >
                  ⚡ Create Cross-Token Pairs
                </ActionButton>
              </div>
            </div>
          </div>
        )}
      </FieldSet>
    );
  };

  // Render comprehensive token listing with pagination
  const renderComprehensiveTokenListing = () => {
    const startIndex = tokenPage * tokensPerPage;
    const endIndex = startIndex + tokensPerPage;
    const displayedTokens = filteredTokens.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredTokens.length / tokensPerPage);

    return (
      <FieldSet legend={`📋 Comprehensive Token Listing (${filteredTokens.length} tokens found)`}>
        {/* Search and Filter Controls */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
          marginBottom: '20px'
        }}>
          <StyledTextField
            variant="tokens"
            placeholder="Search by ticker, name, or address..."
            value={tokenFilter}
            onChange={(e) => setTokenFilter(e.target.value)}
          />
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <select
              value={tokenSortBy}
              onChange={(e) => setTokenSortBy(e.target.value)}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(0, 212, 250, 0.4)',
                background: 'linear-gradient(135deg, #1f2937 0%, #0f172a 100%)',
                color: '#00D4FA',
                fontSize: '14px',
                boxShadow: '0 2px 8px rgba(0, 212, 250, 0.1)'
              }}
            >
                <option style={{ background: '#1f2937', color: '#00D4FA' }} value="relevance">Sort by Relevance</option>
                <option style={{ background: '#1f2937', color: '#00D4FA' }} value="ticker">Sort by Ticker</option>
                <option style={{ background: '#1f2937', color: '#00D4FA' }} value="supply">Sort by Supply</option>
                <option style={{ background: '#1f2937', color: '#00D4FA' }} value="marketActivity">Sort by Market Activity</option>
                <option style={{ background: '#1f2937', color: '#00D4FA' }} value="lastPrice">Sort by Last Price</option>
                <option style={{ background: '#1f2937', color: '#00D4FA' }} value="modified">Sort by Last Modified</option>
            </select>
            
            <button
              onClick={() => setTokenSortOrder(tokenSortOrder === 'asc' ? 'desc' : 'asc')}
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(0, 212, 250, 0.4)',
                background: 'linear-gradient(135deg, #00D4FA 0%, #0891b2 100%)',
                color: '#ffffff',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 2px 8px rgba(0, 212, 250, 0.2)'
              }}
            >
              {tokenSortOrder === 'asc' ? '⬆️ ASC' : '⬇️ DESC'}
            </button>
          </div>
          
          <ActionButton
            variant="secondary"
            onClick={loadAllTokens}
            disabled={tokenSearchLoading}
            style={{
              fontSize: '12px',
              padding: '12px 16px',
              background: tokenSearchLoading
                ? 'rgba(107, 114, 128, 0.3)'
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: tokenSearchLoading ? '#6b7280' : '#ffffff',
              border: 'none'
            }}
          >
            {tokenSearchLoading ? '🔄 Loading...' : '🔄 Refresh Tokens'}
          </ActionButton>
        </div>

        {/* Token Statistics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          marginBottom: '20px',
          padding: '16px',
          background: 'rgba(139, 92, 246, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(139, 92, 246, 0.2)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#8b5cf6' }}>
              {allTokens.length}
            </div>
            <div style={{ fontSize: '12px', color: '#a855f7' }}>Total Tokens</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>
              {selectedTradingPairs.length}
            </div>
            <div style={{ fontSize: '12px', color: '#059669' }}>Active Pairs</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b' }}>
              {crossTokenPairs.length}
            </div>
            <div style={{ fontSize: '12px', color: '#d97706' }}>Cross-Token Pairs</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#ef4444' }}>
              {filteredTokens.length}
            </div>
            <div style={{ fontSize: '12px', color: '#fbbf24', fontWeight: '600' }}>Filtered Results</div>
          </div>
        </div>

        {/* Token Grid */}
        {displayedTokens.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px',
            marginBottom: '20px'
          }}>
            {displayedTokens.map((token, index) => {
              const isSelected = selectedTokensForPairs.some(t => t.ticker === token.ticker);
              const hasActivePair = selectedTradingPairs.some(p => 
                p.pair.includes(token.ticker)
              );
              
              return (
                <div
                  key={`comprehensive-${token.ticker}-${index}`}
                  style={{
                    padding: '16px',
                    background: isSelected
                      ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)'
                      : 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
                    borderRadius: '12px',
                    border: isSelected
                      ? '2px solid rgba(139, 92, 246, 0.5)'
                      : '1px solid rgba(75, 85, 99, 0.3)',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onClick={() => toggleTokenSelection(token)}
                >
                  {/* Selection indicator */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: isSelected
                      ? 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)'
                      : 'rgba(107, 114, 128, 0.3)',
                    border: isSelected ? 'none' : '2px solid rgba(107, 114, 128, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    color: '#ffffff'
                  }}>
                    {isSelected ? '✓' : ''}
                  </div>

                  {/* Token header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#ffffff'
                    }}>
                      💎
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#8b5cf6',
                        marginBottom: '2px'
                      }}>
                        {token.ticker}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#6b7280'
                      }}>
                        {token.name || 'Token Name'}
                      </div>
                    </div>
                  </div>

                  {/* Token details */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px',
                    marginBottom: '12px'
                  }}>
                    <div>
                      <div style={{ fontSize: '10px', color: '#8892b0', marginBottom: '2px' }}>
                        Current Supply
                      </div>
                      <div style={{ fontSize: '12px', color: '#ffffff', fontWeight: '600' }}>
                        {token.currentsupply ? Number(token.currentsupply).toLocaleString() : 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: '#8892b0', marginBottom: '2px' }}>
                        Max Supply
                      </div>
                      <div style={{ fontSize: '12px', color: '#ffffff', fontWeight: '600' }}>
                        {token.maxsupply ? Number(token.maxsupply).toLocaleString() : 'Unlimited'}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: '#8892b0', marginBottom: '2px' }}>
                        Decimals
                      </div>
                      <div style={{ fontSize: '12px', color: '#ffffff', fontWeight: '600' }}>
                        {token.decimals || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: '#8892b0', marginBottom: '2px' }}>
                        Address
                      </div>
                      <div style={{ 
                        fontSize: '10px', 
                        color: '#8b5cf6', 
                        fontWeight: '500',
                        wordBreak: 'break-all',
                        fontFamily: 'monospace'
                      }}>
                        {token.address ? `${token.address.substring(0, 8)}...${token.address.substring(token.address.length - 8)}` : 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* Status indicators */}
                  <div style={{
                    display: 'flex',
                    gap: '6px',
                    flexWrap: 'wrap'
                  }}>
                    {hasActivePair && (
                      <div style={{
                        padding: '4px 8px',
                        background: 'rgba(16, 185, 129, 0.2)',
                        borderRadius: '12px',
                        fontSize: '10px',
                        color: '#10b981',
                        fontWeight: '600'
                      }}>
                        ✓ Active Pair
                      </div>
                    )}
                    {token.marketActivity && (
                      <div style={{
                        padding: '4px 8px',
                        background: 'rgba(245, 158, 11, 0.2)',
                        borderRadius: '12px',
                        fontSize: '10px',
                        color: '#f59e0b',
                        fontWeight: '600'
                      }}>
                        📈 Active
                      </div>
                    )}
                    {isSelected && (
                      <div style={{
                        padding: '4px 8px',
                        background: 'rgba(139, 92, 246, 0.2)',
                        borderRadius: '12px',
                        fontSize: '10px',
                        color: '#8b5cf6',
                        fontWeight: '600'
                      }}>
                        ⚡ Selected
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            background: 'rgba(31, 41, 55, 0.5)',
            borderRadius: '8px',
            border: '2px dashed rgba(75, 85, 99, 0.3)'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>🔍</div>
            <div style={{ color: '#6b7280', fontSize: '16px', marginBottom: '8px' }}>
              {tokenSearchLoading ? 'Discovering tokens...' : 'No tokens found'}
            </div>
            <div style={{ color: '#8892b0', fontSize: '14px', marginBottom: '16px' }}>
              {tokenSearchLoading
                ? 'Please wait while we search the Finance API for available tokens'
                : tokenFilter
                ? 'Try adjusting your search criteria or filters'
                : 'Click "Refresh Tokens" to discover available tokens from the Finance API'
              }
            </div>
            {!tokenSearchLoading && (
              <ActionButton
                variant="secondary"
                onClick={loadAllTokens}
                style={{
                  fontSize: '14px',
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                  color: '#ffffff',
                  border: 'none'
                }}
              >
                🔄 Discover Tokens
              </ActionButton>
            )}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '12px',
            marginTop: '20px',
            padding: '16px',
            background: 'rgba(31, 41, 55, 0.5)',
            borderRadius: '8px'
          }}>
            <button
              onClick={() => setTokenPage(0)}
              disabled={tokenPage === 0}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: 'none',
                background: tokenPage === 0
                  ? 'rgba(107, 114, 128, 0.3)'
                  : 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                color: tokenPage === 0 ? '#6b7280' : '#ffffff',
                cursor: tokenPage === 0 ? 'not-allowed' : 'pointer',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              ⏮️ First
            </button>
            
            <button
              onClick={() => setTokenPage(Math.max(0, tokenPage - 1))}
              disabled={tokenPage === 0}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: 'none',
                background: tokenPage === 0
                  ? 'rgba(107, 114, 128, 0.3)'
                  : 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                color: tokenPage === 0 ? '#6b7280' : '#ffffff',
                cursor: tokenPage === 0 ? 'not-allowed' : 'pointer',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              ⬅️ Previous
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#8892b0',
              fontSize: '14px'
            }}>
              Page
              <input
                type="number"
                min="1"
                max={totalPages}
                value={tokenPage + 1}
                onChange={(e) => {
                  const page = Math.max(1, Math.min(totalPages, parseInt(e.target.value) || 1)) - 1;
                  setTokenPage(page);
                }}
                style={{
                  width: '60px',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  background: 'rgba(31, 41, 55, 0.8)',
                  color: '#8b5cf6',
                  textAlign: 'center',
                  fontSize: '12px'
                }}
              />
              of {totalPages}
            </div>

            <button
              onClick={() => setTokenPage(Math.min(totalPages - 1, tokenPage + 1))}
              disabled={tokenPage >= totalPages - 1}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: 'none',
                background: tokenPage >= totalPages - 1
                  ? 'rgba(107, 114, 128, 0.3)'
                  : 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                color: tokenPage >= totalPages - 1 ? '#6b7280' : '#ffffff',
                cursor: tokenPage >= totalPages - 1 ? 'not-allowed' : 'pointer',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              Next ➡️
            </button>
            
            <button
              onClick={() => setTokenPage(totalPages - 1)}
              disabled={tokenPage >= totalPages - 1}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: 'none',
                background: tokenPage >= totalPages - 1
                  ? 'rgba(107, 114, 128, 0.3)'
                  : 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                color: tokenPage >= totalPages - 1 ? '#6b7280' : '#ffffff',
                cursor: tokenPage >= totalPages - 1 ? 'not-allowed' : 'pointer',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              Last ⏭️
            </button>
          </div>
        )}

        {/* Quick Actions */}
        <div style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'center',
          marginTop: '16px',
          flexWrap: 'wrap'
        }}>
          <ActionButton
            variant="secondary"
            onClick={() => {
              setTokenFilter('');
              setTokenSortBy('ticker');
              setTokenSortOrder('asc');
              setTokenPage(0);
            }}
            style={{
              fontSize: '12px',
              padding: '8px 12px',
              background: 'rgba(107, 114, 128, 0.2)',
              color: '#6b7280',
              border: '1px solid rgba(107, 114, 128, 0.3)'
            }}
          >
            🔄 Reset Filters
          </ActionButton>
          
          <ActionButton
            variant="secondary"
            onClick={() => {
              setTokenSortBy('marketActivity');
              setTokenSortOrder('desc');
              setTokenPage(0);
            }}
            style={{
              fontSize: '12px',
              padding: '8px 12px',
              background: 'rgba(245, 158, 11, 0.2)',
              color: '#f59e0b',
              border: '1px solid rgba(245, 158, 11, 0.3)'
            }}
          >
            📈 Most Active
          </ActionButton>
          
          <ActionButton
            variant="secondary"
            onClick={() => {
              setTokenSortBy('modified');
              setTokenSortOrder('desc');
              setTokenPage(0);
            }}
            style={{
              fontSize: '12px',
              padding: '8px 12px',
              background: 'rgba(16, 185, 129, 0.2)',
              color: '#10b981',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}
          >
            🆕 Newest Tokens
          </ActionButton>
        </div>
      </FieldSet>
    );
  };

  const renderTokenBrowser = () => {
    const startIndex = tokenPage * tokensPerPage;
    const endIndex = startIndex + tokensPerPage;
    const displayedTokens = filteredTokens.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredTokens.length / tokensPerPage);

    return (
      <div>
        <Card>
          <h2 style={{ color: '#8b5cf6', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            🔍 Token Browser - Comprehensive Token Discovery
            <ActionButton 
              variant="secondary" 
              onClick={loadAllTokens} 
              disabled={tokenSearchLoading}
              style={{ fontSize: '12px', padding: '8px 16px', minWidth: 'auto' }}
            >
              {tokenSearchLoading ? '🔄 Discovering...' : '🔄 Refresh'}
            </ActionButton>
          </h2>

          <p style={{ color: '#8892b0', marginBottom: '24px' }}>
            Discover and browse all tokens in the Nexus ecosystem. This includes tokens created by all users, 
            active trading pairs, and comprehensive token information from both Finance and Market APIs.
          </p>

          {/* Search and Filter Controls */}
          <FieldSet legend="🔍 Search & Filter Tokens">
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '16px', 
              marginBottom: '16px' 
            }}>
              <StyledTextField
                variant="tokens"
                placeholder="Search by ticker, name, or address..."
                value={tokenFilter}
                onChange={(e) => setTokenFilter(e.target.value)}
              />
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  value={tokenSortBy}
                  onChange={(e) => setTokenSortBy(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 212, 250, 0.4)',
                    background: 'linear-gradient(135deg, #1f2937 0%, #0f172a 100%)',
                    color: '#00D4FA',
                    fontSize: '14px',
                    boxShadow: '0 2px 8px rgba(0, 212, 250, 0.1)'
                  }}
                >
                  <option style={{ background: '#1f2937', color: '#00D4FA' }} value="relevance">Sort by Relevance</option>
                  <option style={{ background: '#1f2937', color: '#00D4FA' }} value="ticker">Sort by Ticker</option>
                  <option style={{ background: '#1f2937', color: '#00D4FA' }} value="supply">Sort by Supply</option>
                  <option style={{ background: '#1f2937', color: '#00D4FA' }} value="marketActivity">Sort by Market Activity</option>
                  <option style={{ background: '#1f2937', color: '#00D4FA' }} value="lastPrice">Sort by Last Price</option>
                  <option style={{ background: '#1f2937', color: '#00D4FA' }} value="modified">Sort by Last Modified</option>
                </select>
                
                <button
                  onClick={() => setTokenSortOrder(tokenSortOrder === 'asc' ? 'desc' : 'asc')}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 212, 250, 0.4)',
                    background: 'linear-gradient(135deg, #00D4FA 0%, #0891b2 100%)',
                    color: '#ffffff',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    boxShadow: '0 2px 8px rgba(0, 212, 250, 0.2)'
                  }}
                >
                  {tokenSortOrder === 'asc' ? '⬆️ ASC' : '⬇️ DESC'}
                </button>
              </div>
            </div>

            {/* Statistics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '12px',
              padding: '16px',
              background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
              borderRadius: '12px',
              border: '1px solid #4b5563'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Total Tokens</div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#8b5cf6' }}>
                  {allTokens.length}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Active Markets</div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#00d4aa' }}>
                  {allTokens.filter(t => t.marketActivity?.hasMarket).length}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: '600' }}>Filtered Results</div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#f59e0b' }}>
                  {filteredTokens.length}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Current Page</div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#06b6d4' }}>
                  {totalPages > 0 ? tokenPage + 1 : 0} / {totalPages}
                </div>
              </div>
            </div>
          </FieldSet>

          {/* Token Grid Display */}
          <FieldSet legend="🪙 Available Tokens">
            {tokenSearchLoading ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 20px',
                background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                <div style={{ color: '#8b5cf6', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                  Discovering Tokens...
                </div>
                <div style={{ color: '#8892b0', fontSize: '14px' }}>
                  Analyzing Market API, Finance API, and transaction data for comprehensive token discovery
                </div>
              </div>
            ) : displayedTokens.length > 0 ? (
              <>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
                  gap: '16px',
                  marginBottom: '24px'
                }}>
                  {displayedTokens.map((token, index) => (
                    <div
                      key={token.address || index}
                      style={{
                        background: token.marketActivity?.hasMarket 
                          ? 'linear-gradient(135deg, rgba(0, 212, 170, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)'
                          : 'linear-gradient(135deg, rgba(45, 55, 72, 0.8) 0%, rgba(74, 85, 104, 0.6) 100%)',
                        border: token.marketActivity?.hasMarket 
                          ? '1px solid rgba(0, 212, 170, 0.3)'
                          : '1px solid rgba(139, 92, 246, 0.2)',
                        borderRadius: '12px',
                        padding: '20px',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        position: 'relative'
                      }}
                      onClick={() => selectTokenForTrading(token)}
                    >
                      {/* Token Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                          <div style={{ 
                            fontSize: '20px', 
                            fontWeight: '700', 
                            color: token.marketActivity?.hasMarket ? '#00d4aa' : '#8b5cf6',
                            marginBottom: '4px'
                          }}>
                            🪙 {token.ticker || 'Unknown'}
                          </div>
                          <div style={{ fontSize: '13px', color: '#8892b0' }}>
                            {token.ticker || 'No ticker available'}
                          </div>
                        </div>
                        
                        {/* Status Badges */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
                          {token.marketActivity?.hasMarket && (
                            <div style={{
                              background: 'rgba(0, 212, 170, 0.2)',
                              color: '#00d4aa',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '10px',
                              fontWeight: '600',
                              border: '1px solid rgba(0, 212, 170, 0.4)'
                            }}>
                              🌟 ACTIVE MARKET
                            </div>
                          )}
                          <div style={{
                            background: 'rgba(139, 92, 246, 0.2)',
                            color: '#8b5cf6',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '10px',
                            fontWeight: '600',
                            border: '1px solid rgba(139, 92, 246, 0.4)'
                          }}>
                            {token.source?.replace(/_/g, ' ').toUpperCase() || 'UNKNOWN'}
                          </div>
                        </div>
                      </div>

                      {/* Token Stats Grid */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '12px',
                        marginBottom: '16px',
                        fontSize: '13px'
                      }}>
                        <div>
                          <div style={{ color: '#9ca3af', marginBottom: '2px' }}>Current Supply</div>
                          <div style={{ color: '#e2e8f0', fontWeight: '500' }}>
                            {token.currentSupply?.toLocaleString() || '0'}
                          </div>
                        </div>
                        <div>
                          <div style={{ color: '#9ca3af', marginBottom: '2px' }}>Max Supply</div>
                          <div style={{ color: '#e2e8f0', fontWeight: '500' }}>
                            {token.totalSupply?.toLocaleString() || '0'}
                          </div>
                        </div>
                        <div>
                          <div style={{ color: '#9ca3af', marginBottom: '2px' }}>Decimals</div>
                          <div style={{ color: '#e2e8f0', fontWeight: '500' }}>
                            {token.decimals || 0}
                          </div>
                        </div>
                        <div>
                          <div style={{ color: '#9ca3af', marginBottom: '2px' }}>Supply %</div>
                          <div style={{ color: '#e2e8f0', fontWeight: '500' }}>
                            {token.totalSupply > 0 
                              ? `${((token.currentSupply / token.totalSupply) * 100).toFixed(1)}%`
                              : '0%'
                            }
                          </div>
                        </div>
                      </div>

                      {/* Market Activity */}
                      {token.marketActivity?.hasMarket && (
                        <div style={{
                          background: 'rgba(0, 212, 170, 0.1)',
                          border: '1px solid rgba(0, 212, 170, 0.3)',
                          borderRadius: '8px',
                          padding: '12px',
                          marginBottom: '12px'
                        }}>
                          <div style={{ color: '#00d4aa', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>
                            📊 Market Activity
                          </div>
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1fr',
                            gap: '8px',
                            fontSize: '11px'
                          }}>
                            <div>
                              <div style={{ color: '#9ca3af' }}>Buy Orders</div>
                              <div style={{ color: '#4ade80', fontWeight: '500' }}>
                                {token.marketActivity.activeBids}
                              </div>
                            </div>
                            <div>
                              <div style={{ color: '#9ca3af' }}>Sell Orders</div>
                              <div style={{ color: '#f87171', fontWeight: '500' }}>
                                {token.marketActivity.activeAsks}
                              </div>
                            </div>
                            <div>
                              <div style={{ color: '#9ca3af' }}>Last Price</div>
                              <div style={{ color: '#fbbf24', fontWeight: '500' }}>
                                {token.marketActivity.lastPrice > 0 
                                  ? `${token.marketActivity.lastPrice.toFixed(6)} NXS`
                                  : 'N/A'
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Token Address */}
                      <div style={{
                        background: 'rgba(26, 32, 44, 0.8)',
                        border: '1px solid rgba(74, 85, 104, 0.3)',
                        borderRadius: '6px',
                        padding: '8px',
                        marginBottom: '12px'
                      }}>
                        <div style={{ color: '#9ca3af', fontSize: '10px', marginBottom: '2px' }}>Token Address</div>
                        <div style={{ 
                          color: '#cbd5e0', 
                          fontSize: '11px', 
                          fontFamily: 'monospace',
                          wordBreak: 'break-all'
                        }}>
                          {token.address || 'Address not available'}
                        </div>
                      </div>

                      {/* Action Button */}
                      <ActionButton
                        onClick={(e) => {
                          e.stopPropagation();
                          selectTokenForTrading(token);
                        }}
                        style={{
                          width: '100%',
                          background: token.marketActivity?.hasMarket
                            ? 'linear-gradient(135deg, #00d4aa 0%, #8b5cf6 100%)'
                            : 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                          fontSize: '14px',
                          fontWeight: '600',
                          padding: '12px'
                        }}
                      >
                        {token.marketActivity?.hasMarket 
                          ? `🚀 Trade ${token.ticker}/NXS` 
                          : `🌱 Start Trading ${token.ticker}/NXS`
                        }
                      </ActionButton>

                      {/* Last Modified */}
                      {token.lastModified && (
                        <div style={{ 
                          fontSize: '10px', 
                          color: '#6b7280', 
                          textAlign: 'center', 
                          marginTop: '8px' 
                        }}>
                          Modified: {token.lastModified.toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Enhanced Pagination */}
                {totalPages > 1 && (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    padding: '20px',
                    background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
                    borderRadius: '12px',
                    border: '1px solid #4b5563'
                  }}>
                    {/* Pagination Controls */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}>
                      {/* Items per page selector */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#8892b0', fontSize: '14px' }}>Show:</span>
                        <select
                          value={tokensPerPage}
                          onChange={(e) => {
                            setTokensPerPage(parseInt(e.target.value));
                            setTokenPage(0); // Reset to first page
                          }}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1px solid rgba(0, 212, 250, 0.4)',
                            background: 'linear-gradient(135deg, #1f2937 0%, #0f172a 100%)',
                            color: '#00D4FA',
                            fontSize: '12px',
                            boxShadow: '0 2px 8px rgba(0, 212, 250, 0.1)'
                          }}
                        >
                          <option style={{ background: '#1f2937', color: '#00D4FA' }} value={6}>6 per page</option>
                          <option style={{ background: '#1f2937', color: '#00D4FA' }} value={12}>12 per page</option>
                          <option style={{ background: '#1f2937', color: '#00D4FA' }} value={24}>24 per page</option>
                          <option style={{ background: '#1f2937', color: '#00D4FA' }} value={48}>48 per page</option>
                          <option style={{ background: '#1f2937', color: '#00D4FA' }} value={100}>100 per page</option>
                        </select>
                      </div>

                      {/* Page info */}
                      <div style={{ color: '#8892b0', fontSize: '14px', textAlign: 'center' }}>
                        Showing {startIndex + 1}-{Math.min(endIndex, filteredTokens.length)} of {filteredTokens.length} tokens
                      </div>

                      {/* Jump to page */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#8892b0', fontSize: '14px' }}>Page:</span>
                        <input
                          type="number"
                          min="1"
                          max={totalPages}
                          value={tokenPage + 1}
                          onChange={(e) => {
                            const page = parseInt(e.target.value) - 1;
                            if (page >= 0 && page < totalPages) {
                              setTokenPage(page);
                            }
                          }}
                          style={{
                            width: '60px',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: '1px solid rgba(139, 92, 246, 0.3)',
                            background: '#1a202c',
                            color: '#8b5cf6',
                            fontSize: '12px',
                            textAlign: 'center'
                          }}
                        />
                        <span style={{ color: '#6b7280', fontSize: '12px' }}>of {totalPages}</span>
                      </div>
                    </div>

                    {/* Navigation buttons */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '8px',
                      flexWrap: 'wrap'
                    }}>
                      {/* First page */}
                      <ActionButton
                        variant="secondary"
                        onClick={() => setTokenPage(0)}
                        disabled={tokenPage === 0}
                        style={{ minWidth: '80px', fontSize: '12px', padding: '8px 12px' }}
                      >
                        ⏮️ First
                      </ActionButton>

                      {/* Previous page */}
                      <ActionButton
                        variant="secondary"
                        onClick={() => setTokenPage(Math.max(0, tokenPage - 1))}
                        disabled={tokenPage === 0}
                        style={{ minWidth: '80px', fontSize: '12px', padding: '8px 12px' }}
                      >
                        ← Prev
                      </ActionButton>
                      
                      {/* Page numbers */}
                      <div style={{ 
                        display: 'flex', 
                        gap: '4px',
                        alignItems: 'center'
                      }}>
                        {(() => {
                          const visiblePages = 7; // Show 7 page numbers
                          const halfVisible = Math.floor(visiblePages / 2);
                          let startPage = Math.max(0, tokenPage - halfVisible);
                          let endPage = Math.min(totalPages - 1, startPage + visiblePages - 1);
                          
                          // Adjust start if we're near the end
                          if (endPage - startPage < visiblePages - 1) {
                            startPage = Math.max(0, endPage - visiblePages + 1);
                          }

                          const pages = [];
                          
                          // Show first page if not in range
                          if (startPage > 0) {
                            pages.push(
                              <button
                                key={0}
                                onClick={() => setTokenPage(0)}
                                style={{
                                  background: 'transparent',
                                  border: '1px solid rgba(139, 92, 246, 0.3)',
                                  color: '#8b5cf6',
                                  padding: '6px 10px',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  fontWeight: '500'
                                }}
                              >
                                1
                              </button>
                            );
                            if (startPage > 1) {
                              pages.push(<span key="ellipsis1" style={{ color: '#6b7280', fontSize: '12px' }}>...</span>);
                            }
                          }

                          // Show page range
                          for (let i = startPage; i <= endPage; i++) {
                            pages.push(
                              <button
                                key={i}
                                onClick={() => setTokenPage(i)}
                                style={{
                                  background: i === tokenPage 
                                    ? 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)'
                                    : 'transparent',
                                  border: '1px solid rgba(139, 92, 246, 0.3)',
                                  color: i === tokenPage ? '#ffffff' : '#8b5cf6',
                                  padding: '6px 10px',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  fontWeight: i === tokenPage ? '600' : '500'
                                }}
                              >
                                {i + 1}
                              </button>
                            );
                          }

                          // Show last page if not in range
                          if (endPage < totalPages - 1) {
                            if (endPage < totalPages - 2) {
                              pages.push(<span key="ellipsis2" style={{ color: '#6b7280', fontSize: '12px' }}>...</span>);
                            }
                            pages.push(
                              <button
                                key={totalPages - 1}
                                onClick={() => setTokenPage(totalPages - 1)}
                                style={{
                                  background: 'transparent',
                                  border: '1px solid rgba(139, 92, 246, 0.3)',
                                  color: '#8b5cf6',
                                  padding: '6px 10px',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  fontWeight: '500'
                                }}
                              >
                                {totalPages}
                              </button>
                            );
                          }

                          return pages;
                        })()}
                      </div>

                      {/* Next page */}
                      <ActionButton
                        variant="secondary"
                        onClick={() => setTokenPage(Math.min(totalPages - 1, tokenPage + 1))}
                        disabled={tokenPage >= totalPages - 1}
                        style={{ minWidth: '80px', fontSize: '12px', padding: '8px 12px' }}
                      >
                        Next →
                      </ActionButton>

                      {/* Last page */}
                      <ActionButton
                        variant="secondary"
                        onClick={() => setTokenPage(totalPages - 1)}
                        disabled={tokenPage >= totalPages - 1}
                        style={{ minWidth: '80px', fontSize: '12px', padding: '8px 12px' }}
                      >
                        Last ⏭️
                      </ActionButton>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 20px',
                background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                <div style={{ color: '#6b7280', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                  {allTokens.length === 0 ? 'No Tokens Discovered' : 'No Tokens Match Your Filter'}
                </div>
                <div style={{ color: '#8892b0', fontSize: '14px', marginBottom: '16px' }}>
                  {allTokens.length === 0 
                    ? 'Click "Refresh" to discover tokens from Market API and Finance API'
                    : 'Try adjusting your search criteria or sorting options'
                  }
                </div>
                {allTokens.length === 0 && (
                  <ActionButton onClick={loadAllTokens} disabled={tokenSearchLoading}>
                    🔍 Discover Tokens
                  </ActionButton>
                )}
              </div>
            )}
          </FieldSet>

          {/* Quick Actions */}
          <FieldSet legend="⚡ Quick Actions">
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <ActionButton
                variant="secondary"
                onClick={() => {
                  setTokenFilter('');
                  setTokenSortBy('ticker');
                  setTokenSortOrder('asc');
                  setTokenPage(0);
                }}
              >
                🔄 Reset Filters
              </ActionButton>
              
              <ActionButton
                variant="secondary"
                onClick={() => {
                  setTokenSortBy('marketActivity');
                  setTokenSortOrder('desc');
                }}
              >
                📊 Show Most Active
              </ActionButton>
              
              <ActionButton
                variant="secondary"
                onClick={() => {
                  setTokenFilter('');
                  setTokenSortBy('modified');
                  setTokenSortOrder('desc');
                }}
              >
                🆕 Show Newest
              </ActionButton>
            </div>
          </FieldSet>
        </Card>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'profile':
        return renderProfileManagement();
      case 'session':
        return renderSessionControl();
      case 'marketplace':
        return renderMarketplace();
      case 'tokenbrowser':
        return (
          <div>
            {renderSimplifiedTokenListing()}
            <div style={{ marginTop: '30px' }}>
              {renderSelectedTradingPairs()}
            </div>
            <div style={{ marginTop: '30px' }}>
              {renderCrossTokenPairCreator()}
            </div>
            <div style={{ marginTop: '30px' }}>
              {renderComprehensiveTokenListing()}
            </div>
          </div>
        );
      case 'wallet':
        return renderWallet();
      default:
        return renderDashboard();
    }
  };

  return (
    <DarkContainer>
      <NavigationBar>
        {tabs.map((tab) => (
          <NavTab
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => dispatch(setActiveTab(tab.id))}
          >
            {tab.icon} {tab.label}
          </NavTab>
        ))}
      </NavigationBar>

      <ContentArea>
        {renderTabContent()}
      </ContentArea>
    </DarkContainer>
  );
}