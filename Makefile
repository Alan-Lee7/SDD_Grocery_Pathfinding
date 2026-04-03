# 1. OS Detection
ifeq ($(OS),Windows_NT)
    # Windows Settings
    RM = del /f /q
    RMDIR = rmdir /s /q
    EXT = .install_done
    # Use backslashes for Windows file paths if calling cmd built-ins
    SENTINEL = node_modules\$(EXT)
    CHECK_DIR = if exist
else
    # Unix/macOS Settings
    RM = rm -f
    RMDIR = rm -rf
    EXT = .install_done
    SENTINEL = node_modules/$(EXT)
    CHECK_DIR = test -d
endif

# 2. Package Manager Detection (Fixed for Cross-Platform)
PM := $(shell pnpm --version >/dev/null 2>&1 && echo pnpm || echo npm)

all: dev

# 3. Installation Logic
$(SENTINEL): package.json
	@echo [MAKE] Dependencies missing or package.json changed.
	@echo [MAKE] Using $(PM) to install...
	$(PM) install
	@echo done > $(SENTINEL)

dev: $(SENTINEL)
	@echo [MAKE] Starting development server...
	$(PM) run dev

build: $(SENTINEL)
	@echo [MAKE] Building for production...
	$(PM) run build

clean:
	@echo [MAKE] Cleaning project...
	$(RMDIR) node_modules
	$(RM) $(SENTINEL)

.PHONY: all dev build clean