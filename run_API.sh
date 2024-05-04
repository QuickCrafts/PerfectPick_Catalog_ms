echo "Delete existing Catalog container"

docker stop perfectpick_catalog_ms
docker rm perfectpick_catalog_ms

echo "Delete existing Catalog image"

docker rmi perfectpick_catalog_ms

echo "Up Cassandra DB server"
#Docker cassandra
docker pull cassandra

echo "Build image Catalog"
#Docker catalog ms
docker build -t perfectpick_catalog_ms .

echo "running docker..."
#Docker network containers
docker run --name perfectpick_catalog_db --network perfectpicknetwork -p 9842:9842 -d cassandra
docker run --name perfectpick_catalog_ms --network perfectpicknetwork -p 8001:8001 -d perfectpick_catalog_ms