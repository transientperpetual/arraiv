"use client";
import { useState } from "react";
import axios from "axios"

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
	e.preventDefault();

	try {
		//TODO: check if user is already logged in? check this by finding presence of access_token if yes then use it to login, if no find refresh
		// if found use it to get a access token if no the proceed to fetch new token pair
		const response = await axios.post("/api/auth/login", {email, password}, {withCredentials:true})
		
		//MUST INCLUDE withCredentials with all requests even the first login req!otherwise cookies wont be written
		// const response = await axios.post("http://127.0.0.1:8000/api/users/login/", {email, password}, {withCredentials:true})
		if (response.status === 200){
			console.log("Response for BE : ", response.data)
		}
	}
	catch (e) {
		console.log("Err logging in : ", e)
	}
  };

  return (
    <div className="min-h-screen bg-gray-900 items-center flex flex-col justify-center">
			<form
				onSubmit={handleSubmit}
				className="p-8 flex flex-col rounded-sm bg-white shadow-md" 
			>
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
                type="submit">Login</button>
			</form>
		</div>
  );
}
