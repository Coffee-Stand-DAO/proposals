#!/bin/bash

# プロポーザル一覧表示スクリプト

echo "Coffee-Stand-DAO Proposals List"
echo "================================"
echo ""

if [ -d "proposals" ]; then
    for proposal in proposals/*.md; do
        if [ -f "$proposal" ]; then
            filename=$(basename "$proposal")
            title=$(grep "^# " "$proposal" | head -1 | sed 's/^# //' | sed 's/提案 #[0-9]*: //' | sed 's/Proposal #[0-9]*: //')
            echo "• $filename"
            echo "  $title"
            echo ""
        fi
    done | sort
else
    echo "No proposals directory found."
fi
