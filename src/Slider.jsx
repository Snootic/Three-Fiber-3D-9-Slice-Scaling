import React from 'react';
import { useStore } from './store';

export const Slider = () => {
  const scale = useStore((state) => state.scale);
  const setScale = useStore((state) => state.setScale);
  const marginPercentage = useStore((state) => state.marginPercentage);
  const setMarginPercentage = useStore((state) => state.setMarginPercentage);

  return (
    <div style={{ position: 'absolute', top: '120px', left: '20px', zIndex: 1, background: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '5px' }}>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="scale" style={{ color: 'white', display: 'block', marginBottom: '5px' }}>
          Scale: {scale.toFixed(3)}
        </label>
        <input
          type="range"
          id="scale"
          name="scale"
          min="0.001"
          max="0.5"
          step="0.01"
          value={scale}
          onChange={(e) => setScale(parseFloat(e.target.value))}
        />
      </div>
      
      <div>
        <label htmlFor="margin" style={{ color: 'white', display: 'block', marginBottom: '5px' }}>
          Margin: {(marginPercentage * 100).toFixed(1)}%
        </label>
        <input
          type="range"
          id="margin"
          name="margin"
          min="0.01"
          max="0.5"
          step="0.01"
          value={marginPercentage}
          onChange={(e) => setMarginPercentage(parseFloat(e.target.value))}
        />
      </div>
    </div>
  );
};
