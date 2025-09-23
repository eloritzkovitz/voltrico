#!/bin/bash
#
# Usage:
#   ./scripts/load-env-to-vault.sh start   # Start Vault server in dev mode (for local dev only!)
#   ./scripts/load-env-to-vault.sh load    # Load .env into Vault at secret/myapp
#
# Environment variables you can override:
#   ENV_FILE   - Path to .env file (default: .env)
#   VAULT_PATH - Vault path to store secrets (default: secret/myapp)
#   VAULT_ADDR - Vault address (default: http://host.docker.internal:8200)
#   VAULT_TOKEN- Vault token (default: myroot)
#
# WARNING: This script is for local development only. Do NOT use dev mode or this script for production secrets!

# Path to your .env file (relative to project root)
ENV_FILE=".env"
# Vault path to store secrets
VAULT_PATH="secret/myapp"
# Vault address and token
VAULT_ADDR="${VAULT_ADDR:-http://host.docker.internal:8200}"
VAULT_TOKEN="${VAULT_TOKEN:-myroot}"

function start_vault_server() {
  echo "Starting Vault server in dev mode on port 8200..."
  docker run --cap-add=IPC_LOCK -e 'VAULT_DEV_ROOT_TOKEN_ID=myroot' -p 8200:8200 vault
}

function load_env_to_vault() {
  # Check if .env exists
  if [ ! -f "$ENV_FILE" ]; then
    echo "File $ENV_FILE not found!"
    exit 1
  fi

  # Run Vault CLI in Docker to load .env into Vault
  docker run --rm \
    -e VAULT_ADDR="$VAULT_ADDR" \
    -e VAULT_TOKEN="$VAULT_TOKEN" \
    -v "$PWD/$ENV_FILE":/envfile \
    --network=host \
    hashicorp/vault:latest \
    sh -c "vault kv put $VAULT_PATH \$(grep -v '^#' /envfile | xargs)"

  echo "Secrets from $ENV_FILE loaded into Vault at $VAULT_PATH using Dockerized Vault CLI."
}

case "$1" in
  start)
    start_vault_server
    ;;
  load)
    load_env_to_vault
    ;;
  *)
    echo "Usage: $0 {start|load}"
    exit 1
    ;;
esac