import { ConnectButton } from "@rainbow-me/rainbowkit";
<<<<<<< HEAD

function Navbar() {
    return (
        <div className='navbar bg-base-100'>
            <div className='navbar-start'>
                <div className='dropdown'>
                    <div
                        tabIndex={0}
                        role='button'
                        className='btn btn-ghost lg:hidden'
                    >
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-5 w-5'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth='2'
                                d='M4 6h16M4 12h8m-8 6h16'
                            />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className='menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52'
                    >
                        <li>
                            <a>Item 1</a>
                        </li>
                        <li>
                            <a>Parent</a>
                            <ul className='p-2'>
                                <li>
                                    <a>Submenu 1</a>
                                </li>
                                <li>
                                    <a>Submenu 2</a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a>Item 3</a>
                        </li>
                    </ul>
                </div>
                <a className='btn btn-ghost text-xl'>daisyUI</a>
            </div>
            <div className='navbar-center hidden lg:flex'>
                <ul className='menu menu-horizontal px-1'>
                    <li>
                        <a>Item 1</a>
                    </li>
                    <li>
                        <details>
                            <summary>Parent</summary>
                            <ul className='p-2'>
                                <li>
                                    <a>Submenu 1</a>
                                </li>
                                <li>
                                    <a>Submenu 2</a>
                                </li>
                            </ul>
                        </details>
                    </li>
                    <li>
                        <a>Item 3</a>
                    </li>
                </ul>
            </div>
            <div className='navbar-end'>
                <ConnectButton />
            </div>
        </div>
    );
=======
import Link from "next/link";

function Navbar() {
	return (
		<div className="navbar bg-blue-500 text-primary-content">
			<div className="navbar-start">
				<div className="dropdown">
					<div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M4 6h16M4 12h8m-8 6h16"
							/>
						</svg>
					</div>
					<ul
						tabIndex={0}
						className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
					>
						<li>
							<a>Post an issue</a>
						</li>
						<li>
							<a>View Status</a>
							<ul className="p-2">
								<li>
									<a>Submenu 1</a>
								</li>
								<li>
									<a>Submenu 2</a>
								</li>
							</ul>
						</li>
						<li>
							<a>All Issues</a>
						</li>
					</ul>
				</div>
				<Link href={"/"} className="btn btn-ghost text-xl">daisyUI</Link>
			</div>
			<div className="navbar-center hidden lg:flex">
				<ul className="menu menu-horizontal px-1">
					<li>
						<Link href="/postissue" className="bg-blue-500 hover:bg-blue-600">
							Post an Issue
						</Link>
					</li>
					<li>
						<details>
							<summary>View Status</summary>
							<ul className="p-2">
								<li>
									<a className="text text-blue-500">Grievance Status</a>
								</li>
								<li>
									<a className="text text-blue-500">Appeal Status</a>
								</li>
							</ul>
						</details>
					</li>
					<li>
						<Link href="/issuelist">Check Grievances</Link>
					</li>
				</ul>
			</div>
			<div className="navbar-end">
				<ConnectButton />
			</div>
		</div>
	);
>>>>>>> 5b16c163b83eabd1fe0e51febb054fdfa2ee22ac
}
export default Navbar;
