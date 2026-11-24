import React, { useRef } from 'react';
import { Camera } from 'lucide-react';
import { resizeAvatarImage } from '../utils/imageUtils';

export default function HeroAvatar({ hero, avatar, borderColor, size = 46, editable = true, onChangeAvatar }) {
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.item(0);
    if (!file) return;
    try {
      const resized = await resizeAvatarImage(file, 120);
      onChangeAvatar(resized);
    } catch (err) {
      alert('Could not load image.');
    }
    e.target.value = '';
  };

  const initials = hero.name.slice(0, 2).toUpperCase();

  return (
    <div
      onClick={() => editable && fileInputRef.current?.click()}
      title={editable ? 'Tap to upload hero image' : hero.name}
      style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        borderRadius: '10px',
        border: `2px solid ${borderColor}`,
        backgroundColor: '#0f172a',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: editable ? 'pointer' : 'default',
        userSelect: 'none',
      }}
    >
      {avatar ? (
        <img
          src={avatar}
          alt={hero.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <span style={{ fontSize: `${Math.round(size * 0.34)}px`, fontWeight: 'bold', color: '#94a3b8' }}>
          {initials}
        </span>
      )}

      {editable && (
        <>
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              padding: '2px',
              borderTopLeftRadius: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Camera size={10} color="#facc15" />
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </>
      )}
    </div>
  );
}
