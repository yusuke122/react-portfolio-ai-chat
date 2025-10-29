# React Portfolio AI Chat

ポートフォリオサイト with AI チャット機能

## 機能

- AIチャット
- コードエディタ
- お問い合わせフォーム（サーバーレスメール送信機能付き）
- テーマ切り替え（ダーク/ライトモード）
- 多言語対応（日本語/英語）

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` ファイルを作成し、以下を設定：

```bash
RESEND_API_KEY=your_resend_api_key_here
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

## Vercel へのデプロイ

### 1. 環境変数の設定

Vercel ダッシュボードで以下の環境変数を設定：
- `RESEND_API_KEY`: あなたの Resend API キー

### 2. デプロイ

```bash
vercel --prod
```

## 技術スタック

- React 18 + TypeScript
- React Router
- SCSS + Bootstrap
- Framer Motion
- React Hook Form + Zod
- Resend (サーバーレス関数)
- Custom hooks for reusable logic
- Modular structure for components and pages
- CSS for styling

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features you'd like to add.