import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import styles from './PricingCard.module.css';

interface PricingCardProps {
    id: string; // уникальный id карточки для IndexedDB
    title: string;
    subtitle?: string;
    price: string;
    features: string[];
    badge?: string;
    isPopular?: boolean;
    bgColor?: string;
    textColor?: string;
}

// Инициализация IndexedDB
const dbName = 'PricingCardsDB';
const storeName = 'cards';
const openDB = () => {
    return new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);
            request.onupgradeneeded = () => {
            request.result.createObjectStore(storeName, { keyPath: 'id' });
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const PricingCard: React.FC<PricingCardProps> = ({
    id,
    title,
    subtitle,
    price,
    features,
    badge,
    isPopular = false,
    bgColor = 'white',
    textColor = '#1f2937'
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
            {isPopular &&<img src="/img/coin.png" alt="coin" className={styles.coin} />}
            {badge && (
                <div className={styles.badgeWrap}>
                    <div className={styles.badge}>
                        {editingField === 'badge' ? (
                            <>
                            <input
                                value={localBadge}
                                onChange={(e) => setLocalBadge(e.target.value)}
                            />
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
                        <input
                            value={localPopularLabel}
                            onChange={(e) => setLocalPopularLabel(e.target.value)}
                        />
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
                        <input
                        value={localTitle}
                        onChange={(e) => setLocalTitle(e.target.value)}
                        />
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
                        <input
                            value={localSubtitle}
                            onChange={(e) => setLocalSubtitle(e.target.value)}
                        />
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
                                <input
                                value={localFeatures[idx]}
                                onChange={(e) => {
                                    const newFeatures = [...localFeatures];
                                    newFeatures[idx] = e.target.value;
                                    setLocalFeatures(newFeatures);
                                }}
                                />
                                <Check className={styles.checkIcon} onClick={confirmEdit} />
                            </>
                        ) : (
                            <span
                                className={styles.featureText}
                                onClick={() => startEdit(`feature-${idx}`)}
                            >
                                {f}
                            </span>
                        )}
                    </li>
                ))}
            </ul>

            <p className={styles.price}>
                {editingField === 'price' ? (
                    <>
                        <input
                        value={localPrice}
                        onChange={(e) => setLocalPrice(e.target.value)}
                        />
                        <Check className={styles.checkIcon} onClick={confirmEdit} />
                    </>
                ) : (
                    <span onClick={() => startEdit('price')}>{localPrice}</span>
                )}
            </p>
        </div>
    );
};
