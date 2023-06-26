---
categories: [Trouble Shooting]
tags: [Campus7]
img_path: /assets/lib/post-img/
mermaid: true
---

# Campus7

- [Elice Second Project](https://kdt-gitlab.elice.io/sw_track/class_04/web_2_project/team04)
- [GitHub](https://github.com/leekh8/CodeMentor)

## 주제 선정, 기획

- 주제 선정, 기획이 매우 어려웠다
- 7명이 할만한 주제 중 실현 가능하지만 너무 간단하진 않은 주제 선정에 시간이 오래 걸렸다
- 주제를 선정하고 나서도 이름을 어떤것으로 할 지 결정하는 데 시간이 오래 결렸다

## 기술 스택

- 이전 프로젝트에서 사용했던 JavaScript 대신 TypeScript를 활용해보기로 했지만 오피스 아워때 코치님이 JavaScript를 제대로 알고 가는 것이 더 좋은 방향이라고 추천해줬다
- 그리고 오히려 SQL 공부를 위해 mongoose 대신 MySQL을 추천해줬다
- 그 외에는 이전과 동일하게 express, node.js를 활용하기로 했다

## ERD

- 처음에는 커뮤니티 기능 (글쓰기, 댓글 등)에 대해서도 이야기가 나왔기 때문에 ERD 정리가 어려웠다
- 프론트엔드와 이야기를 통해 커뮤니티 기능은 후순위로 미루고 선순위 먼저 정리하기로 이야기했다
- 오피스아워를 통해 User, Hint, Problem, User-Problem 이렇게 4개의 table로 정리하기로 했다

## 초반 세팅

- 사실 TypeScript로 세팅을 해놓은 이후에 JS로 변경하라고 하셔서 다시 변경하는데 시간이 소요되었다

  - TS로 작성한 index를 npm으로 돌리려니 TS를 JS로 compile build를 해주어야 했다
  - TS로 작성한 파일들을 compile 하여 dist directory에 넣어준 뒤 실행시키는 방식으로 해주었다
  - 그를 위해 JS를 위한 package.json, TS를 위한 tsconfig.json 이 별도로 필요했다
  - 또 사용하기로 한 CommonJS 문법 사용을 위해 tsconfig.json에서 `"module": "commonjs", "esModuleInterop": true,` 문구를 적어주고, package.json에서 `"type": "module",` 설정을 삭제 해주어야 했다
  - 실행 시 매번 build를 해주기 귀찮아서 `"start:dev": "npm run build && nodemon dist/index.js",` 문구를 package.json에 추가했다

  ```json
  <!-- tsconfig.json -->
  {
    "compilerOptions": {
      "target": "ES2018",
      "module": "commonjs",
      "outDir": "dist",
      "strict": true,
      "esModuleInterop": true,
      "moduleResolution": "node"
    },
    "include": ["src", "index.ts"],
    "exclude": ["node_modules"]
  }
  ```

  ```json
  <!-- package.json -->
  {
    "name": "campus-seven",
    "version": "1.0.0",
    "description": "back-end",
    "main": "dist/index.js",
    "scripts": {
      "start": "node dist/index.js",
      "start:dev": "npm run build && nodemon dist/index.js",
      "test": "echo \"Error: no test specified\" && exit 1",
      "build": "tsc",
      "prestart": "npm run build",
      "format": "prettier --write ."
    },
    "repository": {
      "type": "git",
      "url": "https://kdt-gitlab.elice.io/sw_track/class_04/web_2_project/team04/backend.git"
    },
    "author": "",
    "license": "MIT",
    "dependencies": {
      "cors": "^2.8.5",
      "dotenv": "^16.0.3",
      "express": "^4.18.2",
      "jsonwebtoken": "^9.0.0",
      "mongoose": "^7.2.1",
      "tsc": "^2.0.4"
    },
    "devDependencies": {
      "@types/cors": "^2.8.13",
      "@types/express": "^4.17.17",
      "nodemon": "^2.0.22",
      "prettier": "^2.8.8",
      "ts-node": "^10.9.1",
      "typescript": "^5.0.4"
    }
  }
  ```

  ```typescript
  <!-- index.ts -->
    require("dotenv").config();
    const http = require("http");
    const createApp = require("./src/app");

    const PORT = parseInt(process.env.PORT || "5000", 10);

    const server = http.createServer(createApp);

    server.listen(PORT, () => {
      console.log(`server start. PORT: ${PORT}`);
    });
  ```

  ```typescript
  <!-- app.ts -->
    const express = require("express");
    const cors = require("cors");
    const dotenv = require("dotenv");

    dotenv.config();

    const app = express();

    // Middleware
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Routes
    app.get(
      "/health",
      (req: any, res: { json: (arg0: { status: string }) => void }, next: any) => {
        res.json({ status: "Hello, Campus Seven!" });
      }
    );

    // Error handler middleware
    app.use(
      (
        err: { stack: any },
        req: any,
        res: {
          status: (arg0: number) => {
            (): any;
            new (): any;
            json: { (arg0: { error: string }): void; new (): any };
          };
        },
        next: any
      ) => {
        console.error(err.stack);
        res.status(500).json({ error: "Internal Server Error" });
      }
    );

    module.exports = app;
  ```

  - type을 매번 지정해주는 것이 혼란스럽기는 했다
  - 오류도 많이 발생했다 `Parameter 'req' implicitly has an 'any' type`
    ```typescript
    app.get("/health", (req: Request, res: Response) => {
      res.json({ status: "Hello, Campus Seven!" });
    });
    ```
  - 이런식으로 수정해서 돌렸다

  - 이런 오류도 발생했다

  ```bash
    Cannot redeclare block-scoped variable 'Request'.ts(2451)
    lib.dom.d.ts(18590, 11): 'Request' was also declared here.
    lib.dom.d.ts(18673, 13): and here.
  ```

  - name space들을 다르게 지정해주는 것으로 해결했다

- 이후에 JS로 바꾸게 되어 다시 설정해주었다

  ```javascript
  <!-- user-model.js -->
  const mongoose = require("mongoose");
  const userSchema = require("./user.schema");

  const UserModel = mongoose.Schema("User", userSchema);

  const userModel = {
    async create(userInfo) {
      try {
        const createdNewUser = await UserModel.create(userInfo);
        return createdNewUser;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to create new user");
      }
    },

    async getById(userId) {
      try {
        const user = await UserModel.findById(userId);
        if (!user) {
          throw new Error("User not found");
        }
        return user;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to get the user");
      }
    },

    async update(userId, userInfo) {
      try {
        const updatedUser = await UserModel.findByIdAndUpdate(
          userId,
          userInfo,
          {
            new: true
          }
        );
        if (!updatedUser) {
          throw new Error("User not found");
        }
        return updatedUser;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to update the user");
      }
    },

    async delete(userId) {
      try {
        const deletedUser = await UserModel.findByIdAndRemove(userId);
        if (!deletedUser) {
          throw new Error("User not found");
        }
      } catch (error) {
        console.error(error);
        throw new Error("Failed to delete the user");
      }
    }
  };

  module.exports = userModel;
  ```

  ```javascript
  <!-- user-controller.js -->
  const userModel = require("../models/user.model");
  const userService = require("../services/user.service");

  const userController = {
    createUser: async (req, res, next) => {
      try {
        const user = req.body;
        const newUser = await userService.create(user);
        res.status(201).json(newUser);
      } catch (error) {
        next(error);
      }
    },

    getUser: async (req, res, next) => {
      try {
        const { userId } = req.params;

        const user = await userMuserServiceodel.getById(userId);

        res.status(200).json(user);
      } catch (error) {
        next(error);
      }
    },

    updateUser: async (req, res, next) => {
      try {
        const { userId } = req.params;
        const { userName, password, email } = req.body;

        const updatedUser = await userService.update(userId, {
          userName,
          password,
          email
        });

        res.json(updatedUser);
      } catch (error) {
        next(error);
      }
    },

    deleteUser: async (req, res, next) => {
      try {
        const { userId } = req.params;

        await userService.delete(userId);

        res.json({ message: "User deleted successfully" });
      } catch (error) {
        next(error);
      }
    }
  };

  module.exports = userController;
  ```

  ```javascript
  <!-- user-service.js -->
  const userModel = require("../models/user.model");

  const userService = {
    async createUser(userInfo) {
      try {
        // 사용자 정보 유효성 검사 등 필요한 처리

        const newUser = await userModel.create(userInfo);

        return newUser;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to create a new user");
      }
    },

    async getUser(userId) {
      try {
        const user = await userModel.getById(userId);

        return user;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to get the user");
      }
    },

    async updateUser(userId, userInfo) {
      try {
        // 사용자 정보 유효성 검사 등 필요한 처리

        const updatedUser = await userModel.update(userId, userInfo);

        return updatedUser;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to update the user");
      }
    },

    async deleteUser(userId) {
      try {
        await userModel.delete(userId);
      } catch (error) {
        console.error(error);
        throw new Error("Failed to delete the user");
      }
    }
  };

  module.exports = userService;
  ```

  ```javascript
  <!-- user-router.js -->
  const express = require("express");

  const userController = require("../controllers/user.controller");

  const userRouter = express.Router();

  module.exports = userRouter;
  ```

## db 모델링

- mongoose를 사용하는 줄 알고 아래처럼 만들어놨었다
- ERD 설계를 하고 나니 DB 설계는 빨리 될 줄 알았는데 또 그렇게 빨리 되지는 않았다

  ```javascript
  const mongoose = require("mongoose");

  // +-----------+----------+----------+-----+----------------+-----------------------------+
  // | Field     | Type     | Required | Key | Default        | Extra                       |
  // +-----------+----------+----------+-----+----------------+-----------------------------+
  // | id        | ObjectId | true     | PK  | Auto generated | 사용자 고유 id               |
  // | userName  | String   | true     |     |                |                             |
  // | password  | String   | true     |     |                |                             |
  // | email     | String   | true     |     |                |                             |
  // | image     | String   |          |     |                | 프로필 사진 URL              |
  // | grade     | String   | true     |     | general        |                             |
  // | point     | Number   |          |     |                |                             |
  // | timer     | Number   |          | RK  |                | 난이도 별 문제 풀이 시간      |
  // | timerTotal| Number   |          |     |                | 문제 별 타이머 사용 누적 시간 |
  // | createdAt | Date     |          |     | Date.now()     |                             |
  // | updatedAt | Date     |          |     | Date.now()     |                             |
  // +-----------+----------+-----+------+-----+--------------+-----------------------------+

  const userSchema = new mongoose.Schema(
    {
      userName: {
        type: String,
        required: true
      },
      password: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      image: {
        type: String
      },
      grade: {
        type: String,
        enum: ["general", "admin"],
        default: "general",
        required: true
      },
      point: {
        type: Number,
        default: 0
      },
      timer: [
        {
          type: Number,
          ref: "Problem"
        }
      ],
      timerTotal: {
        type: Number
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }
    },
    {
      collection: "users",
      timestamps: true
    }
  );

  module.exports = userSchema;
  ```

  - MySQL을 mysql2를 활용해 사용하기로 했다
  - mysql2를 통해 db 설정을 해주었다

  ```javascript
  <!-- db.js -->
    const mysql = require("mysql2");
    require("dotenv").config();

    const connection = mysql.createPool({
      host: process.env.DB_HOST || process.env.LOCAL_DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE
    });

    module.exports = connection;
  ```

  - MySQL로 변경하면서 ERD부터 수정이 필요했다
  - 그래도 table도 만들어주었다

  ```sql
  CREATE TABLE
    User (
        id INT PRIMARY KEY AUTO_INCREMENT,
        userName VARCHAR(45),
        password VARCHAR(45),
        email VARCHAR(45),
        image VARCHAR(45),
        grade ENUM('general', 'admin'),
        point INT,
        createdAt DATETIME,
        updatedAt DATETIME,
    );
  ```

## 개발

- 개발만 하면 될 줄 알았는데 아니었다
- 중간에 다른 백 한분이 자리를 비우셔서 한주동안 혼자 백을 담당했어야 했다

### 미들웨어

- dotenv의 환경 변수들을 config/index.js로 한번 걸러서 사용하기로 했다
- 한번에 환경 변수들을 처리해서 여기저기 dotenv를 부르는 일이 없어지도록 했다

- 오류의 중앙 처리를 위해 에러 핸들러를 작성하였다
- 그런데 AppError 작성 후 error handler도 작성해줘야 하는 줄 알았는데 이미 default error handler가 있기 때문에 굳이 따로 작성할 필요가 없었다

```javascript
// AppError.js
class AppError extends Error {
  constructor(errorName, httpCode, description) {
    super(description);

    this.errorName = errorName;
    this.httpCode = validateHttpCode(httpCode);
    Error.captureStackTrace(this, this.constructor);
  }
}

function validateHttpCode(httpCode) {
  const parsedHttpCode = parseInt(httpCode, 10);
  if (
    !Number.isInteger(parsedHttpCode) ||
    parsedHttpCode < 100 ||
    parsedHttpCode > 599
  ) {
    throw new Error(
      `Invalid httpCode: ${parsedHttpCode}. The httpCode must be an integer between 100 and 599.`
    );
  }
  return parsedHttpCode;
}

module.exports = AppError;
```

- 이미지 업로드 기능을 `multer`를 이용해 작성했다

```javascript
// upload.js
const multer = require("multer");
console.log(process.cwd());

// Multer 설정 및 옵션
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 업로드된 파일 저장 경로 설정
    cb(null, `${process.cwd()}/uploads`);
  },
  filename: (req, file, cb) => {
    // 업로드된 파일 이름 설정
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// 사용자 프로필 사진 업로드 미들웨어
// const uploadProfile = upload.single('image');

module.exports = { upload };
```

- logger도 pino를 이용해 작성했다

```javascript
const pino = require("pino");
const pretty = require("pino-pretty");
const config = require("../config/index");

let logger;

const logOptions = {
  level: "error",
  prettifier: pretty
};

// console.log(config.nodeEnv);

if (config.nodeEnv === "development") {
  logOptions.pretty = {
    colorize: true,
    translateTime: "yyyy-mm-dd HH:MM:ss"
  };

  logOptions.level = "info";
}

logger = pino(logOptions);

module.exports = logger;
```

### db

- NOT NULL, TIMESTAMP 등의 기능을 추가해줬다

### API 명세

- 프론트와 주고받는 data type을 정리하기 위해 API 명세를 POSTMAN으로 만들었다
- 이 과정에서 프론트와 소통하는데 약간 어려움이 있었다
- 그래서 모든 정보를 이메일을 쿼리 스트링으로 주고받는 것으로 정리했다

## 느낀점

- 개발 상의 오류도 힘들었지만 사람 간의 소통이 제일 어려웠다
- 프론트와 주고받을 data type을 정리하는 것도 어려웠지만 개발 프로세스가 다른 점에서도 그랬다
- 꼼꼼히 ERD와 와이어프레임을 비교했어야 했는데 그 부분에서 아쉬움이 있었다
- 또 중간에 혼자 백을 해야할 때 막막함도 느꼈다
- 다음번에는 미리미리 소통을 잘 해서 개발 프로세스를 잘 맞춰야겠다
