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

Firstly, initialize **User Service** by using NestJS.

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
