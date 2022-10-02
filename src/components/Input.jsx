import React from 'react';

const Input = ({ type, value, name, onChange, placeholder }) => {
	return (
		<input
			type={type}
			value={value}
			name={name}
			onChange={onChange}
			placeholder={placeholder}
			className='peer w-full h-11 placeholder-transparent bg-transparent border-2 border-blue-900 border-opacity-50 px-2 rounded-md focus:border-transparent focus:outline-none focus:border-blue-900 focus:border-opacity-50 autofill:bg-yellow-200'
		/>
	);
};

export default Input;
