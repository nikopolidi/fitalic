import { NativeModules } from 'react-native';

const { WidgetManager } = NativeModules;

interface WidgetSection {
  id: string;
  title: string;
  color: string;
}

interface WidgetStyle {
  backgroundColor: string;
  dividerColor: string;
  dividerWidth: number;
  fontSize: number;
  fontWeight: number; // 400-900
  padding: number;
}

interface WidgetData {
  sections: WidgetSection[];
  style: WidgetStyle;
}

const defaultStyle: WidgetStyle = {
  backgroundColor: '#000000',
  dividerColor: '#FFFFFF',
  dividerWidth: 2,
  fontSize: 16,
  fontWeight: 600,
  padding: 16,
};

export const updateWidget = async (data: Partial<WidgetData>) => {
  const defaultData: WidgetData = {
    sections: [
      { id: '1', title: 'Тренировка', color: '#FF3B30' },
      { id: '2', title: 'Статистика', color: '#34C759' },
    ],
    style: defaultStyle,
  };

  // Объединяем дефолтные данные с переданными
  const mergedData: WidgetData = {
    sections: data.sections || defaultData.sections,
    style: { ...defaultStyle, ...data.style },
  };

  try {
    await WidgetManager.updateWidget(mergedData);
    return true;
  } catch (error) {
    console.error('Error updating widget:', error);
    return false;
  }
};

// Примеры использования
export const examples = {
  // Обновить только контент
  updateContent: async () => {
    return updateWidget({
      sections: [
        { id: '1', title: 'Новая тренировка', color: '#FF3B30' },
        { id: '2', title: 'Прогресс', color: '#34C759' },
      ],
    });
  },

  // Обновить только стили
  updateStyle: async () => {
    return updateWidget({
      style: {
        backgroundColor: '#1C1C1E',
        dividerColor: '#48484A',
        fontSize: 18,
        fontWeight: 700,
        dividerWidth: 1,
        padding: 12,
      },
    });
  },

  // Обновить все
  updateAll: async () => {
    return updateWidget({
      sections: [
        { id: '1', title: 'Старт', color: '#007AFF' },
        { id: '2', title: 'Результаты', color: '#5856D6' },
      ],
      style: {
        backgroundColor: '#000000',
        dividerColor: '#FFFFFF',
        dividerWidth: 1,
        fontSize: 20,
        fontWeight: 800,
        padding: 12,
      },
    });
  },
};

export default {
  updateWidget,
  examples,
}; 