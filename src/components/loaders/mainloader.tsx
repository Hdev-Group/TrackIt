import React from 'react';
export const SpinnerLoader: React.FC<{ size?: number; color?: string }> = ({ size = 40, color = '#000000' }) => (
    <div className="spinner" style={{ width: size, height: size }}>
        <style jsx>{`
            .spinner {
                border: 4px solid rgba(0, 0, 0, 0.1);
                border-left-color: ${color};
                border-radius: 50%;
                border-width: 4px; /* Increased the border width */
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                to {
                    transform: rotate(360deg);
                }
            }
        `}</style>
    </div>
);

export const DotsLoader: React.FC<{ color?: string }> = ({ color = '#000000' }) => (
  <div className="dots-loader">
    <style jsx>{`
      .dots-loader {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .dots-loader::before,
      .dots-loader::after {
        content: '';
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: ${color};
        margin: 0 5px;
        animation: dots 0.8s infinite alternate;
      }
      .dots-loader::after {
        animation-delay: 0.4s;
      }
      @keyframes dots {
        to {
          transform: translateY(-10px);
        }
      }
    `}</style>
  </div>
);

export const BarLoader: React.FC<{ width?: number; height?: number; color?: string }> = ({ 
  width = 100, 
  height = 4, 
  color = '#000000' 
}) => (
  <div className="bar-loader" style={{ width, height }}>
    <style jsx>{`
      .bar-loader {
        background-color: rgba(0, 0, 0, 0.1);
        overflow: hidden;
        position: relative;
      }
      .bar-loader::after {
        content: '';
        position: absolute;
        left: -50%;
        height: 100%;
        width: 50%;
        background-color: ${color};
        animation: bar 1s linear infinite;
      }
      @keyframes bar {
        to {
          left: 100%;
        }
      }
    `}</style>
  </div>
);

export const PulseLoader: React.FC<{ size?: number; color?: string }> = ({ size = 40, color = '#000000' }) => (
  <div className="pulse-loader" style={{ width: size, height: size }}>
    <style jsx>{`
      .pulse-loader {
        border-radius: 50%;
        background-color: ${color};
        animation: pulse 1s ease-in-out infinite;
      }
      @keyframes pulse {
        0% {
          transform: scale(0.8);
          opacity: 0.5;
        }
        100% {
          transform: scale(1.2);
          opacity: 0;
        }
      }
    `}</style>
  </div>
);

export const RippleLoader: React.FC<{ size?: number; color?: string }> = ({ size = 40, color = '#000000' }) => (
  <div className="ripple-loader" style={{ width: size, height: size }}>
    <style jsx>{`
      .ripple-loader {
        position: relative;
      }
      .ripple-loader::before,
      .ripple-loader::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 2px solid ${color};
        border-radius: 50%;
        animation: ripple 1.5s cubic-bezier(0, 0.2, 0.8, 1) infinite;
      }
      .ripple-loader::after {
        animation-delay: -0.5s;
      }
      @keyframes ripple {
        0% {
          transform: scale(0);
          opacity: 1;
        }
        100% {
          transform: scale(1);
          opacity: 0;
        }
      }
    `}</style>
  </div>
);
