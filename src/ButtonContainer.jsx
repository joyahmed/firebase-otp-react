import React from 'react';

const ButtonContainer = ({ onClick, text, enabled }) => {
	return (
		<div className='flex justify-center w-full'>
			<button
				className={`flex items-center justify-center w-3/4 py-2 rounded-md bg-blue-900 hover:scale-105 font-semibold transition-all duration-300 ${
					enabled
						? 'opacity-100 cursor-pointer'
						: 'cursor-not-allowed opacity-50'
				}`}
				onClick={onClick}
			>
				{text}
			</button>
		</div>
	);
};

export default ButtonContainer;
