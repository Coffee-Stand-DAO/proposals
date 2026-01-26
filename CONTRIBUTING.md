# コントリビューションガイドライン

Coffee-Stand-DAO Proposals リポジトリへのコントリビューションありがとうございます。

## プロポーザルの作成

### 方法1: スクリプトを使用

```bash
# Pythonツールを使用
python3 proposal_manager.py create "プロポーザルのタイトル"

# Makefileを使用
make create TITLE="プロポーザルのタイトル"
```

### 方法2: 手動で作成

1. `proposals/` ディレクトリに新しいMarkdownファイルを作成
2. ファイル名の形式: `XXXX-title.md` (XXXXは4桁の数字、00xxから開始)
3. テンプレート: `templates/proposal-template.md` を参照

### プロポーザルの構成

```markdown
# 提案 #XX: タイトル

## 概要
簡潔な説明

## 会議情報
- 日時
- 場所
- 参加者

## 詳細
背景、目的、議論内容

## アクションアイテム
- [ ] タスク1
- [ ] タスク2

## 次回予定
次回の予定やフォローアップ事項
```

## 開発

### セットアップ

```bash
# 依存関係のインストール
make install

# ツールの確認
make list
```

### コードフォーマット

```bash
make format
```

## プルリクエスト

1. 新しいブランチを作成: `git checkout -b feature/proposal-XX`
2. 変更をコミット: `git commit -am "Add proposal XX"`
3. プッシュ: `git push origin feature/proposal-XX`
4. Pull Requestを作成

PRのタイトルは `Proposal #XX: タイトル` の形式に従ってください。

## ライセンス

このリポジトリの内容はCoffee-Stand-DAOのものです。
