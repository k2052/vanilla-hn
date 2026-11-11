#!/usr/bin/env bash
# AI: warning this script written entirely by Gemini 3.8 Flash
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

BRANCH="${BRANCH:-gh-pages}"
REMOTE="${REMOTE:-origin}"
DIST_DIR="${DIST_DIR:-dist}"
BUILD=true
PUSH=true
MESSAGE=""

show_help() {
  cat <<EOF
Usage: $(basename "$0") [options]

Deploy built client assets to a git branch (default: gh-pages).

Options:
  -b, --branch <name>   Target branch (default: gh-pages)
  -r, --remote <name>   Git remote (default: origin)
  -m, --message <msg>   Commit message
  -d, --dir <dir>       Directory containing built client assets (default: dist)
  --no-build            Skip running client build before deploying
  --no-push             Create commit on local branch without pushing
  -h, --help            Show this help message
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    -b|--branch)
      BRANCH="$2"
      shift 2
      ;;
    -r|--remote)
      REMOTE="$2"
      shift 2
      ;;
    -m|--message)
      MESSAGE="$2"
      shift 2
      ;;
    -d|--dir)
      DIST_DIR="$2"
      shift 2
      ;;
    --no-build)
      BUILD=false
      shift
      ;;
    --no-push)
      PUSH=false
      shift
      ;;
    -h|--help)
      show_help
      exit 0
      ;;
    *)
      echo "Error: Unknown argument: $1" >&2
      show_help >&2
      exit 1
      ;;
  esac
done

if [ "$BUILD" = true ]; then
  echo "Building client assets..."
  npm run build:client
fi

if [ ! -d "$DIST_DIR" ]; then
  echo "Error: Build directory '$DIST_DIR' does not exist." >&2
  exit 1
fi

if [ ! -f "$DIST_DIR/index.html" ]; then
  echo "Error: '$DIST_DIR/index.html' not found. Run client build first." >&2
  exit 1
fi

STAGING_DIR="$(mktemp -d)"
TEMP_INDEX="$(mktemp -u)"

cleanup() {
  rm -rf "$STAGING_DIR"
  rm -f "$TEMP_INDEX"
}
trap cleanup EXIT

# Copy client assets to staging directory, omitting any server bundle
cp -R "$DIST_DIR"/. "$STAGING_DIR"/
rm -rf "$STAGING_DIR/server"

# Ensure 404.html exists for GitHub Pages SPA client routing fallback
if [ ! -f "$STAGING_DIR/404.html" ]; then
  cp "$STAGING_DIR/index.html" "$STAGING_DIR/404.html"
fi

# Ensure .nojekyll exists to bypass Jekyll processing on GitHub Pages
touch "$STAGING_DIR/.nojekyll"

# Copy stats.html if visualizer generated one in the repository root
if [ -f "stats.html" ] && [ ! -f "$STAGING_DIR/stats.html" ]; then
  cp "stats.html" "$STAGING_DIR/stats.html"
fi

# Stage files in isolated git index
GIT_INDEX_FILE="$TEMP_INDEX" git --work-tree="$STAGING_DIR" add -A
TREE="$(GIT_INDEX_FILE="$TEMP_INDEX" git write-tree)"
rm -f "$TEMP_INDEX"

# Fetch remote branch if reachable to ensure fast-forward parent
if git ls-remote --exit-code "$REMOTE" "refs/heads/$BRANCH" >/dev/null 2>&1; then
  git fetch "$REMOTE" "$BRANCH":"refs/remotes/$REMOTE/$BRANCH" --quiet 2>/dev/null || true
fi

PARENT=""
REMOTE_COMMIT=""
if git rev-parse --verify --quiet "refs/heads/$BRANCH" >/dev/null 2>&1; then
  LOCAL_COMMIT="$(git rev-parse "refs/heads/$BRANCH")"
  if git rev-parse --verify --quiet "refs/remotes/$REMOTE/$BRANCH" >/dev/null 2>&1; then
    REMOTE_COMMIT="$(git rev-parse "refs/remotes/$REMOTE/$BRANCH")"
    if [ "$LOCAL_COMMIT" = "$REMOTE_COMMIT" ]; then
      PARENT="$LOCAL_COMMIT"
    elif git merge-base --is-ancestor "$REMOTE_COMMIT" "$LOCAL_COMMIT" 2>/dev/null; then
      PARENT="$LOCAL_COMMIT"
    elif git merge-base --is-ancestor "$LOCAL_COMMIT" "$REMOTE_COMMIT" 2>/dev/null; then
      PARENT="$REMOTE_COMMIT"
    else
      PARENT="$REMOTE_COMMIT"
    fi
  else
    PARENT="$LOCAL_COMMIT"
  fi
elif git rev-parse --verify --quiet "refs/remotes/$REMOTE/$BRANCH" >/dev/null 2>&1; then
  REMOTE_COMMIT="$(git rev-parse "refs/remotes/$REMOTE/$BRANCH")"
  PARENT="$REMOTE_COMMIT"
fi

if [ -n "$PARENT" ]; then
  PARENT_TREE="$(git rev-parse "${PARENT}^{tree}" 2>/dev/null || true)"
  if [ "$PARENT_TREE" = "$TREE" ]; then
    echo "No changes to deploy: tree matches $PARENT ($BRANCH)."
    if [ "$PUSH" = true ] && [ -n "$REMOTE_COMMIT" ] && [ "$PARENT" != "$REMOTE_COMMIT" ]; then
      echo "Pushing local $BRANCH to $REMOTE..."
      git push "$REMOTE" "$BRANCH"
      echo "Successfully deployed to $REMOTE/$BRANCH"
    fi
    exit 0
  fi
fi

HEAD_COMMIT="$(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')"
if [ -z "$MESSAGE" ]; then
  MESSAGE="Deploy to ${BRANCH} from ${HEAD_COMMIT} ($(date -u +'%Y-%m-%d %H:%M:%S UTC'))"
fi

PARENT_ARGS=()
if [ -n "$PARENT" ]; then
  PARENT_ARGS=("-p" "$PARENT")
fi

COMMIT="$(git commit-tree "$TREE" "${PARENT_ARGS[@]}" -m "$MESSAGE")"
git update-ref "refs/heads/$BRANCH" "$COMMIT"
echo "Created commit $COMMIT on branch $BRANCH"

if [ "$PUSH" = true ]; then
  echo "Pushing to $REMOTE $BRANCH..."
  git push "$REMOTE" "$BRANCH"
  echo "Successfully deployed to $REMOTE/$BRANCH"
else
  echo "Push skipped (--no-push). Local branch $BRANCH updated to $COMMIT."
fi
