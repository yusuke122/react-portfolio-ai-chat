import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

// SSR環境でのチェック
const isServer = typeof window === 'undefined';

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
      contact: string;
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
      editor: 'エディタ',
      contact: 'お問い合わせ'
    },
    // ページ
    pages: {
      home: {
        title: 'React ポートフォリオ',
        description: 'AI チャット機能付きポートフォリオサイト',
        cards: {
          aiChat: {
            title: 'AIチャット',
            description: 'AIとチャットで簡単に画像作成'
          },
          contact: {
            title: 'お問い合わせ',
            description: 'フィードバックやご要望はこちら'
          }
        }
      },
      chat: {
        title: 'AI チャット',
        placeholder: 'メッセージを入力...',
        send: '送信',
        clear: 'クリア',
        imageGeneration: '画像生成',
        textGeneration: 'テキスト生成',
        imageAnalysis: '画像解析',
        generateImage: '画像生成',
        analyzeImage: '解析開始',
        selectAvatar: 'アバター選択',
        previousAvatar: '前のアバター',
        nextAvatar: '次のアバター',
        aiAssistant: 'AIアシスタント',
        thinking: '考え中...',
        readyToHelp: 'お手伝いします',
        sections: {
          imageGeneration: 'AI画像生成',
          textGeneration: 'AIテキスト生成',
          imageAnalysis: 'AI画像解析'
        },
        avatars: {
          creative: 'クリエイティブ',
          technical: 'テクニカル',
          casual: 'カジュアル',
          professional: 'プロ'
        },
        avatarPrompts: {
          creative: '創造的で芸術的な内容を生成してください',
          technical: '技術的で詳細な説明を生成してください',
          casual: 'フレンドリーで親しみやすい内容を生成してください',
          professional: 'プロフェッショナルで丁寧な内容を生成してください'
        },
        prompts: {
          imagePrompt: '画像生成プロンプト',
          textPrompt: 'テキスト生成プロンプト',
          enterPrompt: 'プロンプトを入力してください',
          imagePlaceholder: '生成したい画像の説明を入力してください...',
          textPlaceholder: '生成したいテキストの内容を入力してください...'
        },
        status: {
          generating: '生成中...',
          analyzing: '解析中...',
          complete: '完了',
          error: 'エラーが発生しました',
          imageGenerating: '生成中...',
          textGenerating: '生成中...'
        },
        messages: {
          avatarGeneration: 'アバターでの生成',
          avatarAnalysis: 'アバターの分析',
          responses: {
            hello: 'こんにちは！お手伝いできることはありますか？',
            question: '良い質問ですね。',
            generic: [
              'そうですね、その考えは興味深いですね。もう少し詳しく教えていただけますか？',
              'なるほど、確かにその視点は重要ですね。私からは以下の提案もさせていただきたいと思います...',
              'その考えについて、別の角度からも見てみましょう。例えば...',
              'ご指摘ありがとうございます。その点については、さらに掘り下げて考えてみる必要がありそうですね。',
              'とても良い質問ですね。これについて、以下のような観点から考えてみましょう...'
            ]
          }
        },
        analysis: {
          title: 'AI画像解析',
          resultTitle: '解析結果',
          selectImage: '解析する画像を選択してください',
          generatedImages: '生成された画像数',
          noGeneratedImages: '🎨 画像生成タブで画像を生成してから解析を行ってください',
          avatarGenerated: 'アバターが画像を生成しました',
          artistic: '🎨 芸術的構成分析',
          technical: '📸 技術的品質評価',
          psychological: '🧠 視覚心理学的分析',
          communication: '🎯 コミュニケーション効果',
          details: '📋 詳細評価ポイント',
          summary: '💡 総合評価',
          noImage: '解析する画像を選択してください',
          technicalSpecs: '🔧 技術仕様',
          fileFormat: 'ファイル形式',
          fileSize: 'ファイルサイズ',
          resolution: '解像度',
          aspectRatio: 'アスペクト比',
          pixels: 'ピクセル'
        }
      },
      contact: {
        title: 'お問い合わせ',
        firstName: '名前',
        lastName: '姓',
        email: 'メールアドレス',
        subject: '件名',
        message: 'メッセージ',
        send: '送信',
        sending: '送信中...',
        success: 'メッセージが送信されました',
        error: '送信に失敗しました',
        required: '必須',
        placeholders: {
          firstName: '太郎',
          lastName: '山田',
          email: 'yamada@example.com',
          subject: 'お問い合わせの件名',
          message: 'お問い合わせ内容をこちらにご記入ください'
        },
        errors: {
          firstNameRequired: '名前を入力してください',
          lastNameRequired: '姓を入力してください',
          emailRequired: 'メールアドレスを入力してください',
          emailInvalid: '有効なメールアドレスを入力してください',
          subjectRequired: '件名を入力してください',
          messageRequired: 'メッセージを入力してください'
        },
        successMessage: 'お問い合わせありがとうございます。メッセージが正常に送信されました。',
        errorMessage: '申し訳ありませんが、メッセージの送信に失敗しました。もう一度お試しください。',
        backToForm: 'フォームに戻る',
        retry: '再試行'
      }
    },
    // テーマ
    theme: {
      light: 'ライトモード',
      dark: 'ダークモード'
    },
    // 共通
    common: {
      loading: '読み込み中...',
      error: 'エラー',
      success: '成功',
      cancel: 'キャンセル',
      confirm: '確認',
      close: '閉じる',
      save: '保存',
      delete: '削除',
      edit: '編集',
      back: '戻る',
      next: '次へ',
      previous: '前へ'
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
      editor: 'Editor',
      contact: 'Contact'
    },
    // Pages
    pages: {
      home: {
        title: 'React Portfolio',
        description: 'Portfolio site with AI Chat feature',
        cards: {
          aiChat: {
            title: 'AI Chat',
            description: 'Create images easily by chatting with AI'
          },
          contact: {
            title: 'Contact',
            description: 'Send us your feedback and requests'
          }
        }
      },
      chat: {
        title: 'AI Chat',
        placeholder: 'Type a message...',
        send: 'Send',
        clear: 'Clear',
        imageGeneration: 'Image Generation',
        textGeneration: 'Text Generation',
        imageAnalysis: 'Image Analysis',
        generateImage: 'Generate Image',
        analyzeImage: 'Analyze',
        selectAvatar: 'Select Avatar',
        previousAvatar: 'Previous Avatar',
        nextAvatar: 'Next Avatar',
        aiAssistant: 'AI Assistant',
        thinking: 'Thinking...',
        readyToHelp: 'Ready to help',
        sections: {
          imageGeneration: 'AI Image Generation',
          textGeneration: 'AI Text Generation',
          imageAnalysis: 'AI Image Analysis'
        },
        avatars: {
          creative: 'Creative',
          technical: 'Technical',
          casual: 'Casual',
          professional: 'Professional'
        },
        avatarPrompts: {
          creative: 'Please generate creative and artistic content',
          technical: 'Please generate technical and detailed explanations',
          casual: 'Please generate friendly and approachable content',
          professional: 'Please generate professional and polite content'
        },
        prompts: {
          imagePrompt: 'Image Generation Prompt',
          textPrompt: 'Text Generation Prompt',
          enterPrompt: 'Enter your prompt',
          imagePlaceholder: 'Enter description of the image you want to generate...',
          textPlaceholder: 'Enter the content you want to generate...'
        },
        status: {
          generating: 'Generating...',
          analyzing: 'Analyzing...',
          complete: 'Complete',
          error: 'An error occurred',
          imageGenerating: 'Generating...',
          textGenerating: 'Generating...'
        },
        messages: {
          avatarGeneration: 'Avatar Generation',
          avatarAnalysis: 'Avatar Analysis',
          responses: {
            hello: 'Hello! How can I help you today?',
            question: 'Great question.',
            generic: [
              'That\'s an interesting perspective. Could you tell me more about that?',
              'I see, that\'s definitely an important point. I\'d like to suggest the following...',
              'Let\'s look at this from a different angle. For example...',
              'Thank you for bringing that up. We should probably dig deeper into that topic.',
              'That\'s a really good question. Let\'s think about this from the following perspectives...'
            ]
          }
        },
        analysis: {
          title: 'AI Image Analysis',
          resultTitle: 'Analysis Result',
          selectImage: 'Please select an image to analyze',
          generatedImages: 'Generated images count',
          noGeneratedImages: '🎨 Please generate images in the Image Generation tab first',
          avatarGenerated: 'Avatar generated an image',
          artistic: '🎨 Artistic Composition Analysis',
          technical: '📸 Technical Quality Assessment',
          psychological: '🧠 Visual Psychology Analysis',
          communication: '🎯 Communication Effectiveness',
          details: '📋 Detailed Evaluation Points',
          summary: '💡 Overall Assessment',
          noImage: 'Please select an image to analyze',
          technicalSpecs: '🔧 Technical Specifications',
          fileFormat: 'File Format',
          fileSize: 'File Size',
          resolution: 'Resolution',
          aspectRatio: 'Aspect Ratio',
          pixels: 'pixels'
        }
      },
      contact: {
        title: 'Contact',
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        subject: 'Subject',
        message: 'Message',
        send: 'Send',
        sending: 'Sending...',
        success: 'Message sent successfully',
        error: 'Failed to send message',
        required: 'Required',
        placeholders: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          subject: 'Your inquiry subject',
          message: 'Please enter your message here'
        },
        errors: {
          firstNameRequired: 'Please enter your first name',
          lastNameRequired: 'Please enter your last name',
          emailRequired: 'Please enter your email address',
          emailInvalid: 'Please enter a valid email address',
          subjectRequired: 'Please enter a subject',
          messageRequired: 'Please enter a message'
        },
        successMessage: 'Thank you for your inquiry. Your message has been sent successfully.',
        errorMessage: 'Sorry, failed to send your message. Please try again.',
        backToForm: 'Back to Form',
        retry: 'Retry'
      }
    },
    // Theme
    theme: {
      light: 'Light Mode',
      dark: 'Dark Mode'
    },
    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      confirm: 'Confirm',
      close: 'Close',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      back: 'Back',
      next: 'Next',
      previous: 'Previous'
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
    },
    // SSR対応
    initImmediate: !isServer, // サーバーサイドでは即座に初期化
    react: {
      useSuspense: !isServer // サーバーサイドではSuspenseを使用しない
    }
  });


export default i18n;
