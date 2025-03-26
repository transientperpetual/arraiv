"use client";
import { useState } from "react";
import axios from 'axios'
import { useRouter } from "next/navigation";
import { NextResponse } from "next/server";

export default function RegisterPage() {

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [first_name, setFirstname] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister  = async (e: React.FormEvent) => {
    e.preventDefault();

	if(first_name === "" || email === "" || password === "") {
		return
	}
	
	try {
		const response = await axios.post("/api/auth/register/", {
			first_name,
			email,
			password
		});

		console.log("Reg successful")

		console.log("Response for BE : ", response.data)
		//TODO - verify otp, redirect to otp verification page.
		router.push("/verify-otp/")

	} catch (e) {
		console.log("Reg failed : ", e)
	}

  };

  return (
    <div className="min-h-screen bg-gray-900 items-center flex flex-col justify-center">
			<form
				onSubmit={handleRegister}
				className="p-8 flex flex-col rounded-sm bg-white shadow-md" 
			>

				<label className="text-gray-600 text-sm pb-1">First name</label>
				<input
					className="text-gray-700 text-sm border-2 p-1 border-gray-400 rounded-sm"
					type="text"
					value={first_name}
					required
					onChange={(e) => {
						setFirstname(e.target.value);
					}}
				/>
				<br />

                {/* <label className="text-gray-600 text-sm pb-1">Username</label>
				<input
					className="text-gray-700 text-sm border-2 p-1 border-gray-400 rounded-sm"
					type="text"
					value={username}
					required
					onChange={(e) => {
						setUsername(e.target.value);
					}}
				/>
				<br /> */}
					<label className="text-gray-600 text-sm pb-1">Email</label>
					<input
						className="text-gray-700 text-sm border-2 p-1 border-gray-400 rounded-sm"
						type="email"
						value={email}
						required
						onChange={(e) => {
							setEmail(e.target.value);
						}}
					/>
					<br />

				<label className="text-gray-600 text-sm pb-1" >Password</label>
				<input
					className="text-gray-700 text-sm border-2 p-1 border-gray-400 rounded-sm"
					type="password"
					value={password}
					required
					onChange={(e) => {
						setPassword(e.target.value);
					}}
				/>
				<br />
                <button
                className="border-2 text-gray-800 p-1 rounded-sm hover:bg-gray-800 hover:text-gray-100"
                type="submit">REGISTER 🥳</button>
			</form>
		</div>
  );
}
