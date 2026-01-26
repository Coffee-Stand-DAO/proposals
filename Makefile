.PHONY: help list install test format lint clean

help:
	@echo "Coffee-Stand-DAO Proposals Management"
	@echo ""
	@echo "Available targets:"
	@echo "  make help        - Show this help message"
	@echo "  make list        - List all proposals"
	@echo "  make install     - Install dependencies"
	@echo "  make format      - Format Python code"
	@echo "  make lint        - Lint Python code"
	@echo "  make clean       - Clean build artifacts"
	@echo ""
	@echo "Proposal management:"
	@echo "  make create TITLE='title' - Create a new proposal"
	@echo "  make show NUM=number      - Show proposal details"
	@echo "  make status NUM=number STATUS='status' - Update proposal status"

list:
	@python3 proposal_manager.py list

install:
	@echo "Installing Python dependencies..."
	@pip3 install -e . > /dev/null 2>&1 || echo "No dependencies to install"

format:
	@echo "Formatting Python code..."
	@black proposal_manager.py 2>/dev/null || echo "black not installed"

lint:
	@echo "Linting Python code..."
	@flake8 proposal_manager.py 2>/dev/null || echo "flake8 not installed"

clean:
	@echo "Cleaning build artifacts..."
	@rm -rf __pycache__ *.pyc .pytest_cache
	@rm -rf build dist *.egg-info

create:
	@python3 proposal_manager.py create "$(TITLE)"

show:
	@python3 proposal_manager.py show $(NUM)

status:
	@python3 proposal_manager.py status $(NUM) "$(STATUS)"
