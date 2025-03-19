import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const getAnalyticsData = async () => {
	const totalUsers = await User.countDocuments(); // จํานวน user
	const totalProducts = await Product.countDocuments(); // จํานวน product

	// จํานวน order
	const salesData = await Order.aggregate([
		{
			$group: {
				_id: null, 
				totalSales: { $sum: 1 }, // จํานวน order
				totalRevenue: { $sum: "$totalAmount" }, // ราคารวม
			},
		},
	]);

	const { totalSales, totalRevenue } = salesData[0] || { totalSales: 0, totalRevenue: 0 };

	return {
		users: totalUsers,
		products: totalProducts,
		totalSales,
		totalRevenue,
	};
};

export const getDailySalesData = async (startDate, endDate) => {
	//getDailySalesData -> ดึงข้อมูลยอดขายย้อนหลัง 7 วัน
	
	try {
		const dailySalesData = await Order.aggregate([
			{
				$match: { //กรองเอกสารตามเงื่อนไข (ย้อนหลัง 7 วัน -> วันที่ปัจจุบัน) 
					createdAt: { 
						$gte: startDate,
						$lte: endDate,
					},
				},
			},
			{
				$group: {
					_id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, // แปลง createdAt เป็นรูปแบบวันที่และเก็บใน id
					sales: { $sum: 1 }, // จํานวน order
					revenue: { $sum: "$totalAmount" }, // ราคารวม
				},
			},
			{ $sort: { _id: 1 } }, // เรียงข้อมูลตามวันที่เก่าไปใหม่
		]);

		// example of dailySalesData
		// [
		// 	{
		// 		_id: "2024-08-18",
		// 		sales: 12,
		// 		revenue: 1450.75
		// 	},
		// ]

		const dateArray = getDatesInRange(startDate, endDate);

		return dateArray.map((date) => {
			const foundData = dailySalesData.find((item) => item._id === date); // หา Order ที่อยู่ในช่วง 7 วันย้อนหลัง - วันที่ปัจจุบัน ที่มี id ตรงกัน

			return {
				date,
				sales: foundData?.sales || 0, // จํานวน order
				revenue: foundData?.revenue || 0, // ราคารวม
			};
		});
	} catch (error) {
		throw error;
	}
};

function getDatesInRange(startDate, endDate) {
	const dates = []; //สร้างอาร์เรย์เพื่อเก็บวันที่
	let currentDate = new Date(startDate);

	//วนลูปเพิ่มวันที่ไปเรื่อย ๆ
	while (currentDate <= endDate) {
		dates.push(currentDate.toISOString().split("T")[0]); //แปลง currentDate เป็น "YYYY-MM-DD"
		currentDate.setDate(currentDate.getDate() + 1); //เพิ่มวันที่ ไปเรื่อยๆ
	}

	return dates;
}
