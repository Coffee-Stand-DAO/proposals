#!/usr/bin/env python3
"""
Coffee-Stand-DAO プロポーザル管理ツール
"""

import os
import re
import sys
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Optional

class ProposalManager:
    def __init__(self, proposals_dir: str = "proposals"):
        self.proposals_dir = Path(proposals_dir)
        self.proposals_dir.mkdir(exist_ok=True)

    def list_proposals(self) -> List[Dict]:
        """プロポーザル一覧を取得"""
        proposals = []
        for md_file in sorted(self.proposals_dir.glob("*.md")):
            with open(md_file, 'r', encoding='utf-8') as f:
                content = f.read()
                title = self._extract_title(content)
                num = self._extract_number(md_file.name)
                proposals.append({
                    'number': num,
                    'filename': md_file.name,
                    'title': title,
                    'path': str(md_file)
                })
        return proposals

    def get_proposal(self, number: int) -> Optional[Dict]:
        """指定番号のプロポーザルを取得"""
        num_str = f"{number:04d}"
        for md_file in self.proposals_dir.glob(f"{num_str}-*.md"):
            with open(md_file, 'r', encoding='utf-8') as f:
                content = f.read()
                return {
                    'number': number,
                    'filename': md_file.name,
                    'content': content,
                    'title': self._extract_title(content),
                    'path': str(md_file)
                }
        return None

    def create_proposal(self, title: str) -> Dict:
        """新規プロポーザルを作成"""
        # 次の番号を取得
        existing = self.list_proposals()
        if existing:
            next_num = max(p['number'] for p in existing) + 1
        else:
            next_num = 1

        # ファイル名を生成
        slug = self._slugify(title)
        filename = f"{next_num:04d}-{slug}.md"
        filepath = self.proposals_dir / filename

        # テンプレートを作成
        date = datetime.now().strftime("%Y-%m-%d")
        template = f"""# 提案 #{next_num}: {title}

## 概要

TODO: 提案の概要を記述してください

## 会議情報

- **日時**: {date}
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

*本提案は Issue #{next_num} で議論されました*
"""

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(template)

        return {
            'number': next_num,
            'filename': filename,
            'title': title,
            'path': str(filepath)
        }

    def update_status(self, number: int, status: str) -> bool:
        """プロポーザルのステータスを更新"""
        proposal = self.get_proposal(number)
        if not proposal:
            return False

        content = proposal['content']
        if "## ステータス" not in content:
            content = content.replace("## 概要", f"## ステータス\n\n- ステータス: {status}\n\n## 概要")
        else:
            content = re.sub(
                r"## ステータス\n\n- ステータス: .*",
                f"## ステータス\n\n- ステータス: {status}",
                content
            )

        with open(proposal['path'], 'w', encoding='utf-8') as f:
            f.write(content)

        return True

    def _extract_title(self, content: str) -> str:
        """Markdownコンテンツからタイトルを抽出"""
        match = re.search(r'^# .*提案 #\d+:\s*(.+)$', content, re.MULTILINE)
        if match:
            return match.group(1)
        lines = content.split('\n')
        for line in lines:
            if line.startswith('# '):
                return line[2:]
        return "Untitled"

    def _extract_number(self, filename: str) -> int:
        """ファイル名から番号を抽出"""
        match = re.match(r'(\d{4})-', filename)
        if match:
            return int(match.group(1))
        return 0

    def _slugify(self, text: str) -> str:
        """テキストをスラグに変換"""
        text = text.lower()
        text = re.sub(r'[^\w\s-]', '', text)
        text = re.sub(r'[-\s]+', '-', text)
        return text.strip('-')


def main():
    if len(sys.argv) < 2:
        print("Usage: python proposal_manager.py <command> [args]")
        print("Commands:")
        print("  list                    - List all proposals")
        print("  show <number>           - Show proposal details")
        print("  create <title>          - Create a new proposal")
        print("  status <number> <status> - Update proposal status")
        sys.exit(1)

    manager = ProposalManager()
    command = sys.argv[1]

    if command == "list":
        proposals = manager.list_proposals()
        if not proposals:
            print("No proposals found.")
        else:
            print("Coffee-Stand-DAO Proposals")
            print("=" * 50)
            for p in proposals:
                print(f"#{p['number']}: {p['title']}")
                print(f"  File: {p['filename']}")
                print()

    elif command == "show":
        if len(sys.argv) < 3:
            print("Usage: python proposal_manager.py show <number>")
            sys.exit(1)
        num = int(sys.argv[2])
        proposal = manager.get_proposal(num)
        if proposal:
            print(f"Proposal #{proposal['number']}")
            print(f"Title: {proposal['title']}")
            print(f"File: {proposal['filename']}")
            print("\n" + "=" * 50)
            print(proposal['content'])
        else:
            print(f"Proposal #{num} not found.")

    elif command == "create":
        if len(sys.argv) < 3:
            print("Usage: python proposal_manager.py create <title>")
            sys.exit(1)
        title = ' '.join(sys.argv[2:])
        result = manager.create_proposal(title)
        print(f"Created proposal #{result['number']}: {result['title']}")
        print(f"File: {result['filename']}")

    elif command == "status":
        if len(sys.argv) < 4:
            print("Usage: python proposal_manager.py status <number> <status>")
            sys.exit(1)
        num = int(sys.argv[2])
        status = sys.argv[3]
        if manager.update_status(num, status):
            print(f"Updated proposal #{num} status to: {status}")
        else:
            print(f"Proposal #{num} not found.")

    else:
        print(f"Unknown command: {command}")
        sys.exit(1)


if __name__ == "__main__":
    main()
