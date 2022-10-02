const Label = ({ text, className }) => {
	return (
		<label
			className={`absolute left-2 -top-6 dark:text-gray-200 text-xs transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-6 peer-focus:text-gray-50 peer-focus:text-sm ${className}`}
		>
			{text}
		</label>
	);
};

export default Label;
