import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import { getAnalyticsData, getDailySalesData } from "../controllers/analytics.controller.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, async (req, res) => {
	try {
		const analyticsData = await getAnalyticsData();

		//ดึงข้อมูลยอดขายรายวัน
		const endDate = new Date(); //วันที่ปัจจุบัน
		const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000); //ย้อนหลัง 7 วัน

		const dailySalesData = await getDailySalesData(startDate, endDate); //ดึงข้อมูลยอดขาย 

		res.json({
			analyticsData,
			dailySalesData,
		});
	} catch (error) {
		console.log("Error in analytics route", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
});

export default router;
