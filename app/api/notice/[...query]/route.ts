import * as noticeControllers from "@/src/controllers/notice. controllers";
import { NextApiRequest, NextApiResponse } from "next";
import { NextApiRequestQuery } from "next/dist/server/api-utils";
import { logger } from "@/src/middleware/logger";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  query: NextApiRequestQuery
) => {
  const method = req.method;
  const query1 = req.query.param1;
  const query2 = req.query.param2;

  switch (method) {
    case "GET":
      try {
        if (query1 === "FindAllNotice") {
          const allNotice = await noticeControllers.FindAllNotice(req, res);
          res.json(allNotice);
        } else if (query1 === "FindOneNotice") {
          const getNotice = await noticeControllers.FindOneNotice(req, res);
          res.json(getNotice);
        } else if (query1 === "PublishedNotice") {
          const publishedNotice =
            await noticeControllers.findAllPublishedNotice(req, res);
          res.json(publishedNotice);
        }
      } catch (error) {
        if (error instanceof Error) {
          logger.error(error.message);
          res.status(500).json({ message: "Internal Server Error" });
        }
      }
      break;

    case "PUT":
      if (query1 === "editNotice") {
        try {
          const Update = await noticeControllers.updateNotice(req, res);
          res.json(Update);
        } catch (error) {
          if (error instanceof Error) {
            logger.error(error.message);
          }
          res.status(500).json({ message: "Internal Server Error" });
        }
      }
      break;

    case "DELETE":
      try {
        if (query1 === "deleteNotice") {
          const deleteOneResult = await noticeControllers.deletesNotice(
            req,
            res
          );
          res.json(deleteOneResult);
        } else if (query1 === "deleteAllNotice") {
          const deleteAllResult = await noticeControllers.deleteAllNotice(
            req,
            res
          );
          res.json(deleteAllResult);
        }
      } catch (error) {
        if (error instanceof Error) {
          logger.error(error.message);
        }
        res.status(500).json({ message: "Internal Server Error" });
      }
      break;
  }
};
