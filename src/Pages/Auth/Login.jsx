import React, { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAppStore from '../../store/store'; // Import the Zustand store
import "./Auth.css";

const useCountryCodes = () => {
    const [countries, setCountries] = useState([]);
    useEffect(() => {
        fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd')
            .then(res => res.json())
            .then(data => {
                const countryData = data
                    .map(c => ({
                        name: c.name.common,
                        code: c.cca2,
                        dialCode: c.idd.root ? `${c.idd.root}${c.idd.suffixes?.[0] || ''}` : null
                    }))
                    .filter(c => c.dialCode)
                    .sort((a, b) => a.name.localeCompare(b.name));
                setCountries(countryData);
            })
            .catch(() => toast.error("Failed to load country codes."));
    }, []);
    return countries;
};

const loginSchema = z.object({
    dialCode: z.string().min(1, "Country code is required"),
    phoneNumber: z.string().min(8, "Phone number seems too short").regex(/^\d+$/, "Invalid phone number"),
});

const OTP_LENGTH = 4;

export default function LoginPage() {
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(""));
    const [isVerifying, setIsVerifying] = useState(false);
    const [loginData, setLoginData] = useState(null); // To hold form data
    const countries = useCountryCodes();
    const navigate = useNavigate();
    const otpInputsRef = useRef([]);
    const { login } = useAppStore(); // Get the login action from the store

    const { register, handleSubmit, formState: { errors, isValid }, control } = useForm({
        resolver: zodResolver(loginSchema),
        mode: 'onChange'
    });

    const onFormSubmit = (data) => {
        setLoginData(data); // Save the form data
        toast.success(`OTP sent to ${data.dialCode} ${data.phoneNumber}`);
        setStep(2);
        setTimeout(() => otpInputsRef.current[0]?.focus(), 100);
    };

    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return;
        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
        if (element.nextSibling && element.value) {
            element.nextSibling.focus();
        }
    };

    const handleOtpKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && e.target.previousSibling) {
            e.target.previousSibling.focus();
        }
    };

    const verifyOtp = () => {
        const enteredOtp = otp.join("");
        if (enteredOtp.length !== OTP_LENGTH) {
            toast.error("Please enter the complete OTP.");
            return;
        }

        setIsVerifying(true);
        setTimeout(() => {
            if (enteredOtp === "1234") { // Simulate correct OTP
                toast.success("Logged in successfully!");
                
                // Create a user object and call the login action
                const user = {
                    name: "Welcome Back!", // Placeholder name for login
                    email: "Not provided",
                    ...loginData
                };
                login(user); // Update Zustand store
                
                localStorage.setItem('isAuthenticated', 'true');
                navigate('/');
            } else {
                toast.error("Invalid OTP. Please try again.");
                setIsVerifying(false);
            }
        }, 1500);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">💬 Gemini</div>
                    <h1 className="auth-title">{step === 1 ? "Welcome back" : "Enter OTP"}</h1>
                    <p className="auth-subtitle">
                        {step === 1 ? "Log in using your phone number." : "Enter the 4-digit code to continue."}
                    </p>
                </div>

                {step === 1 ? (
                    <form onSubmit={handleSubmit(onFormSubmit)} className="auth-form">
                        <div className="input-group">
                            <div className="phone-input-container">
                                <Controller
                                    name="dialCode"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <select {...field} className="country-select">
                                            <option value="" disabled>Code</option>
                                            {countries.map(c => (
                                                <option key={c.code} value={c.dialCode}>
                                                    {c.dialCode} ({c.name})
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                />
                                <input {...register('phoneNumber')} placeholder="Phone Number" className="input-field phone-number" />
                            </div>
                            {(errors.dialCode || errors.phoneNumber) && <p className="error-message">{errors.dialCode?.message || errors.phoneNumber?.message}</p>}
                        </div>
                        <button type="submit" className="submit-btn" disabled={!isValid}>
                            Send OTP
                        </button>
                    </form>
                ) : (
                    <div className="auth-form otp-group">
                        <div className="otp-inputs">
                            {otp.map((data, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    className="otp-input"
                                    value={data}
                                    onChange={e => handleOtpChange(e.target, index)}
                                    onKeyDown={e => handleOtpKeyDown(e, index)}
                                    onFocus={e => e.target.select()}
                                    ref={el => (otpInputsRef.current[index] = el)}
                                    disabled={isVerifying}
                                />
                            ))}
                        </div>
                        <button onClick={verifyOtp} className="submit-btn" disabled={isVerifying}>
                            {isVerifying ? "Verifying..." : "Log In"}
                        </button>
                          <button onClick={() => setStep(1)} className="auth-link" style={{background: 'none', border: 'none', cursor: 'pointer'}}>
                            Use a different number
                        </button>
                    </div>
                )}

                <div className="auth-footer">
                    Don't have an account? <Link to="/register" className="auth-link">Sign Up</Link>
                </div>
            </div>
        </div>
    );
}