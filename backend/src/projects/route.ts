import { Router } from "express"
import verifyToken from "../middlewares/verifyToken.js"
import * as projectController from "./controller.js"

const router = Router()

router.get("/scans", verifyToken, projectController.getScans)
router.delete("/scans", verifyToken, projectController.deleteScan)
router.post("/", verifyToken, projectController.create)
router.get("/", verifyToken, projectController.getAll)
router.get("/:id", verifyToken, projectController.getOne)
router.put("/:id", verifyToken, projectController.update)
router.put("/:id/status", verifyToken, projectController.updateStatus)
router.delete("/:id", verifyToken, projectController.deleteOne)
router.post("/:id/analyze/mozilla", verifyToken, projectController.analyzeMozilla)
router.get("/:id/analyze/mozilla/latest", verifyToken, projectController.getLatestMozilla)
router.post("/:id/analyze/ssl", verifyToken, projectController.analyzeSSL)
router.get("/:id/analyze/ssl/latest", verifyToken, projectController.getLatestSSL)
router.get("/:id/analytics", verifyToken, projectController.getAnalytics)

export default router
