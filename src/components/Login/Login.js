import React, { Component ,useState} from 'react';
import axios from 'axios';
import config from '../../config';
const baseURL = config.baseURL;
const session_key = config.session_key;
const initData = {
    pre_heading: "Login",
    heading: "Login to your Account",
 }



const Login =()=> {
    const [userData,setUserData] = useState({});
    const hasLogin = ()=>{
        for(let i in userData){
            if(!userData[i]){
                alert("Input correctly to "+i);
                return;
            }
        }
        axios.post(baseURL+"api/hasUser",userData).then((res)=>{
            if(res.data.result ==="default_login"){
                window.localStorage.setItem(session_key, JSON.stringify(userData));
                window.location.href = "/"
            }else{
                alert("Please input correctly user info")
            }
        })
    }
        return (
            <section className="author-area">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-8 col-lg-7">
                            {/* Intro */}
                            <div className="intro text-center">
                                <span>{initData.pre_heading}</span>
                                <h3 className="mt-3 mb-0">{initData.heading}</h3>
                            </div>
                            {/* Item Form */}
                            <form className="item-form card no-hover" url="/create">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="form-group mt-3">
                                            <input type="text" className="form-control cl-white" onChange={(e)=>{setUserData({...userData,username:e.target.value})}}  name="email" placeholder="Enter your Email" required="required" />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-group mt-3">
                                            <input type="password" className="form-control cl-white" onChange={(e)=>{setUserData({...userData,password:e.target.value})}} name="password" placeholder="Enter your Password" required="required" />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <button className="btn w-100 mt-3 mt-sm-4" onClick={hasLogin} type="button">Sign In</button>
                                    </div>

                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

export default Login;