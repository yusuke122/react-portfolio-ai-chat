import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

// 型定義の拡張
declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false;
  }
}

// リソースの型定義
interface Resources {
  translation: {
    welcome: string;
    nav: {
      home: string;
      portfolio: string;
      chat: string;
      editor: string;
    };
    pages: {
      home: {
        title: string;
        description: string;
      };
      chat: {
        placeholder: string;
        send: string;
        clear: string;
      };
    };
  };
}

// 日本語のリソース
const resourcesJa = {
  translation: {
    welcome: 'ようこそ',
    // ナビゲーション
    nav: {
      home: 'ホーム',
      portfolio: 'ポートフォリオ',
      chat: 'AIチャット',
      editor: 'エディタ'
    },
    // ホームページ
    pages: {
      home: {
        title: 'React ポートフォリオ',
        description: 'AI チャット機能付きポートフォリオサイト'
      },
      chat: {
        placeholder: 'メッセージを入力...',
        send: '送信',
        clear: 'クリア'
      }
    }
  }
};

// 英語のリソース
const resourcesEn = {
  translation: {
    welcome: 'Welcome',
    // Navigation
    nav: {
      home: 'Home',
      portfolio: 'Portfolio',
      chat: 'AI Chat',
      editor: 'Editor'
    },
    // Pages
    pages: {
      home: {
        title: 'React Portfolio',
        description: 'Portfolio site with AI Chat feature'
      },
      chat: {
        placeholder: 'Type a message...',
        send: 'Send',
        clear: 'Clear'
      }
    }
  }
};

// i18next インスタンスの作成と初期化
const i18n = i18next.createInstance();

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ja: resourcesJa,
      en: resourcesEn
    },
    lng: 'ja', // デフォルト言語
    fallbackLng: 'en', // フォールバック言語
    interpolation: {
      escapeValue: false // XSS対策（Reactが既に行っているため不要）
    }
  });

export default i18n;