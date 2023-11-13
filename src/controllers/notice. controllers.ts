import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { logger } from "@/src/middleware/logger";

const prisma = new PrismaClient();

interface Notice {
  subject: string;
  contents: string;
}

export const NoticeCreate = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (!req.body.subject) {
    res.status(400).send({ message: "내용을 비워 둘 수 없습니다!" });
    return;
  }

  // 공지 객체 구성
  const notice: Notice = {
    subject: req.body.subject,
    contents: req.body.contents,
  };

  // 데이터베이스에 공지 생성
  try {
    const createdNotice = await prisma.notices.create({ data: notice });
    res.json(createdNotice);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      console.error(error.message);
    }
    // 일반적인 오류 응답 전송
    res.status(500).send({ message: "오류가 발생했습니다" });
  }
};

export const FindAllNotice = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const page = req.url.split("?")[1].split("page=")[1] || 1;
  const pageSize = 10;
  const offset = (page - 1) * pageSize;
  const totalItems = await prisma.notices.count();
  const totalPages = Math.ceil(totalItems / pageSize);
  const subject = req.query.subject as string;

  try {
    const data = await prisma.notices.findMany({
      where: {
        subject: {
          contains: subject || undefined, // subject가 없으면 undefined로 처리
        },
      },
    });

    res.json(data);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      console.error(error.message);
    }
    res.status(500).send({ message: "오류가 발생했습니다" });
  }
};

export const FindOneNotice = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const id = parseInt(req.query.id as string); // req.params 대신 req.query 사용, 문자열을 숫자로 변환

  try {
    const data = await prisma.notices.findUnique({
      where: { id: id },
    });

    if (data) {
      res.json(data);
    } else {
      res.status(404).send({
        message: `Cannot find notice with id=${id}.`,
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      logger.error(error.message);
    }
    res.status(500).send({
      message: "Error retrieving notice with id=" + id,
    });
  }
};

export const updateNotice = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const id = parseInt(req.query.id as string); // req.params 대신 req.query 사용, 문자열을 숫자로 변환

  try {
    const updatedNotice = await prisma.notices.update({
      where: { id: id },
      data: req.body,
    });

    if (updatedNotice) {
      res.json({ message: "Notice was updated successfully." });
    } else {
      res.json({
        message: `Cannot update notice with id=${id}. Maybe notice was not found or req.body is empty!`,
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      console.error(error.message);
    }
    res.status(500).json({
      message: "Error updating notice with id=" + id,
    });
  }
};

export const deletesNotice = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const id = parseInt(req.query.id as string); // req.params 대신 req.query 사용, 문자열을 숫자로 변환

  try {
    const deletedNotice = await prisma.notices.delete({
      where: { id: id },
    });

    if (deletedNotice) {
      res.json({ message: "Notice was deleted successfully!" });
    } else {
      res.json({
        message: `Cannot delete notice with id=${id}. Maybe notice was not found!`,
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      console.error(error.message);
    }
    res.status(500).json({
      message: "Could not delete notice with id=" + id,
    });
  }
};

export const deleteAllNotice = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const result = await prisma.notices.deleteMany({}); // 빈 조건으로 모든 데이터 삭제

    res.json({ message: `${result.count} notices were deleted successfully!` });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      console.error(error.message);
    }
    res.status(500).json({
      message: "Some error occurred while removing all notices.",
    });
  }
};

export const findAllPublishedNotice = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const data = await prisma.notices.findMany({
      where: { status: "PUBLIC" },
    });

    res.json(data);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      console.error(error.message);
    }
    res.status(500).json({
      message: "Some error occurred while retrieving notices.",
    });
  }
};
