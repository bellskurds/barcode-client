import React, { useState,useEffect} from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import axios from 'axios';
import config from '../../config';
import { Table, Input, InputNumber, Popconfirm, Form,Button, Typography ,Select,DatePicker} from 'antd';
const { Option } = Select;
const baseURL = config.baseURL;
const { RangePicker } = DatePicker;


const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableTable = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [statusValue,statusValueSet] = useState("Active");
  const [checkRows,checkRowGet] = useState([]);
  const [filterValue,filterValues] = useState("")
  const [filterData, setFilterData] = useState([]);
  const [isRowSelected, RowSelectedSet] = useState(false);
  console.log(checkRows)
  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    console.log(111111,record)
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };
  const selectedDelete = () => {
        axios.post(baseURL + "api/barcode_remove", checkRows).then((res) => {
            if (res.data) {
                let result = res.data;
                result.map((data, index) => {
                    result[index]["key"] = result[index]["barcode_key"];
                })
                setData(result);
            }
        })
    }
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        item.barcode_status = statusValue;
        row.barcode_status = statusValue;

        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        axios.post(baseURL+"api/addrow",newData[index]).then((res)=>{
            if(res.data.result){
                alert(res.data.result)
            }
        })
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: 'barcode',
      dataIndex: 'barcode',
      width: '20%',
      editable: true,
    },
    {
      title: 'Name',
      dataIndex: 'barcode_name',
      width: '15%',
      editable: true,
    },
    {
      title: 'Date Added',
      dataIndex: 'date_added',
      width: '35%',
     },
    {
        title:"Status",
        dataIndex:"barcode_status",
        width:"20%",
        render: (_, record) => {
         const editable = isEditing(record);
        return editable ? (
        <Select showSearch style={{ width: 200 }} onChange={(e)=>{statusValueSet(e)}} defaultValue={record.barcode_status}>
            <Option value="Active">Active</Option>
            <Option value="Archived">Archived</Option>
          </Select>
        ) : (
            <span>{record.barcode_status}</span>
        );
      },
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a
              href="javascript:;"
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </a>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  const recordAdd = ()=>{
    let newData = {
        key:(new Date()).valueOf(),
        barcode:"",
        barcode_name:"",
        date_added:(new Date()).toLocaleString(),
        barcode_status:"Active",
    }
    edit(newData)
    setData(pre=>([newData,...data]))
  }
    const recordActive = ()=>{
        console.log(checkRows)
        
        if(checkRows.length){
            axios.post(baseURL+"api/record_active",checkRows).then((res)=>{
                if(res.data){
                    for(let i in res.data){
                        res.data[i]["key"] = res.data[i]["barcode_key"]
                    }
                    setData(res.data);
                }
            })
        }
  }
    const recordArchived = ()=>{
        console.log(checkRows)
        if(checkRows.length){
            axios.post(baseURL+"api/record_archived",checkRows).then((res)=>{
                if(res.data){
                    for(let i in res.data){
                        res.data[i]["key"] = res.data[i]["barcode_key"]
                    }
                    setData(res.data);
                }
            })
        }
  }
   const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            if (selectedRows.length) {
                let k = 0;
                for(let i in selectedRows){
                  if(selectedRows[i]["barcode_status"] =="Archived"){
                    RowSelectedSet(true)
                  }
                }
                for(let i in selectedRows){
                  if(selectedRows[i]["barcode_status"] =="Active"){
                    RowSelectedSet(false)
                  }
                }
            } else {
                RowSelectedSet(false)
            }
            let getIds = [];
            for(let i in selectedRows){
                getIds.push(selectedRows[i]["barcode_key"]?selectedRows[i]["barcode_key"]:selectedRows[i]["key"])
            }
            checkRowGet(getIds);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name,
        }),
    };
    useEffect(() => {
        let filterDatas = [], searchData = [];
        if (!filterValue) return;
        if (!filterData.length) {
            searchData = data;
        } else {
            searchData = filterData
        }
        searchData.map((data, index) => {
            if (data.barcode.indexOf(filterValue) > -1 || data.barcode_name.indexOf(filterValue) > -1) {
                filterDatas.push(data);
            }
        })
        setFilterData(filterDatas);
    }, [filterValue]);
    const getDatas = ()=>{
        axios.post(baseURL+"api/get_tabledata").then((res)=>{
            if(res.data){
                 for(let i in res.data){
                    let record = res.data[i];
                    res.data[i]["key"]  = res.data[i]["barcode_key"];
                }
                setData(res.data);
            }
        })
    }
    useEffect(()=>{
        getDatas();
    },[])
  return (
    <Form form={form} component={false}>
    <div className = "main-content">
        <input placeholder="input for search cl-black" className="serach_text" style={{width:"50%"}} onChange={(e)=>{filterValues(e.target.value)}} />
        <button className="btn btn-primary add_button"  onClick={recordAdd}>Add button</button>

        {
          isRowSelected ? <button  style={{  width: '10%' }} className="btn btn-info archived_button" onClick={selectedDelete}>Delete</button> : ""
        }
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            dataSource={!filterValue?data:filterData}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={{
              onChange: cancel,
            }}
            rowSelection={{
                    ...rowSelection,
            }}
          />
    </div>
    </Form>
  );
};
export default EditableTable;