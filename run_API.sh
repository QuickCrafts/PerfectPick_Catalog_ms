#Docker cassandra
docker pull cassandra

#Docker catalog ms
docker build -t perfectpick_catalog_ms .

#Docker network
docker network create perfectpick_catalog_nw

#Docker network containers
docker run --name perfectpick_catalog_db --network perfectpick_catalog_nw -p 9842:9842 -d cassandra
docker run --name perfectpick_catalog_ms --network perfectpick_catalog_nw -p 8001:8001 -d perfectpick_catalog_ms