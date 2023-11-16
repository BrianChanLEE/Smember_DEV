import { id } from "./../../node_modules/next-auth/client/__tests__/helpers/mocks.d";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { PrismaClient } from "@prisma/client";
import { logger } from "@/src/middleware/logger";
import { verifyJwt } from "@/src/lib/jwt";
import { request } from "http";

const prisma = new PrismaClient();

interface Notice {
  subject: string;
  contents: string;
  user_id: number;
  // StartDate: Date;
  // EndDate: Date;
}

export async function noticeCreate(req, userId) {
  try {
    // 토큰 검증
    // const accessToken = req.headers.get("authorization");
    // if (!accessToken || !verifyJwt(accessToken)) {
    //   return new Response(JSON.stringify({ error: "No Authorization" }), {
    //     status: 401,
    //   });
    // }

    // const token = verifyJwt(accessToken);
    // const userId = Number(token.id);

    // 요청 검증
    if (!req.subject) {
      return new Response(
        JSON.stringify({ error: "내용을 비워 둘 수 없습니다!" }),
        { status: 400 }
      );
    }

    // 공지 객체 구성
    const notice: Notice = {
      subject: req.subject,
      contents: req.contents,
      user_id: userId,
      // startDate: req.startDate, // 추가된 필드
      // endDate: req.endDate, // 추가된 필드
    };

    // 공지사항 저장
    const createdNotice = await prisma.notices.create({
      data: notice,
    });

    return new Response(JSON.stringify({ createdNotice }), {
      status: 201,
    });
  } catch (error) {
    // 오류 처리
    console.error("noticeCreate error:", error.message);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}

export async function findAllNotice() {
  try {
    const data = await prisma.notices.findMany({});
    console.log("data :", data);
    return new Response(JSON.stringify(data), { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      console.error("Registration error:", error.message);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
      });
    }
  }
}

export const findNoticeById = async (id: number) => {
  try {
    console.log("xxx", id);
    const data = await prisma.notices.findUnique({
      where: { id: id },
    });
    if (data) {
      return new Response(JSON.stringify(data), { status: 200 });
    }
    return new Response(
      JSON.stringify({ message: `Cannot find notice with id=${id}.` }),
      { status: 404 }
    );
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      console.error("Notice error:", error.message);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
      });
    }
  }
};

export const findAllPublishedNotice = async (req: any) => {
  try {
    const data = await prisma.notices.findMany({
      where: { status: "PUBLIC" },
    });

    if (data) {
      return new Response(JSON.stringify({ message: "successfully.", data }));
    } else {
      return new Response(
        JSON.stringify({
          message: `Cannot Found Published Notice!`,
        })
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      console.error(error.message);
    }
    return new Response(JSON.stringify({ message: "Error Found notice " }), {
      status: 500,
    });
  }
};

//## 데이터 전송이 안되는걸로 보임 (findById기능이 구현되고 있음)
export const updateNotice = async (req, id, data) => {
  try {
    // const requestBody = await req.json();
    // const data = {
    //   subject: requestBody.body,
    //   contents: requestBody.body,
    // };
    const updateData = await prisma.notices.update({
      where: { id },
      data,
    });

    console.log("xxxx :", updateData);
    if (updateData) {
      return new Response(
        JSON.stringify({ message: "successfully.", updateData })
      );
    } else {
      return new Response(
        JSON.stringify({
          message: `Cannot Found Published Notice!`,
        })
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      console.error(error.message);
    }
    return new Response(JSON.stringify({ message: "Error Found notice " }), {
      status: 500,
    });
  }
};

export const deletesNotice = async (id) => {
  try {
    const deletedNotice = await prisma.notices.delete({
      where: { id: id },
    });

    if (deletedNotice) {
      return new Response(
        JSON.stringify({ message: "successfully.", deletedNotice })
      );
    } else {
      return new Response(
        JSON.stringify({
          message: `Delete Notice failure!`,
        })
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      console.error(error.message);
    }
    return new Response(
      JSON.stringify({ message: "Could not delete notice with id=" + id }),
      {
        status: 500,
      }
    );
  }
};
