# Scheduler
An web app for managing time

## Deployment

### From docker hub
#### Download `docker-compose.yml` file
```sh
wget -O docker-compose.yml https://raw.githubusercontent.com/ItsOKayCZ/Scheduler/master/docker-compose.yml
```
#### Set authentication tokens
```sh
export SCHEDULER_AUTH_PATH={Here is the path}
export SCHEDULER_AUTH_COOKIE={Here is the cookie}
```
The token `SCHEDULER_AUTH_PATH` is the URL path, where the user will be set with the `SCHEDULER_AUTH_COOKIE` cookie. Without the cookie the user won't be able to use the web app.
#### Start the docker containers
```sh
docker-compose up -d
```

### From source
Clone repo and build docker image
```sh
git clone https://github.com/ItsOKayCZ/Scheduler
cd Scheduler/
docker buildx build -t scheduler .
```
#### Set authentication tokens
```sh
export SCHEDULER_AUTH_PATH={Here is the path}
export SCHEDULER_AUTH_COOKIE={Here is the cookie}
```
The token `SCHEDULER_AUTH_PATH` is the URL path, where the user will be set with the `SCHEDULER_AUTH_COOKIE` cookie. Without the cookie the user won't be able to use the web app.
#### Start the docker containers
```sh
docker-compose -f docker-compose-source.yml up -d
```

## Authenticating
To authenticate, use the path that was set using the `SCHEDULER_AUTH_PATH` token.  
  
For example:  
**SCHEDULER_AUTH_PATH**: `authpath`  
**The URL**: `http://{domain or ip}:3000/authpath`  
