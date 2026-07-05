# 📸 インスタ運用チェックリスト 2026

Instagramの開設から毎日の運用まで、これ1つで完結するチェックリストアプリ。
2026年の最新ルール（ハッシュタグ上限5個・オリジナル優遇・DMシェア重視など）に対応。

**公開URL:** https://ririnanamiwa-commits.github.io/insta-checklist/

ビルド不要・依存なしの1ファイル構成（`index.html`）。ブラウザで開くだけで動く。
チェック状態は各自の端末（localStorage）に保存される。

---

## 🔄 更新をお願いするとき（みわさん用）

インスタのルールはよく変わるので、変更があったら Claude にこう頼めば更新されます。テンプレ例：

> インスタのチェックリスト、〇〇のルールが変わったみたいなので最新に更新して。公開まで反映してほしい。

- 「公開まで反映して」と言えば、GitHub Pages への反映（下記の手順）まで自動でやります
- 具体的な変更点が分からなくても「最新ルールを調べ直して反映して」でOK。Claudeが裏取りしてから直します
- 反映後、URLは同じままで内容だけ新しくなります（1〜2分で反映）

---

## 🤖 Claudeへ：更新のデプロイ手順

このフォルダ（`insta-checklist/`）は **親の miyagi-dog リポジトリとは別の、専用リポジトリ**。
親からは `.gitignore` で除外済み。ここで独立して git 管理する。

- リモート: `https://github.com/ririnanamiwa-commits/insta-checklist`（PUBLIC）
- GitHub Pages: main ブランチ / ルート から配信
- 公開URL: https://ririnanamiwa-commits.github.io/insta-checklist/

更新を反映する手順（このフォルダ内で実行）:

```bash
cd /Users/sasakimiwa/Desktop/miyagi-dog/insta-checklist
git add -A
git commit -m "内容の要約"
git push
```

push すれば GitHub Pages が自動で再ビルドし、1〜2分で公開URLに反映される。
ルール変更を反映したら `UPDATES.md` にも1行追記すること。

**⚠️ 個人情報の注意:** このリポジトリは公開。親フォルダの `note-*.md` などの個人ノートは絶対にこのフォルダへ入れない／コミットしない。

---

## 📚 内容の根拠（裏取り済みソース）

- ハッシュタグ上限 30→5個（2025年12月・Meta発表）
- オリジナルコンテンツ優遇／転載まとめ制限（2026年5月アップデート）
- 評価トップ3＝視聴時間・いいね率・送信率（Instagram代表 A.モセリ氏公表）
- 投稿頻度 理想毎日・最低週3回（モセリ氏）
- 画像/動画サイズ・文字数上限・曜日別ベスト時間・エンゲージ率目安・収益化条件（各公式仕様）
- ステマ規制／タイアップ投稿ラベル（消費者庁・景表法 2023年10月施行）

詳細な変更履歴は [UPDATES.md](UPDATES.md) を参照。
