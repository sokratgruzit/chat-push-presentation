import React from 'react';
import { X, Check } from 'lucide-react';
import { Portal } from '../Portal';
import { EmojiInput } from '../input/EmojiInput';

import styles from './EditCardModal.module.css';

export const EditCardModal: React.FC<{
    onClick: () => void;
    id?: string;
    title?: string;
    subtitle?: string;
    price?: string;
    badge?: string;
    isPopular?: boolean;
    bgColor?: string;
    textColor?: string;
    localBadge: string;
    setLocalBadge: (v: string) => void;
    confirmEdit: () => void;
    localPopularLabel: string;
    setLocalPopularLabel: (v: string) => void;
    localTitle: string;
    setLocalTitle: (v: string) => void;
    localSubtitle: string;
    setLocalSubtitle: (v: string) => void;
    localFeatures: string[];
    setLocalFeatures: (v: string[]) => void;
    localPrice: string;
    setLocalPrice: (v: string) => void;
}> = ({ 
    onClick,
    badge,
    localBadge,
    setLocalBadge,
    confirmEdit,
    isPopular,
    localPopularLabel,
    setLocalPopularLabel,
    localTitle,
    setLocalTitle,
    subtitle,
    localSubtitle,
    setLocalSubtitle,
    localFeatures,
    setLocalFeatures,
    localPrice,
    setLocalPrice
}) => {
    const handleConfirm = () => {
        confirmEdit();
        onClick();
    };

    return (
        <Portal>
            <div className={styles.modalWrap}>
                <X className={styles.close} onClick={onClick} />
                <Check className={styles.checkIcon} onClick={handleConfirm} />
                <div className={styles.inputsWrap}>
                    {isPopular && <div className={styles.label}>Верхний бейджик:</div>}
                    {isPopular && <EmojiInput value={localPopularLabel} onChange={setLocalPopularLabel} />}
                    <div className={styles.label}>Тариф:</div>
                    <EmojiInput value={localTitle} onChange={setLocalTitle} />
                    {subtitle && <div className={styles.label}>Подзаголовок:</div>}
                    {subtitle && <EmojiInput value={localSubtitle} onChange={setLocalSubtitle} />}
                    <div className={styles.label}>Список фитч:</div>
                    {localFeatures.map((_f, idx) => (
                        <div key={idx} className={styles.featureItem}>
                            <span className={styles.label}>#{idx + 1}</span>
                            <EmojiInput
                                value={localFeatures[idx]}
                                onChange={(val) => {
                                    const newFeatures = [...localFeatures];
                                    newFeatures[idx] = val;
                                    setLocalFeatures(newFeatures);
                                }}
                            />
                        </div>
                    ))}
                    <div className={styles.label}>Цена:</div>
                    <EmojiInput value={localPrice} onChange={setLocalPrice} />
                    {badge && <div className={styles.label}>Нижний бейджик:</div>}
                    {badge && <EmojiInput value={localBadge} onChange={setLocalBadge} />}
                </div>
            </div>
            <div className={styles.layout} onClick={onClick} />
        </Portal>
    );
};