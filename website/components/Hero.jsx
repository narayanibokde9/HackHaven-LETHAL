import Image from "next/image";
import Link from "next/link";

function Hero() {
	return (
		<div className="bg-cover min-h-screen bg-base-200 py-32 pl-32">
			<div className="flex flex-col -ml-24 mr-8 -mt-16 lg:flex-col gap-24">
				<div className="border border-blue-400 bg-white shadow-xl rounded-2xl p-16 flex flex-col w-auto min-w-96 max-lg:text-center text-left max-lg:pb-10">
					<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 justify-center">
						IssueDAO
					</h1>
					<h2 className="text-2xl sm:text-2xl md:text-5xl font-semibold text-blue-500 mb-6">
						A decentralized automated complaint management system
					</h2>
					<h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 justify-center">
						Your issues. Automated complaint management.
					</h3>
					<Link href="/verify">
						<button className="p-3 bg-blue-500 text-primary-content hover:bg-blue-600 transition-all duration-100 rounded-xl">
							Get Verified!
						</button>
					</Link>
				</div>
				<div className="flex flex-row -mt-12 lg:flex-row">
					<div className="w-96 h-94 mx-2 pt-8 bg-white flex flex-col items-center shadow-xl rounded-xl">
						<Image src={"/complaint.png"} height="180" width="180" />
						<div className="z-20 flex flex-col p-4 items-center text-center">
							<h2 className="card-title">Efficient Complaint Management</h2>
							<p>
								Streamlining the process for swift issue reporting and
								resolution.
							</p>
						</div>
					</div>
					<div className="w-96 h-94 mx-2 pt-8 bg-white flex flex-col items-center shadow-xl rounded-xl">
						<Image src={"/transparency.png"} height="180" width="180" />
						<div className="z-20 flex flex-col p-5 items-center text-center">
							<h2 className="card-title">Transparent Review Process</h2>
							<p>
								Ensuring fairness and accountability through open evaluation
								methods.
							</p>
						</div>
					</div>
					<div className="w-96 h-94 mx-2 pt-8 bg-white flex flex-col items-center shadow-xl rounded-xl">
						<Image src={"/review.png"} height="180" width="180" />
						<div className="z-20 flex flex-col p-5 items-center text-center">
							<h2 className="card-title">Collaborative Problem Solving</h2>
							<p>
								Fostering community engagement to tackle challenges
								collectively.
							</p>
						</div>
					</div>
					<div className="w-96 h-94 mx-2 pt-8 bg-white flex flex-col items-center shadow-xl rounded-xl">
						<Image src={"/update.png"} height="180" width="180" />
						<div className="z-20 flex flex-col p-5 items-center text-center">
							<h2 className="card-title">Trackable Progress Updates</h2>
							<p>
								Providing real-time insights into issue resolution progress.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Hero;
