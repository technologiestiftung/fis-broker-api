SHELL = /bin/bash

all: build package

build:
	docker build --tag fis-server:latest .

package:
	docker run \
		-w /var/task/ \
		--name fis \
		-itd \
		fis-server:latest
	docker cp fis:/tmp/package.zip package.zip
	docker stop fis
	docker rm fis

deploy:
	sls deploy

