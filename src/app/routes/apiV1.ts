import { Express, Router } from "express";
import { driveRoutes } from "../bootstrap/http/controllers/drive/routes/driveRoutes";

export function apiV1(app: Express, router: Router) {
  const driveRoute = driveRoutes(router);
  app.use("/api/v1",driveRoute);
}
