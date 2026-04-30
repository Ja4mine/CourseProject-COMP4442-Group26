#!/bin/sh

mvn clean install

cd service-discovery && mvn spring-boot:run &

sleep 1

cd core-service && mvn spring-boot:run &
cd ai-service && mvn spring-boot:run &

sleep 10

cd api-gateway && mvn spring-boot:run &
