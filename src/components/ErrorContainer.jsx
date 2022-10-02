import React from 'react'

const ErrorContainer = ({ error }) => {
	return (
		<div
			className={`absolute -top-10 ${
				error ? 'translate-y-20' : '-translate-y-20'
			} flex items-center justify-center w-full sm:w-1/3 font-bold bg-red-600 py-4 rounded-md transition-all duration-500`}
		>
			{error}
		</div>
	);
};

export default ErrorContainer