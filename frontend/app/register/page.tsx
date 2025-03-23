"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister  = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("making req")
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, username, password }),
    });

    if (res.ok) {
        console.error("Registration Successful");
    } else {
      console.error("Registration failedd");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 items-center flex flex-col justify-center">
			<form
				onSubmit={handleRegister}
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

                <label className="text-gray-600 text-sm pb-1">Username</label>
				<input
					className="text-gray-700 text-sm border-2 p-1 border-gray-400 rounded-sm"
					type="username"
					value={username}
					required
					onChange={(e) => {
						setUsername(e.target.value);
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
