import * as winston from "winston";

export const logger = winston.createLogger({
  level: "error",
  format: winston.format.json(),
  transports: [
    // 파일에 로그를 기록합니다.
    new winston.transports.File({ filename: "error.log" }),
    // 개발 중에는 콘솔에도 로그를 출력할 수 있습니다.
    new winston.transports.Console({ format: winston.format.simple() }),
  ],
});
