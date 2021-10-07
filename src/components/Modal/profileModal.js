import React,{useState,useEffect} from 'react';
import { Link } from 'react-router-dom';
import {Modal} from 'antd';
import axios from 'axios';
import config from '../../config';
 const ProfileModal = ({
 	status,
 	handleShowModal
 }) => {
 	const [userData,setUserData] = useState({
 		username:"",
 		password:"",
 		oldpass:""
 	});
	const hideModal = () => {
		handleShowModal(false)
	}

	const changeInfo = () => {
		for(let i in userData){
			if(!userData[i]){
				alert("input correctly to "+i);
				return;
			}
		}
		axios.post(config.baseURL+"api/change_userinfo",userData).then((res)=>{
			if(res.data){
				alert('success');
			}else{
				alert('oldpass errors');
			}
		})		
 	};
    return (
       <Modal title="Change User Info" visible={status} onOk={changeInfo} onCancel={hideModal}>
       	<input className="m-2" type="password" placeholder="Old Pass" onChange={(e)=>{setUserData({...userData,oldpass:e.target.value})}} />
       	<input className="m-2" type="text" placeholder="New Username" style={{padding:"10px"}} onChange={(e)=>{setUserData({...userData,username:e.target.value})}} />
       	<input className="m-2" type="password" placeholder="New Password" onChange={(e)=>{setUserData({...userData,password:e.target.value})}} />
       </Modal>
    );
};

export default ProfileModal;