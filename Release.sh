docker login -u$DOCKER_USER -p$DOCKER_PASSWORD
( "./Build.sh" )
docker push blutner/ocomis-user-api:latest
docker logout
