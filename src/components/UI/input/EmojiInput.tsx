import React, { useState, useRef } from 'react';

import styles from './EmojiInput.module.css';

const emojis = [
  '😀','😂','😎','🔥','💥','💀','💡','✅','💬', '🎮', // оригинальные 9
  '🎉','🎁','🍕','🍔','🍟','🍎','🍌','🍇','⚡','⭐', // новые 10
  '🌈','🌞','🌙','☀️','☁️','🌊','🌹','🌺','🐶','🐱'  // ещё 11
];

export const EmojiInput: React.FC<{
    value: string;
    onChange: (val: string) => void;
}> = ({ value, onChange }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [showPicker, setShowPicker] = useState(false);

    const insertEmoji = (emoji: string) => {
        if (!inputRef.current) return;
        const el = inputRef.current;
        const start = el.selectionStart || 0;
        const end = el.selectionEnd || 0;
        const newValue = value.slice(0, start) + emoji + value.slice(end);
        onChange(newValue);
        setShowPicker(false);
        setTimeout(() => {
            el.focus();
            el.setSelectionRange(start + emoji.length, start + emoji.length);
        }, 0);
    };

    return (
        <div className={styles.inputWrap}>
            <input
                ref={inputRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setShowPicker(false)}
            />
            <button
                type="button"
                onClick={() => setShowPicker(!showPicker)}
                className={styles.emojiBtn}
            >
                🙂
            </button>
            {showPicker && (
                <div className={styles.emojiPicker}>
                    {emojis.map((e) => (
                        <button
                        key={e}
                        type="button"
                        onClick={() => insertEmoji(e)}
                        className={styles.emojiItem}
                        >
                        {e}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};