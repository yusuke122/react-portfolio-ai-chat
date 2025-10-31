# React Portfolio AI Chat

ポートフォリオサイト with AI チャット機能

## 機能

- AIチャット（テキスト生成 + 実際の画像生成API）
- **画像解析機能** - 月数百件の無料分析
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
# 画像解析API（月1,000件まで無料）

# SSR設定（オプション）
SSR_PORT=3000
API_PORT=8787
```

### 3. 開発サーバーの起動

#### SSR（サーバーサイドレンダリング）モード（推奨）
```bash
npm run dev
```
- SSRサーバー: http://localhost:3000
- APIサーバー: http://localhost:8787

#### SPA（シングルページアプリケーション）モード
```bash
npm run dev:spa
```
- 開発サーバー: http://localhost:5173
- APIサーバー: http://localhost:8787

### 4. 本番ビルドとデプロイ

#### SSR本番ビルド
```bash
npm run build
npm run start
```

#### SPA本番ビルド
```bash
npm run build:legacy
npm run preview:spa
```
```

### 3. API取得方法

#### 🎨 画像生成API（Hugging Face - 月1,000件まで無料））:
1. [Hugging Face](https://huggingface.co/) でアカウント作成
2. [Settings > Access Tokens](https://huggingface.co/settings/tokens) でトークン生成
3. `.env.local`に`VITE_HUGGINGFACE_API_TOKEN`として追加

#### 🔍 画像解析API（Google Vision API - 月1,000件まで無料）:

**Google Vision API:**
1. [Google Cloud Console](https://console.cloud.google.com/) でプロジェクト作成
2. Vision APIを有効化
3. APIキーを作成して `VITE_GOOGLE_VISION_API_KEY` に設定

**フォールバック機能:**
- Google Vision API → 高度なモック分析
- APIが利用できない場合は自動的に高品質な分析結果を提供

**使用可能な機能:**
- 🎨 **画像生成**
- 🔍 **画像解析** 

### 4. 開発サーバーの起動

```bash
npm run dev
```

## Vercel へのデプロイ

### 1. 環境変数の設定

Vercel ダッシュボードで以下の環境変数を設定：
- `RESEND_API_KEY`: Resend API キー
- `VITE_HUGGINGFACE_API_TOKEN`: Hugging Face トークン
- `VITE_GOOGLE_VISION_API_KEY`: Google Vision API キー

### 2. デプロイ

```bash
vercel --prod
```

## 技術スタック

- React 18 + TypeScript
- React Router
- SCSS + RadixUI + Bootstrap
- Framer Motion
- React Hook Form + Zod
- Resend API
- Hugging Face API
- Google Cloud Vision API
- Custom hooks for reusable logic
- Modular structure for components and pages
- CSS for styling

## Contributing


Contributions are welcome! Please open an issue or submit a pull request for any improvements or features you'd like to add.


