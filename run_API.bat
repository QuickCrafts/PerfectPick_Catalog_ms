rem Docker cassandra
docker pull cassandra

rem Docker catalog ms
docker build -t perfectpick_catalog_ms .

rem Docker network containers
docker run --name perfectpick_catalog_db --network perfectpicknetwork -p 9842:9842 -d cassandra
docker run --name perfectpick_catalog_ms --network perfectpicknetwork -p 8001:8001 -d perfectpick_catalog_ms