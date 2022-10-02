import {
	RecaptchaVerifier,
	signInWithPhoneNumber
} from 'firebase/auth';
import { useEffect, useRef, useState } from 'react';
import ErrorContainer from './components/ErrorContainer';
import InputContainer from './components/InputContainer';
import MessageContainer from './components/MessageContainer';
import OtpContainer from './components/OtpContainer';
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
			<ErrorContainer error={error} />
			<MessageContainer user={user} />

			<form
				className={`${
					user ? 'scale-0 opacity-0 hidden' : 'scale-100 opacity-100'
				} w-full sm:w-1/3 space-y-7`}
			>
				<div className='flex items-center justify-center w-full my-10'>
					<h1 className='font-semibold text-lg'>
						Phone Auth with Firebase
					</h1>
				</div>
				<InputContainer {...{ data, handleData }} />
				<OtpContainer
					{...{
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
					}}
				/>
			</form>

			<div id='recaptcha-container'></div>
		</div>
	);
};

export default App;
