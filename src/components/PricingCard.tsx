import React, { useState, useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import { Portal } from './UI/Portal';
import styles from './PricingCard.module.css';

interface PricingCardProps {
  id: string;
  title: string;
  subtitle?: string;
  price: string;
  features: string[];
  badge?: string;
  isPopular?: boolean;
  bgColor?: string;
  textColor?: string;
}

const emojis = [
  '😀','😂','😎','🔥','💥','💀','💡','✅','💬', '🎮', // оригинальные 9
  '🎉','🎁','🍕','🍔','🍟','🍎','🍌','🍇','⚡','⭐', // новые 10
  '🌈','🌞','🌙','☀️','☁️','🌊','🌹','🌺','🐶','🐱'  // ещё 11
];

const EmojiInput: React.FC<{
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
        <Portal>
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
        </Portal>
      )}
    </div>
  );
};

// IndexedDB
const dbName = 'PricingCardsDB';
const storeName = 'cards';
const openDB = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(storeName, { keyPath: 'id' });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

export const PricingCard: React.FC<PricingCardProps> = ({
  id, title, subtitle, price, features, badge, isPopular = false, bgColor = 'white', textColor = '#1f2937'
}) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [localTitle, setLocalTitle] = useState(title);
  const [localSubtitle, setLocalSubtitle] = useState(subtitle || '');
  const [localPrice, setLocalPrice] = useState(price);
  const [localFeatures, setLocalFeatures] = useState(features);
  const [localBadge, setLocalBadge] = useState(badge || '');
  const [localPopularLabel, setLocalPopularLabel] = useState('Популярный тариф');
  const [translate, setTranslate] = useState<number>(0);

  useEffect(() => {
    if (window.innerWidth > 1180) {
      if (id === "standard") setTranslate(15);
      if (id === "max") setTranslate(-15);
    }

    (async () => {
      const db = await openDB();
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const stored = await new Promise<any>((res) => {
        const r = store.get(id);
        r.onsuccess = () => res(r.result);
      });
      if (stored) {
        setLocalTitle(stored.title);
        setLocalSubtitle(stored.subtitle);
        setLocalPrice(stored.price);
        setLocalFeatures(stored.features);
        setLocalBadge(stored.badge);
        setLocalPopularLabel(stored.popularLabel || 'Популярный тариф');
      }
    })();
  }, [id]);

  const startEdit = (field: string) => setEditingField(field);

  const confirmEdit = async () => {
    setEditingField(null);
    const db = await openDB();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    store.put({
      id,
      title: localTitle,
      subtitle: localSubtitle,
      price: localPrice,
      features: localFeatures,
      badge: localBadge,
      popularLabel: localPopularLabel,
    });
    tx.oncomplete = () => db.close();
  };

  return (
    <div
      className={`${styles.card} ${isPopular && window.innerWidth > 1180 ? styles.popularCard : ''}`}
      style={{ background: bgColor, color: textColor, transform: `translateX(${translate}px)` }}
    >
      {isPopular && <img src="/img/coin.png" alt="coin" className={styles.coin} />}
      {badge && (
        <div className={styles.badgeWrap}>
          <div className={styles.badge}>
            {editingField === 'badge' ? (
              <>
                <EmojiInput value={localBadge} onChange={setLocalBadge} />
                <Check className={styles.checkIcon2} onClick={confirmEdit} />
              </>
            ) : (
              <span onClick={() => startEdit('badge')}>{localBadge}</span>
            )}
          </div>
        </div>
      )}

      {isPopular && (
        <div className={styles.popular}>
          {editingField === 'popularLabel' ? (
            <>
              <EmojiInput value={localPopularLabel} onChange={setLocalPopularLabel} />
              <Check className={styles.checkIcon} onClick={confirmEdit} />
            </>
          ) : (
            <span onClick={() => startEdit('popularLabel')}>{localPopularLabel}</span>
          )}
        </div>
      )}

      <h3 className={styles.title}>
        {editingField === 'title' ? (
          <>
            <EmojiInput value={localTitle} onChange={setLocalTitle} />
            <Check className={styles.checkIcon} onClick={confirmEdit} />
          </>
        ) : (
          <span onClick={() => startEdit('title')}>{localTitle}</span>
        )}
      </h3>

      {subtitle && (
        <p className={styles.subtitle}>
          {editingField === 'subtitle' ? (
            <>
              <EmojiInput value={localSubtitle} onChange={setLocalSubtitle} />
              <Check className={styles.checkIcon} onClick={confirmEdit} />
            </>
          ) : (
            <span onClick={() => startEdit('subtitle')}>{localSubtitle}</span>
          )}
        </p>
      )}

      <ul className={styles.features}>
        {localFeatures.map((f, idx) => (
          <li key={idx} className={styles.featureItem}>
            <span className={styles.featureBullet}>•</span>
            {editingField === `feature-${idx}` ? (
              <>
                <EmojiInput
                  value={localFeatures[idx]}
                  onChange={(val) => {
                    const newFeatures = [...localFeatures];
                    newFeatures[idx] = val;
                    setLocalFeatures(newFeatures);
                  }}
                />
                <Check className={styles.checkIcon} onClick={confirmEdit} />
              </>
            ) : (
              <span className={styles.featureText} onClick={() => startEdit(`feature-${idx}`)}>
                {f}
              </span>
            )}
          </li>
        ))}
      </ul>

      <p className={styles.price}>
        {editingField === 'price' ? (
          <>
            <EmojiInput value={localPrice} onChange={setLocalPrice} />
            <Check className={styles.checkIcon} onClick={confirmEdit} />
          </>
        ) : (
          <span onClick={() => startEdit('price')}>{localPrice}</span>
        )}
      </p>
    </div>
  );
};
