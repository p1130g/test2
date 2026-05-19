# 📅 Vue 3 + TypeScript Calendar App

モダンな TypeScript + Vue 3 を使用したカレンダーアプリケーション

## ✨ 主な機能

- **Vue 3 Composition API** - 最新の Vue 3 フレームワーク
- **TypeScript** - 完全な型安全性
- **月単位表示** - 日曜始まりの 7×6 行形式
- **インライン予定表示** - カレンダーセルに予定内容を小さな文字で表示
- **予定管理** - 追加・削除・詳細表示
- **LocalStorage** - 自動保存機能
- **レスポンシブ** - モバイル対応

## 🎯 カレンダーの特徴

### 表形式表示
```
  日   月   火   水   木   金   土
       ①   ②   ③   ④   ⑤   ⑥   ⑦
  ⑧   ⑨   ⑩   ⑪   ⑫   ⑬   ⑭
  ...
```

### インライン予定表示
- 各セルに予定の小さなテキスト表示
- 赤いバックグラウンドで視認性を確保
- ホバーで詳細を表示（title 属性）
- 複数予定は重ねて表示

## 🚀 使用方法

### インストール
```bash
npm install
```

### 開発サーバー起動
```bash
npm run dev
```

ブラウザで `http://localhost:5173` が自動で開きます

### 本番ビルド
```bash
npm run build
```

## 📦 プロジェクト構成

```
.
├── src/
│   ├── main.ts          # Vue アプリケーション入口
│   ├── App.vue          # メインコンポーネント（Composition API + TypeScript）
│   └── style.css        # グローバルスタイル
├── package.json         # 依存パッケージ
├── tsconfig.json        # TypeScript 設定
├── tsconfig.node.json   # Node 向け TS 設定
├── vite.config.ts       # Vite ビルドツール設定
├── index.html           # HTML エントリーポイント
└── README.md            # このファイル
```

## 🛠️ 技術スタック

- **Vue 3** - UI フレームワーク
- **TypeScript** - 型安全な JavaScript
- **Vite** - 高速ビルドツール
- **Composition API** - Vue 3 の最新 API
- **LocalStorage API** - ローカルデータ永続化

## 💾 データ保存

予定は `localStorage` に JSON 形式で自動保存されます：

```typescript
{
  "2026-05-19": [
    { "id": 1234567890, "title": "会議", "desc": "月例ミーティング" }
  ],
  "2026-05-20": [...]
}
```

## 📝 使い方

1. **カレンダーで日付をクリック** - 日付を選択
2. **予定情報を入力** - タイトルと詳細を入力
3. **「予定を追加」をクリック** - 予定を登録
4. **カレンダーに表示** - セルに小さなテキストで表示
5. **削除** - サイドバーから削除可能

## 🎨 スタイル

- グラデーション背景（紫系）
- モダンなカード型デザイン
- スムーズなアニメーション
- 直感的な UI/UX

## 📱 レスポンシブ対応

- PC: 左にカレンダー、右に予定パネル
- タブレット: レイアウト自動調整
- スマートフォン: 縦一列レイアウト

## 🔧 開発

### TypeScript での型定義
```typescript
interface CalendarEvent {
  id: number
  title: string
  desc: string
}

interface CalendarCell {
  date: string
  day: number
  isCurrentMonth: boolean
}
```

### Composition API での状態管理
```typescript
const currentDate = ref<Date>(new Date())
const events = ref<Record<string, CalendarEvent[]>>({})
const selectedDate = ref<string>('')
const calendarCells = computed((): CalendarCell[] => { ... })
```

## 📋 今後の拡張機能

- [ ] カテゴリ別の色分け
- [ ] 通知機能
- [ ] 繰り返し予定
- [ ] クラウド同期
- [ ] ダークモード
- [ ] 月の表示切り替え

## 📄 ライセンス

MIT License

---

**作成日**: 2026年5月19日  
**フレームワーク**: Vue 3 + TypeScript  
**ビルドツール**: Vite  
**開発者**: p1130g
