import {
	RecaptchaVerifier,
	signInWithPhoneNumber
} from 'firebase/auth';
import { useEffect, useRef, useState } from 'react';
import { authentication } from './firebase';

const App = () => {
	const [expandForm, setExpandForm] = useState(false);
	const [otpField, setOtpField] = useState(new Array(6).fill(''));
	const [otp, setOtp] = useState(null);
	const [activeOtpIndex, setActiveOtpIndex] = useState(0);
	const [currentOtpIndex, setCurrentOtpIndex] = useState(0);
	const [data, setData] = useState({
		userName: '',
		phoneNumber: ''
	});
	const [user, setUser] = useState();
	const [error, setError] = useState();

	const inputRef = useRef(null);

	const handleData = e => {
		const { name, value } = e.target;
		setData(prev => {
			return { ...prev, [name]: value };
		});
	};

	const handleOnKeyDown = (e, index) => {
		setCurrentOtpIndex(index);
		if (e.key === 'Backspace') setActiveOtpIndex(currentOtpIndex - 1);
	};

	const handleOnChange = e => {
		const value = e.target.value;
		const newOtp = [...otpField];

		if (!value) setActiveOtpIndex(currentOtpIndex - 1);
		else setActiveOtpIndex(currentOtpIndex + 1);

		newOtp[currentOtpIndex] = value.substring(value.length - 1);
		setOtpField(newOtp);
	};

	useEffect(() => {
		const handleOtp = setOtp(otpField.join(''));
		return () => handleOtp;
	}, [otpField]);

	useEffect(() => {
		inputRef?.current?.focus();
	}, [activeOtpIndex]);

	const generateRecaptch = () => {
		window.recaptchaVerifier = new RecaptchaVerifier(
			'recaptcha-container',
			{
				size: 'invisible',
				callback: response => {
					console.log(response);
				}
			},
			authentication
		);
	};

	const requestOTP = e => {
		e.preventDefault();
		if (data.phoneNumber.length >= 12) {
			setExpandForm(true);
			generateRecaptch();
			let appVerifier = window.recaptchaVerifier;
			signInWithPhoneNumber(
				authentication,
				data.phoneNumber,
				appVerifier
			)
				.then(confirmationResult => {
					window.confirmationResult = confirmationResult;
				})
				.catch(error => {
					console.log(error);
					setError(`Firebase Error`);
				});
		}
	};

	const handleVerifyOtp = e => {
		e.preventDefault();
		if (otp?.length === 6) {
			let confirmationResult = window.confirmationResult;
			confirmationResult.confirm(otp).then(result => {
				if (result.user) {
					setUser(data);
				}
			});
		}
	};

	useEffect(() => {
		error !== '' && setTimeout(() => setError(''), 3000);
	}, [error]);

	return (
		<div className='relative flex flex-col items-center justify-center h-screen w-screen bg-black text-white overflow-auto px-4'>
			<div
				className={`absolute -top-10 ${
					error ? 'translate-y-20' : '-translate-y-20'
				} flex items-center justify-center w-2/4 font-bold bg-red-600 py-4 rounded-md transition-all duration-500`}
			>
				{error}
			</div>

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

			<form
				className={`${
					user ? 'scale-0 opacity-0 hidden' : 'scale-100 opacity-100'
				} w-full sm:w-1/2 space-y-7`}
			>
				<div className='flex items-center justify-center w-full my-10'>
					<h1 className='font-semibold text-lg'>
						Phone Auth with Firebase
					</h1>
				</div>
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
				{expandForm && window.recaptchaVerifier ? (
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
			</form>

			<div id='recaptcha-container'></div>
		</div>
	);
};

export default App;

const Label = ({ text, className }) => {
	return (
		<label
			className={`absolute left-2 -top-6 dark:text-gray-200 text-xs transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-6 peer-focus:text-gray-50 peer-focus:text-sm ${className}`}
		>
			{text}
		</label>
	);
};

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
