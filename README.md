# Nest.js TypeORM Pagination, Filtering, and Sorting Utility
## Description
This project provides a utility module for adding pagination, filtering, and sorting capabilities to TypeORM queries in a Nest.js application. The module is designed to be reusable and easy to integrate into various entities.
## Table of Contents

- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Environment configuration](#environment-configuration)
  - [Running the app](#running-the-app)
  - [Swagger Doc](#swagger-doc)
- [API Endpoints](#api-endpoints)
  - [Rooms Endpoints](#rooms-endpoints)
    - [Get Rooms](#get-rooms)
- [Contributing](#contributing)
- [License](#license)

## Getting Started
### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Hinata-Akiro/Rooms
   cd Rooms
  
2. **Install Dependencies:**

```bash
$ yarn install
```
### Environment configuration

  ```plaintext
  DATABASE_UR 
   ```

### Running the app
```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```
### Swagger Doc
   ```bash
     http://localhost:3000/api/docs
   ```

## Test

```bash
# unit tests
$ yarn run test
```

## API Endpoints

### Rooms Endpoints

**Endpoint:** `/rooms`

**Method:** `GET`

**Description:** get all rooms.

## License
Nest is [MIT licensed](LICENSE).
