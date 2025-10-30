import React, { useState, useEffect } from 'react';
import { EditCardModal } from './ui/modals/EditCardModal';

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

// IndexedDB
const dbName = 'PricingCardsDB';
const storeName = 'cards';
const openDB = () => new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(storeName, { keyPath: 'id' });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
});

export const PricingCard: React.FC<PricingCardProps> = ({
    id, title, subtitle, price, features, badge, isPopular = false, bgColor = 'white', textColor = '#1f2937'
}) => {
    const [localTitle, setLocalTitle] = useState(title);
    const [localSubtitle, setLocalSubtitle] = useState(subtitle || '');
    const [localPrice, setLocalPrice] = useState(price);
    const [localFeatures, setLocalFeatures] = useState(features);
    const [localBadge, setLocalBadge] = useState(badge || '');
    const [localPopularLabel, setLocalPopularLabel] = useState('Популярный тариф');
    const [translate, setTranslate] = useState<number>(0);
    const [openModal, setOpenModal] = useState<boolean>(false);

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

    const confirmEdit = async () => {
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

    const handleModal = (status: boolean) => {
        setOpenModal(status);
    };

    return (
        <>
            <div
                className={`${styles.card} ${isPopular && window.innerWidth > 1180 ? styles.popularCard : ''}`}
                style={{ background: bgColor, color: textColor, transform: `translateX(${translate}px)` }}
                onClick={() => handleModal(true)}
            >
                {isPopular && <img src="/img/coin.png" alt="coin" className={styles.coin} />}
                {badge && <div className={styles.badgeWrap}>
                    <div className={styles.badge}>{localBadge}</div>
                </div>}
                {isPopular && <div className={styles.popular}>{localPopularLabel}</div>}
                <h3 className={styles.title}>{localTitle}</h3>
                {subtitle && <p className={styles.subtitle}>{localSubtitle}</p>}
                <ul className={styles.features}>
                    {localFeatures.map((f, idx) => (
                        <li key={idx} className={styles.featureItem}>
                            <span className={styles.featureBullet}>•</span>
                            <span className={styles.featureText}>
                                {f}
                            </span>
                        </li>
                    ))}
                </ul>
                <p className={styles.price}>{localPrice}</p>
            </div>
            {openModal && <EditCardModal 
                onClick={() => handleModal(false)} 
                isPopular={isPopular}
                localPopularLabel={localPopularLabel} 
                setLocalPopularLabel={setLocalPopularLabel}
                badge={badge}
                localBadge={localBadge} 
                setLocalBadge={setLocalBadge}
                confirmEdit={confirmEdit}
                localTitle={localTitle} 
                setLocalTitle={setLocalTitle}
                localSubtitle={localSubtitle} 
                setLocalSubtitle={setLocalSubtitle}
                subtitle={subtitle}
                localFeatures={localFeatures}
                setLocalFeatures={setLocalFeatures}
                localPrice={localPrice} 
                setLocalPrice={setLocalPrice}
            />}
        </>
    );
};
