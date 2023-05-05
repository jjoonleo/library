ifneq (,$(wildcard ./.env))
	include .env
	export
	ENV_FILE_PARAM = --env-file .env
endif

build:
	docker compose --env-file ./server/.env up --build  

up:
	docker compose --env-file ./server/.env up

down:
	docker-compose down

volume:
	docker volume inspect mern-library-nginx_mongodb-data