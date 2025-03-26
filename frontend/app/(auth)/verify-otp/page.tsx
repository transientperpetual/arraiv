"use client"
import axios from "axios"
import { useState } from "react"

export default function OTPVerificationPage(){
    const [otp, setOtp] = useState("")

    const handleSubmit = async () => {
        const res = await axios.post("/api/auth/otp/")
    console.log("RES : ", res)
    }

    return (
        <>
        <h1>Please verfiy otp sent to your email</h1>
        <label className="text-gray-600 text-sm pb-1">Enter OTP</label>
				<input
					className="text-gray-700 text-sm border-2 p-1 border-gray-400 rounded-sm"
					type="number"
					value={otp}
					required
					onChange={(e) => {
						setOtp(e.target.value);
					}}
				/>
        <button
                className="border-2 text-gray-800 p-1 rounded-sm hover:bg-gray-800 hover:text-gray-100"
                type="submit" onClick={handleSubmit}>Submit</button>
        </>
        
    )
}