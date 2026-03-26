# Force CMD on Windows to prevent shell mismatch
ifeq ($(OS),Windows_NT)
    SHELL := cmd.exe
endif

# Variables
NODE_MODS := node_modules
PACKAGE_JSON := package.json
SENTINEL := $(NODE_MODS)\.install_done

# Detect if the user has pnpm or npm (suppressing "where" errors)
PM := $(shell where pnpm >nul 2>&1 && echo pnpm || echo npm)

# Default target
all: dev

# 1. Check if node_modules exists or package.json changed
# This installs dependencies only when necessary
$(SENTINEL): $(PACKAGE_JSON)
	@echo [MAKE] Dependencies missing or package.json changed.
	@echo [MAKE] Using $(PM) to install...
	$(PM) install
	@echo . > $(SENTINEL)

# 2. Start the dev server
# This checks for the folder itself as a safety net before running
dev: $(SENTINEL)
	@if not exist "$(NODE_MODS)" ( \
		echo [MAKE] node_modules folder missing. Reinstalling... && \
		$(PM) install && \
		echo . > $(SENTINEL) \
	)
	@echo [MAKE] Starting development server...
	$(PM) run dev

# 3. Build for production
build: $(SENTINEL)
	@echo [MAKE] Building for production...
	$(PM) run build

# 4. Clean up the project
clean:
	@if exist "$(NODE_MODS)" ( \
		echo [MAKE] Removing node_modules... && \
		rmdir /s /q "$(NODE_MODS)" \
	)
	@if exist "$(SENTINEL)" (del /f /q "$(SENTINEL)")

.PHONY: all dev build clean