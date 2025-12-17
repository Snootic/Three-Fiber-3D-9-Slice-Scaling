import React from 'react';
import { useStore } from './store';

export const Slider = () => {
  const activeObjectId = useStore((state) => state.activeObjectId);
  const objectScales = useStore((state) => state.objectScales);
  const setObjectScale = useStore((state) => state.setObjectScale);

  if (activeObjectId === null) return null;

  const scale = objectScales[activeObjectId] || 1;

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
          max="1"
          step="0.01"
          value={scale}
          onChange={(e) => setObjectScale(activeObjectId, parseFloat(e.target.value))}
        />
      </div>
    </div>
  );
};