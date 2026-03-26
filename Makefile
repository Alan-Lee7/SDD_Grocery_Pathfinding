# Makefile for SDD Grocery Pathfinding project

ifeq ($(OS),Windows_NT)
    SHELL := cmd.exe
endif

# Variables
NODE_MODS := node_modules
PACKAGE_JSON := package.json
SENTINEL := $(NODE_MODS)\.install_done

# Determine package manager (pnpm or npm)
PM := $(shell where pnpm >nul 2>&1 && echo pnpm || echo npm)

all: dev

# Track installation status
$(SENTINEL): $(PACKAGE_JSON)
	@echo [MAKE] Dependencies missing or package.json changed.
	@echo [MAKE] Using $(PM) to install...
	$(PM) install
	@echo . > $(SENTINEL)

# Check to see if npm install is done
dev: $(SENTINEL)
	@if not exist "$(NODE_MODS)" ( \
		echo [MAKE] node_modules folder missing. Reinstalling... && \
		$(PM) install && \
		echo . > $(SENTINEL) \
	)
	@echo [MAKE] Starting development server...
	$(PM) run dev

# Run the server
build: $(SENTINEL)
	@echo [MAKE] Building for production...
	$(PM) run build

# Clean build
clean:
	@if exist "$(NODE_MODS)" ( \
		echo [MAKE] Removing node_modules... && \
		rmdir /s /q "$(NODE_MODS)" \
	)
	@if exist "$(SENTINEL)" (del /f /q "$(SENTINEL)")

.PHONY: all dev build clean