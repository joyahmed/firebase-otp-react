import React from 'react';
import ButtonContainer from '../ButtonContainer';

const OtpContainer = ({
	expandForm,
	otpField,
	activeOtpIndex,
	inputRef,
	handleOnChange,
	handleOnKeyDown,
	handleVerifyOtp,
	otp,
	requestOTP,
	data
}) => {
	return (
		<>
			{expandForm ? (
				<div className='flex flex-col w-full h-auto space-y-5'>
					<div className='flex items-center justify-center'>
						{otpField.map((_, index) => (
							<div key={index}>
								<input
									ref={index === activeOtpIndex ? inputRef : null}
									value={otpField[index]}
									type='number'
									className='w-12 h-12 bg-transparent border-2 border-blue-900 border-opacity-50 rounded-md ml-1 mr-1 sm:mr-3 sm:ml-3 px-4 py-1.5 hide-spin focus:outline-none'
									onChange={handleOnChange}
									onKeyDown={e => handleOnKeyDown(e, index)}
								/>
								{index === otpField.length - 1 ? null : (
									<span className='w-2 py-0.5 bg-blue-900 bg-opacity-50'></span>
								)}
							</div>
						))}
					</div>

					<ButtonContainer
						{...{
							onClick: handleVerifyOtp,
							text: 'Submit OTP',
							enabled: otp.length === 6
						}}
					/>
				</div>
			) : (
				<ButtonContainer
					{...{
						onClick: requestOTP,
						text: 'Request OTP',
						enabled: data.userName && data.phoneNumber
					}}
				/>
			)}
		</>
	);
};

export default OtpContainer;
