import { ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react";

import {SignupInput} from "@chaicodes/medium-common";
import axios from "axios";
import { BACKEND_URL } from "../config";
import {jwtDecode} from 'jwt-decode';

interface DecodedToken {
  name?: string;
  id:number
}


// Set up axios interceptor
axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);



export const Auth = ({ type }: { type: "signup" | "signin" }) => {
    const navigate = useNavigate();
    const [postInputs, setPostInputs] = useState<SignupInput>({
        name: "",
        email: "",
        password: ""
    });

    async function sendRequest() {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`, postInputs);
            const jwt = response.data.jwt;
            if (jwt) {
                localStorage.setItem("token", jwt);
                console.log("THE JWT IS: ", jwt);

                
                const decoded = jwtDecode<DecodedToken>(jwt);
                console.log("THE DECODED IS: ", decoded);
                if (decoded.name) {
                    console.log("THE NAME IS: ", decoded.name);
                    localStorage.setItem("userName", decoded.name);
                    let id = decoded.id;

                    localStorage.setItem("userId", id?.toString())
                }
                else {
                    localStorage.setItem("userName", "chaitanya");
                }
                
                
                setTimeout(() => {
                    const storedToken = localStorage.getItem("token");
                    console.log("THE local storage token IS: ", storedToken);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
                    
                    if (storedToken) {
                        navigate("/blogs");
                    } else {
                        console.error("Failed to store token in localStorage");
                        alert("Error while signing up: Failed to store authentication token");
                    }
                }, 100);
            } else {
                console.error("No JWT received from the server");
                alert("Error while signing up: No authentication token received");
            }
        } catch(e) {
            alert("Error while signing up")
     
        }
    }
    
    return <div className="h-screen flex justify-center flex-col">
        <div className="flex justify-center">
            <div>
                <div className="px-10">
                    <div className="text-3xl font-extrabold">
                        Create an account
                    </div>
                    <div className="text-slate-500">
                        {type === "signin" ? "Don't have an account?" : "Already have an account?" }
                        <Link className="pl-2 underline" to={type === "signin" ? "/signup" : "/"}>
                            {type === "signin" ? "Sign up" : "Sign in"}
                        </Link>
                    </div>
                </div>
                <div className="pt-8">
                    {type === "signup" ? <LabelledInput label="Name" placeholder="Chaitanya Shetty..." onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            name: e.target.value
                        })
                    }} /> : null}
                    <LabelledInput label="Username" type={"email"} placeholder="chaitanya@gmail.com" onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            email: e.target.value
                        })
                    }} />
                    <LabelledInput label="Password" type={"password"} placeholder="123456" onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            password: e.target.value
                        })
                    }} />
                    <button type="button" onClick={sendRequest} className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{type === "signup" ? "Sign up" : "Sign in"}</button>
                   {/* onClick={sendRequest} */}
                </div>
            </div>
        </div>
    </div>
}

interface LabelledInputType {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

function LabelledInput({ label, placeholder, onChange, type }: LabelledInputType) {
    return <div>
        <label className="block mb-2 text-sm text-black font-semibold pt-4">{label}</label>
        <input onChange={onChange} type={type || "text"} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={placeholder} required />
    </div>
}