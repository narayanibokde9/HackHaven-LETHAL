import React from "react";

function HashAndError({
	failed,
	processed,
	processing,
	hash,
	isConfirming,
	isConfirmed,
	error,
}) {
	return (
		<div className="rounded p-4">
			<div>
				{hash && (
					<div className="truncate font-bold  border text-center rounded-xl p-2">
						Transaction Hash: {hash}
					</div>
				)}
				{processing && (
					<div className="truncate font-bold text-info border text-center rounded-xl p-2">
						Storing in Polybase
						<span className="loading loading-dots mx-4 loading-m text-info"></span>
					</div>
				)}
				{failed && (
					<div className="text-alert font-bold  border text-center rounded-xl p-2">
						Failed storing in Polybase
					</div>
				)}
				{processed && (
					<div className="truncate font-bold  text-success border text-center rounded-xl p-2">
						Stored in Polybase
					</div>
				)}
				{isConfirming && (
					<div className="text-info font-bold  text-center border rounded-xl p-2">
						Waiting for confirmation
						<span className="loading loading-dots mx-4 loading-m text-info"></span>
					</div>
				)}
				{isConfirmed && (
					<div className="text-success font-bold text-center border rounded-xl p-2">
						Transaction confirmed
					</div>
				)}
				{error && (
					<div className="text-alert font-bold text-center border rounded-xl p-2">
						{error.shortMessage || error.message}
					</div>
				)}
			</div>
		</div>
	);
}

export default HashAndError;
