import React from 'react'

const MessageContainer = ({ user }) => {
	return (
		<div
			className={`${
				user
					? 'flex scale-100 opacity-100'
					: 'scale-0 opacity-0 hidden'
			}  flex-col items-center justify-center w-full h-screen transition-all duration-300`}
		>
			<h1 className='flex justify-center font-semibold text-lg'>
				Welcome {user?.userName} 🦁!!!
			</h1>
			<h2 className='flex justify-center font-semibold text-md'>
				Your phone has been verified
			</h2>
		</div>
	);
};

export default MessageContainer