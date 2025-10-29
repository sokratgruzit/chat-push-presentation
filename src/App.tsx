import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { PricingCard } from './components/PricingCard';
import styles from './App.module.css';

export default function App() {
  const previewRef = useRef<HTMLDivElement>(null);

  const downloadJPEG = async () => {
    if (!previewRef.current) return;
    const canvas = await html2canvas(previewRef.current);
    const link = document.createElement('a');
    link.download = 'preview.jpg';
    link.href = canvas.toDataURL('image/jpeg');
    link.click();
  };

  const standardFeatures = [
    'Уведомление о создании записи',
    'Напоминание о визите',
    'Поздравления с днем Рождения',
    'Отчёты на месяцев о наиболее покупаемых услугах',
    'Запрос отзыва (без фильтра негативных)',
    'Уведомление об отмене/изменении записи',
    'Чат с клиентами прямо в Yclients'
  ];

  const superFeatures = [
    '"Гибкое" предложение записаться снова (Работает не каждый тип услуги) повышает продажи на 10-15%',
    '"Кросс-селл" продажи (Клиентка берёт только одну услугу? Поможем ей купить вторую услугу или товар) повышает средний чек на 15-20%',
    'Возврат "спящих" клиентов (Клиента не было больше полу года? Нет! Поможем ему "вспомнить" с помощью формы)',
    'Полностью безлимитные массовые рассылки!'
  ];

  const maxFeatures = [
    'Массовые рассылки по WhatsApp (до 4000 сообщений в месяц)',
    'Запрос отзывов с фильтрацией (Фильтруем негативные отзывы и автоматически предлагаем публикацию на Яндекс.Картах и 2ГИС)',
    'Подтверждение визита (Напоминание о визите, можно отменить или подтвердить запись)'
  ];

  return (
    <>
      <div ref={previewRef} className={styles.root}>
        {/* Превью зона */}
        <div className={styles.cardsContainer}>
          {/* Декор */}
          <div className={styles.decorativeYellow}></div>
          <div className={styles.decorativeGreen}></div>
          <div className={styles.decorativeBlueLarge}></div>

          <img src="/img/letter.png" alt="letter" className={styles.letter} />
          <img src="/img/whatsapp.png" alt="whatsapp" className={styles.whatsapp} />
          <img src="/img/heart.png" alt="heart" className={styles.heart} />
          <img src="/img/telegram.png" alt="telegram" className={styles.telegram} />
          <img src="/img/bubble-dots.png" alt="bubble" className={styles.bubble} />

          <PricingCard
            id="standard"
            title="Тариф 'Стандарт'"
            price="999 руб./мес"
            features={standardFeatures}
            bgColor="#fae6c2ff"
            textColor="#1f2937"
          />
          <PricingCard
            id="super"
            title="Тариф 'СУПЕР'🔥"
            subtitle="Опции тарифов 'Стандарт' + 'Макс'"
            price="2490 руб./мес"
            features={superFeatures}
            bgColor="#fe9246ff"
            textColor="#1f2937"
            badge="самый выгодный"
            isPopular={true}
          />
          <PricingCard
            id="max"
            title="Тариф 'Макс'💥"
            subtitle="Опции тарифа 'Стандарт'"
            price="1749 руб./мес"
            features={maxFeatures}
            bgColor="#8bb9f2ff"
            textColor="#1f2937"
          />
        </div>
      </div>
      <div className={styles.downloadWrapper}>
        <button className={styles.downloadBtn} onClick={downloadJPEG}>
          Скачать JPEG
        </button>
      </div>
    </>
  );
}
