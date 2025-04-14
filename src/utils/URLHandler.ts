import { Linking } from 'react-native';
import { router } from 'expo-router';

export const initializeURLHandler = () => {
  // Обработка URL при запуске приложения
  Linking.getInitialURL().then((url) => {
    if (url) {
      handleURL(url);
    }
  });

  // Обработка URL при открытии приложения
  Linking.addEventListener('url', (event) => {
    handleURL(event.url);
  });
};

const handleURL = (url: string) => {
  const urlObj = new URL(url);
  if (urlObj.protocol === 'fitalic:') {
    const path = urlObj.pathname;
    if (path.startsWith('/section/')) {
      const sectionId = path.split('/')[2];
      // Здесь можно добавить навигацию к нужному экрану
      router.push(`/section/${sectionId}`);
    }
  }
}; 