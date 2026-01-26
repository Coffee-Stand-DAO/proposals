#!/bin/bash

# 新規プロポーザル作成スクリプト

if [ -z "$1" ]; then
    echo "Usage: ./create-proposal.sh <title>"
    echo "Example: ./create-proposal.sh 'New collaboration event'"
    exit 1
fi

TITLE="$1"
DATE=$(date +"%Y-%m-%d")

# 次の番号を取得
LAST_NUM=$(ls proposals/*.md 2>/dev/null | grep -o '[0-9]\{4\}' | sort -n | tail -1)
if [ -z "$LAST_NUM" ]; then
    NUM=1
else
    NUM=$((LAST_NUM + 1))
fi

NUM_FORMATTED=$(printf "%04d" $NUM)
FILENAME="proposals/${NUM_FORMATTED}-$(echo $TITLE | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/-\+/-/g' | sed 's/^-\|-$//g').md"

cat > "$FILENAME" <<EOF
# 提案 #${NUM}: ${TITLE}

## 概要

TODO: 提案の概要を記述してください

## 会議情報

- **日時**: ${DATE}
- **場所**:
- **参加者**:

## 詳細

TODO: 提案の詳細を記述してください

## アクションアイテム

- [ ] アクションアイテム1
- [ ] アクションアイテム2

## 次回予定

TODO: 次回の予定を記述してください

---

*本提案は Issue #${NUM} で議論されました*
EOF

echo "Created: $FILENAME"
echo "Please edit the file to add content."
