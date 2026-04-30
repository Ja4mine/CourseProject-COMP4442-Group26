#!/bin/sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
LOG_DIR="$ROOT_DIR/logs"
PID_DIR="$LOG_DIR/pids"
MVN="$ROOT_DIR/mvnw"

mkdir -p "$LOG_DIR" "$PID_DIR"

if [ ! -x "$MVN" ]; then
    echo "Maven wrapper is not executable: $MVN"
    echo "Run: chmod +x mvnw"
    exit 1
fi

compose() {
    if docker compose version >/dev/null 2>&1; then
        docker compose "$@"
    elif command -v docker-compose >/dev/null 2>&1; then
        docker-compose "$@"
    else
        echo "Docker Compose is required but was not found."
        exit 1
    fi
}

port_in_use() {
    lsof -tiTCP:"$1" -sTCP:LISTEN >/dev/null 2>&1
}

require_free_port() {
    service_name="$1"
    port="$2"

    if port_in_use "$port"; then
        echo "Port $port is already in use; cannot start $service_name."
        echo "Use ./stop.sh first, or inspect it with: lsof -i :$port"
        exit 1
    fi
}

wait_for_http() {
    service_name="$1"
    url="$2"
    pid_file="$3"
    timeout_seconds="$4"

    if ! command -v curl >/dev/null 2>&1; then
        echo "curl not found; waiting 10 seconds for $service_name instead."
        sleep 10
        return 0
    fi

    elapsed=0
    while [ "$elapsed" -lt "$timeout_seconds" ]; do
        if curl -fsS "$url" >/dev/null 2>&1; then
            echo "$service_name is ready."
            return 0
        fi

        if [ -f "$pid_file" ]; then
            pid=$(sed -n '1p' "$pid_file")
            if [ -n "$pid" ] && ! kill -0 "$pid" >/dev/null 2>&1; then
                echo "$service_name stopped during startup. Check: $LOG_DIR/$service_name.log"
                exit 1
            fi
        fi

        sleep 2
        elapsed=$((elapsed + 2))
    done

    echo "Timed out waiting for $service_name at $url."
    echo "Check: $LOG_DIR/$service_name.log"
    exit 1
}

start_service() {
    service_name="$1"
    module="$2"
    port="$3"
    health_url="$4"
    timeout_seconds="$5"
    pid_file="$PID_DIR/$service_name.pid"
    log_file="$LOG_DIR/$service_name.log"

    if [ -f "$pid_file" ]; then
        existing_pid=$(sed -n '1p' "$pid_file")
        if [ -n "$existing_pid" ] && kill -0 "$existing_pid" >/dev/null 2>&1; then
            echo "$service_name already appears to be running with PID $existing_pid."
            return 0
        fi
        rm -f "$pid_file"
    fi

    require_free_port "$service_name" "$port"

    echo "Starting $service_name on port $port..."
    (
        cd "$ROOT_DIR"
        nohup "$MVN" -pl "$module" spring-boot:run > "$log_file" 2>&1 &
        echo $! > "$pid_file"
    )

    wait_for_http "$service_name" "$health_url" "$pid_file" "$timeout_seconds"
}

if [ "${SKIP_AI:-0}" != "1" ] && [ -z "${DEEPSEEK_API_KEY:-}" ]; then
    echo "DEEPSEEK_API_KEY is not set."
    echo "Run: export DEEPSEEK_API_KEY=your_key"
    echo "Or skip ai-service for basic UI/API testing: SKIP_AI=1 ./run.sh"
    exit 1
fi

echo "Starting Docker dependencies and nginx..."
compose up -d postgres redis rabbitmq nginx

echo "Building project without tests..."
(
    cd "$ROOT_DIR"
    "$MVN" -DskipTests install
)

start_service "service-discovery" "service-discovery" "8761" "http://localhost:8761/actuator/health" "60"
start_service "core-service" "core-service" "8081" "http://localhost:8081/actuator/health" "90"

if [ "${SKIP_AI:-0}" = "1" ]; then
    echo "Skipping ai-service because SKIP_AI=1."
else
    start_service "ai-service" "ai-service" "8082" "http://localhost:8082/actuator/health" "90"
fi

start_service "api-gateway" "api-gateway" "8080" "http://localhost:8080/actuator/health" "90"

echo ""
echo "Project is running."
echo "Frontend: http://localhost"
echo "Gateway API: http://localhost:8080/api/posts/top?limit=20"
echo "Logs: $LOG_DIR"
echo "Stop with: ./stop.sh"
