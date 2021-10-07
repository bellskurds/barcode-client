import React,{useEffect,useState} from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import {Table,Modal,Button,Spin, Space} from 'antd';
import config from '../../config';
import axios from 'axios';
import { PlusCircleOutlined,MinusCircleOutlined  } from '@ant-design/icons';

function App() {
    const [initData,setInitData] = useState([]);
    const [data, setData] = React.useState();
    console.log(data)
    const [barcodeData,barcodeDatas] = useState([]);
    const [searchData,searchDatas] = useState([]);
    const [modalStatus,modalStatusSet] = useState(false);
    const [foodAmount,setFoodAmount] = useState(1);
    const [loadStatus,setLoadStatus] = useState(true);
    const [scanData,setScanData] = useState({})
    const baseURL = config.baseURL;
    const columns = [
        {
            title: 'Código de barras',
            dataIndex: 'barcode',
            width: '40%',
         },
        {
            title: 'Nombre',
            dataIndex: 'barcode_name',
            width: '40%',
        },
        {
            title: 'Fecha',
            dataIndex: 'date_added',
            width: '20%',
        }]
    const getData  = (callback)=>{
        axios.post(baseURL+"api/get_tabledata").then((res)=>{
            setLoadStatus(true);
            if(res.data){
                barcodeDatas(res.data);
                setLoadStatus(false)
            }
        })
    }
// ==== Modal ====
    const showModal = () => {
        modalStatusSet(true)
        setFoodAmount(1);
    };

    const handleOk = e => {
        modalStatusSet(false)

        let date_add = (new Date()).toLocaleString().split("/");
        let real_date = [];
        real_date[0] = date_add[1];
        real_date[1] = date_add[0];
        real_date[2] = date_add[2];
        date_add = real_date.join("/");
        let newRecords = {
            key:scanData["barcode_key"],
            barcode:scanData["barcode"],
            barcode_name:scanData["barcode_name"],
            date_added:date_add,
            amount:foodAmount,
            food_type:"Comida"
        }
        setInitData(pre=>[...initData,newRecords]);
        delete newRecords["key"];
        axios.post(baseURL+"api/amount_transaction",newRecords).then((res)=>{
            if(res.data)alert(res.data)
        })
     };

    const handleCancel = e => {
        modalStatusSet(false)
    };
    // ==== End Modal ====
    const barcodeScan = ()=>{
        axios.post(baseURL+"api/get_tabledata").then((res)=>{
            if(res.data){
                barcodeDatas(res.data);
                setData(searchData);
            }
        })
    }
    useEffect(()=>{
        getData();
    },[]);
    useEffect(()=>{
        let flag = false;
        if(data =="Not Found" || !data){
            return;
        }
        for(let i in barcodeData){
            let records = barcodeData[i];
            if(data == records["barcode"] && records["barcode_status"] == "Activo"){
                setScanData(records)
                showModal();
                setData("");
                flag = true;
            }
        }
        if(!flag){
            alert(data+' no existe');
            setData("");

        }
    },[data])
    return (
    <>
    {
        loadStatus? 
        <Space size="middle" style={{position:"fixed",top:"10%"}}>
            <Spin size="large" />loading..  
        </Space>
        :
        <>
          <BarcodeScannerComponent
            width={500}
            height={500}
            onUpdate={(err, result) => {
              if (result) setData(result.text);
            }}
          />
          <div className="center_centent">
            <input placeholder="Ingrese un número" className="cl-black" style={{width:'70%'}} onChange={(e)=>{searchDatas(e.target.value)}} />
            <button className="btn btn-primay" onClick={barcodeScan}>Escanear</button>
          </div>
            <Table
                columns={columns}
                dataSource = {initData}
             />
              <Modal
                title={<><span>{scanData["barcode_name"]}</span><br /><span>{ scanData["barcode"]}</span></>}
                closable={false}
                visible={modalStatus}
                onOk={handleOk}
                onCancel={handleCancel}
              >
                  <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                        <span style={{position:'absolute',left:"10%"}}>Comida</span>
                        <Button shape="circle" icon={<MinusCircleOutlined/>}  onClick={()=>{if(foodAmount>1)setFoodAmount(foodAmount-1)}} />
                        <span style={{padding:"10px"}}>{foodAmount}</span>
                        <Button shape="circle" icon={<PlusCircleOutlined />} onClick={()=>{setFoodAmount(foodAmount+1)}} />
                  </div>
              </Modal>
        </>
    }
    </>
  );
}
export default App; 