# Backstage
Backstage is an open platform for building developer portals.

## Prerequisites
You will have to build the containers yourself:
```bash
# REPO=dockeruser/backstage
docker build . -t $REPO
docker push $REPO
```

## Installing the chart
```bash
helm install backstage backstage --set frontend.image.repository=$REPO --set frontend.image.version=latest
```
