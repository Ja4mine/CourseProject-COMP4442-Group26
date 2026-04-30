#!/bin/sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
LOG_DIR="$ROOT_DIR/logs"
PID_DIR="$LOG_DIR/pids"

compose() {
    if docker compose version >/dev/null 2>&1; then
        docker compose "$@"
    elif command -v docker-compose >/dev/null 2>&1; then
        docker-compose "$@"
    else
        echo "Docker Compose was not found; skipping Docker services."
        return 0
    fi
}

stop_service() {
    service_name="$1"
    pid_file="$PID_DIR/$service_name.pid"

    if [ ! -f "$pid_file" ]; then
        echo "$service_name is not tracked as running."
        return 0
    fi

    pid=$(sed -n '1p' "$pid_file")
    if [ -z "$pid" ] || ! kill -0 "$pid" >/dev/null 2>&1; then
        echo "$service_name is not running; removing stale PID file."
        rm -f "$pid_file"
        return 0
    fi

    echo "Stopping $service_name with PID $pid..."
    kill "$pid" >/dev/null 2>&1 || true

    elapsed=0
    while kill -0 "$pid" >/dev/null 2>&1; do
        if [ "$elapsed" -ge 20 ]; then
            echo "$service_name did not stop in time; forcing shutdown."
            kill -9 "$pid" >/dev/null 2>&1 || true
            break
        fi

        sleep 1
        elapsed=$((elapsed + 1))
    done

    rm -f "$pid_file"
}

stop_service "api-gateway"
stop_service "ai-service"
stop_service "core-service"
stop_service "service-discovery"

if [ "${1:-}" = "--down" ]; then
    echo "Stopping and removing Docker Compose containers..."
    (
        cd "$ROOT_DIR"
        compose down
    )
else
    echo "Stopping Docker Compose services..."
    (
        cd "$ROOT_DIR"
        compose stop nginx rabbitmq redis postgres
    )
fi

echo "Project stopped."
