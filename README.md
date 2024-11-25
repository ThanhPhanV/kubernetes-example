# Kubernetes Example

In this articles, I will show an example of deploying a microservices system by using Kubernetes (also called K8S).

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
    return result;
  }

  async getUser() {
    const result = await this.axiosInstance.get("user");
    return result;
  }

  async getUserById(id: string) {
    const result = await this.axiosInstance.get(`user/:${id}`);
    return result;
  }

  async deleteUserById(id: string) {
    const result = await this.axiosInstance.get(`user/:${id}`);
    return result;
  }
}
```

### 3. Build Docker Images And Push To DockerHub.

To deploy with Kubernetes, we must build both back-end service and user-service to docker images and push them to dockerhub.
Sign up account DockerHub here. https://hub.docker.com/

Login to docker CLI and type username and password.

```
$ docker login
```

To build back-end image, go to back-end directory and run these commands:

```
## Go back-end directory
$ docker build -t back-end:latest .
```

Tag docker image.

```
docker tag back-end:latest <dockerhub-username>/back-end:latest
```

Push it to docker hub.

```
docker push <dockerhub-username>/back-end:latest
```

Then, build **user-service**

```
## Go to user-service directory
$ docker build -t user-service:latest .
```

Tag docker image.

```
docker tag user-service:latest <dockerhub-username>/user-service:latest
```

Push it to docker hub.

```
docker push <dockerhub-username>/user-service:latest
```
