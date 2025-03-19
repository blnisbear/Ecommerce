import { Link } from "react-router-dom";

const NotFoundPage = () => {
	return (
		<div
			className='min-h-screen flex flex-col justify-center items-center text-white'>
			<main className='text-center error-page--content z-10 mb-40'>
				<h1 className='text-9xl font-semibold mb-4'>404</h1>
				<p className='mb-6 text-xl'>
					Sorry, we can't find that page. You'll find lots to explore on the home page.
				</p>
				<div className="flex justify-center mt-5">
					<Link to={"/"} className='text-white py-2 px-4 rounded border border-gray-300 hover:bg-gray-700'>
						<button className="font-semibold ">
							Go Back &rarr;
						</button>
					</Link>
				</div>
			</main>
		</div>
	);
};
export default NotFoundPage;
