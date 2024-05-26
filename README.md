# Nest.js TypeORM Pagination, Filtering, and Sorting Utility
## Description
This project provides a utility module for adding pagination, filtering, and sorting capabilities to TypeORM queries in a Nest.js application. The module is designed to be reusable and easy to integrate into various entities.
## Table of Contents

- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Environment configuration](#environment-configuration)
  - [Running the app](#running-the-app)
  - [Swagger Doc](#swagger-doc)
  - [Live Link](#live-link)
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

### Live Link
   ```plaintext
     [live-link](https://rooms-2jb4.onrender.com)
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

**Endpoint:** `api/v1/rooms`

**Method:** `GET`

**Description:** get all rooms.

**Request Query:**

```json

  "page": "1",
  "limit": "10",
  "filters": [{"field": "userId", "value":1, "operator": "equals"}],
  "sort": [{"field": "capacity", "order": "DESC"}]

```
**Responses:**

```json
{
    "error": false,
    "statusCode": 200,
    "message": "Rooms retrieved successfully",
    "data": {
        "data": [
            {
                "id": 3,
                "createdAt": "2024-05-25T15:35:01.750Z",
                "updatedAt": "2024-05-25T15:35:01.750Z",
                "deletedAt": null,
                "name": "Workshop Room C",
                "capacity": 20,
                "userId": 1
            },
            {
                "id": 23,
                "createdAt": "2024-05-25T15:50:13.636Z",
                "updatedAt": "2024-05-25T15:50:13.636Z",
                "deletedAt": null,
                "name": "Workshop Room C",
                "capacity": 20,
                "userId": 1
            }
        ],
        "meta": {
            "page": 1,
            "limit": 2,
            "itemCount": 12,
            "pageCount": 6,
            "hasNext": true,
            "hasPrevious": false
        }
    }
}
```
## License
Nest is [MIT licensed](LICENSE).
