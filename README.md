# Kubernetes example - deploy a simple microservices

In this repository, I will show you how to deploy a microservices system using Kubernetes (K8S). Additionally, I’ll include example Kubernetes system code for reference and practical implementation.

## Quick Start
To run the source, please follow these commands.
```
$ kubectl apply -f ./k8s/back-end.config-map.yml
$ kubectl apply -f ./k8s/back-end.deployment.yml
$ kubectl apply -f ./k8s/user-service.deployment.yml
$ kubectl apply -f ./k8s/back-end.service.yml
$ kubectl apply -f ./k8s/user-service.service.yml
$ kubectl port-forward deployment/back-end 3000:3000
```

## Main Contents:

- System Overview
- Build services using Docker
- Deploy using Kubernetes
- Conclusion

## System Overview

The system includes two main services: back-end, and user-service. All of these services is building by using NestJS framework. Rest APIs are used to connect between services.

## Build services using Docker

### 1. Initialize **User Service** by using NestJS.

```
$ npm i -g @nestjs/cli
$ nest new user-service
```

We start writing a set of APIs: create, read, update, and delete.
For simple, I do not use database in this project, and just write data directly to variables in codes.

In **_app.service.ts_** files:
Delare a user variable to store the data of user

```
users = [];
```

Using Javascript command array method to interact with data, then we have a file like below

```typescript
import { Injectable } from "@nestjs/common";
import { UserDto } from "./dto/create-user.dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppService {
  users = [];
  constructor(private readonly configService: ConfigService) {}
  async createUser(createUserDto: UserDto) {
    this.users.push(createUserDto);
    return createUserDto;
  }

  async getUser() {
    return this.users;
  }

  async getUserById(id: string) {
    return this.users.find((item) => item.id === id) || null;
  }

  async deleteByUserId(id: string) {
    const index = this.users.findIndex((item) => item.id === id);
    if (index < 0) {
      return {
        count: 0,
      };
    }

    this.users.splice(index, 1);
    return {
      count: 1,
    };
  }
}
```

### 2. Create Back-End Service

Secondly, we build **Back-End Service** which is responsible for connecting with **Front End**.
Back-End receive requests from Front-End, then call to other services to get infomation if needed. The steps are similar to **User Service** above.

```typescript
$ npm i -g @nestjs/cli
$ nest new back-end
```

We build a set of APIs that are creating, reading, updating and deleting users. All of these APIs will call to **User Service**.

```typescript
import { Injectable } from "@nestjs/common";
import { UserDto } from "./dto/create-user.dto";
import { Axios } from "axios";
import axios from "axios";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppService {
  private axiosInstance: Axios;
  constructor(private readonly configService: ConfigService) {
    this.axiosInstance = axios.create({
      baseURL: this.configService.get("ENDPOINT_USER_SERVICE"),
    });
  }
  async createUser(createUserDto: UserDto) {
    const result = await this.axiosInstance.post("user", createUserDto);
    return result?.data;
  }

  async getUser() {
    const result = await this.axiosInstance.get("user");
    return result?.data;
  }

  async getUserById(id: string) {
    const result = await this.axiosInstance.get(`user/:${id}`);
    return result?.data;
  }

  async deleteUserById(id: string) {
    const result = await this.axiosInstance.get(`user/:${id}`);
    return result?.data;
  }
}
```

### 3. Build Docker Images And Push To DockerHub.

To deploy with Kubernetes, we must build both back-end service and user-service to docker images and push them to dockerhub.
Sign up account DockerHub [here](https://hub.docker.com/).

Login to docker CLI and type username and password.

```
$ docker login
```

To build back-end image, go to back-end directory and run these commands:

```
## Go back-end directory
$ docker build -t back-end:latest .

## Go to user-service
$ docker build -t user-service:latest .
```

Tag docker image.

```
## Go to back-end
$ docker tag back-end:latest <dockerhub-username>/back-end:latest

## Go to user-service
$ docker tag user-service:latest <dockerhub-username>/user-service:latest
```

Push it to docker hub.

```
## Go to back-end
$ docker push <dockerhub-username>/back-end:latest

## Go to user-service
$ docker push <dockerhub-username>/user-service:latest
```

## Deploy Using Kubernetes

To create a K8S cluster in the local computer, Minikube is good choice.

#### 1. Install MiniKube

Follow this guide [here](https://kubernetes.io/vi/docs/tasks/tools/install-minikube/).

#### 2. Store Environment Variables

To store environment avariables like .env file, we use **_config map_** API object. See detail [here](https://kubernetes.io/docs/concepts/configuration/configmap/)

Create a k8s folder, and then create a file named **_back-end.config-map.yml_**

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: back-end-config-map
data:
  ENDPOINT_USER_SERVICE: http://user-service:3001
```

Then, use kubectl command to apply this file.

```
$ kubectl apply -f ./k8s/back-end.config-map.yml
```

#### 3. Deploy Back End Service

Create deployment and service for back-end service

> **_back-end.deployment.yml_** file:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: back-end
  labels:
    app: back-end
spec:
  replicas: 2
  selector:
    matchLabels:
      app: back-end
  template:
    metadata:
      labels:
        app: back-end
    spec:
      containers:
        - name: back-end
          image: <dockerhub-username>/back-end:latest # Tên image Docker của bạn
          ports:
            - containerPort: 3000 # Cổng mà container sẽ nghe
          envFrom:
            - configMapRef:
                name: back-end-config-map
```

> **_back-end.service.yml_** file:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: back-end-service
spec:
  selector:
    app: back-end # Matches the labels of the backend pods
  ports:
    - protocol: TCP
      port: 3000 # Service port
      targetPort: 3000 # Pod containerPort
  type: ClusterIP
```

Apply these of deployment and service

```
$ kubectl apply -f ./k8s/back-end.deployment.yml
$ kubectl apply -f ./k8s/back-end.service.yml
```

#### 3. Deploy User Service

Create deployment and service for User Service

> **_user-service.deployment.yml_** file:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
  labels:
    app: user-service
spec:
  replicas: 2
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
        - name: user-service
          image: <dockerhub-username>/user-service:latest # Tên image Docker của bạn
          ports:
            - containerPort: 3001 # Cổng mà container sẽ nghe
```

> **_user-service.service.yml_** file:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  selector:
    app: user-service # Matches the labels of the backend pods
  ports:
    - protocol: TCP
      port: 3001 # Service port
      targetPort: 3001 # Pod containerPort
  type: ClusterIP
```

Apply these of deployment and service

```
$ kubectl apply -f ./k8s/user-service.deployment.yml
$ kubectl apply -f ./k8s/user-service.service.yml
```

#### 4. Forward ports

To access the back-end (In kubernete cluster), we must forward port from K8S cluster to outside by using this command.

```
$ kubectl port-forward deployment/back-end 3000:3000
```

In cloud, we can use Load Balancer, NodePort, etc.

#### 4. Test

##### Create User

```curl
curl --location 'http://localhost:3000/user' \
--header 'Content-Type: application/json' \
--data '{
    "name": "Thanh Phan"
}'
```

##### Get Users

```curl
curl --location 'http://localhost:3000/user'
```

## Conclusion

Congratulation on completing simple microservices system using Kubernetes. We start coding back-end and user service using NestJS, we dockerize them into images and push to DockerHub. In addition, we also write K8S yaml files and commands to deploy Kubernetes system. Thank you for reading here. If you have any feedback, please contact me.

## Contact

- Author: Thanh Phan
- Email: pvthanh98it@gmail.com
- Website: https://thanhphanv.com
