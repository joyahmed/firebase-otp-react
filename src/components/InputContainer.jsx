import React from 'react';
import Input from './Input';
import Label from './Label';

const InputContainer = ({ data, handleData }) => {
	return (
		<>
			<div className='relative flex w-full items-center justify-start autofill:bg-transparent'>
				<Input
					{...{
						type: 'text',
						value: data.userName,
						name: 'userName',
						onChange: handleData,
						placeholder: 'Joy'
					}}
				/>
				<Label text='Name' />
			</div>
			<div className='relative flex w-full items-center justify-start'>
				<Input
					{...{
						type: 'tel',
						value: data.phoneNumber,
						name: 'phoneNumber',
						onChange: handleData,
						placeholder: 'phone'
					}}
				/>
				<Label text='Phone' />
			</div>
		</>
	);
};

export default InputContainer;
