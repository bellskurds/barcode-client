import React, {  useEffect, useState } from 'react';
import { Table, Button, DatePicker,Pagination } from 'antd';
import axios from 'axios';
import { baseURL } from '../../config';
import { File } from 'better-xlsx';
import { saveAs } from 'file-saver';
const Create = () => {
    const columns = [

        {
            title: 'Tipo',
            dataIndex: 'food_type',
            width: '10%',
            editable: true,
            // responsive: ['md'],

        },
        {
            title: 'Cantidad',
            dataIndex: 'amount',
            width: '15%',
            editable: true,
        },
        {
            title: 'Código de barras',
            dataIndex: 'barcode',
            width: '30%',
            editable: false,
        },
        {
            title: 'Nombre',
            dataIndex: 'barcode_name',
            width: '20%',
            // responsive: ['lg'],

        },
        {
            title: 'Fecha',
            dataIndex: 'date_added',
            width: '25%',
        },
    ];

    const [initData, sourceDatas] = useState([]);
    const [filterData, setFilterData] = useState([]);
    const [filterValue, setFilterVaue] = useState("");
    const [dateFromTo, dateStore] = useState("");
    const [isRowSelected, RowSelectedSet] = useState(false);
    const [selectedRowids, SetRowIds] = useState([]);
    console.log(selectedRowids)
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            SetRowIds(selectedRows);
            if (selectedRows.length) {
                RowSelectedSet(true)
            } else {
                RowSelectedSet(false)
            }
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name,
        }),
    };
    const getData = () => {
        axios.post(baseURL + 'api/get_scaneddata').then((res) => {
            res.data.map((data, index) => {
                res.data[index]["key"] = data['id'];
            })
            sourceDatas(res.data);
        })
    }
    useEffect(() => {
        getData();
    }, [])
    useEffect(() => {
        let filterDatas = [], searchData = [];
        if (!filterValue) return;
        if (!filterData.length) {
            searchData = initData;
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

    useEffect(() => {
        if (filterValue && !(typeof filterValue == "string")) {

            let seacrchData = [], searchData = [];
            let date_from = filterValue[0];
            let date_to = filterValue[1];
            date_from = new Date(date_from).toLocaleDateString();
            date_to = new Date(date_to).toLocaleDateString();
            if (!filterData.length) {
                searchData = initData;
            } else {
                searchData = filterData;
            }
            searchData.map((data, index) => {
                let barcode_date = new Date(data.date_added).toLocaleDateString();
                if (new Date(barcode_date) >= new Date(date_from) && new Date(barcode_date) < new Date(date_to)) {
                    seacrchData.push(data);
                }
            })
            setFilterData(seacrchData);
        }
    }, [filterValue])

    const ExportExcel = (column, dataSource, fileName = 'example') => {
        //  new working spectrum 
        const file = new File();
        //  the new table 
        let sheet = file.addSheet('sheet-test');
        //  gets the number of header rows 
        let depth = getDepth(column);
        //  gets the number of columns in the header 
        let columnNum = getColumns(column);
        //  new number of header rows 
        let rowArr = [];
        for (let k = 0; k < depth; k++) {
            rowArr.push(sheet.addRow());
        }
        //  populate the cells according to the number of columns 
        rowArr.map(ele => {
            for (let j = 0; j < columnNum; j++) {
                let cell = ele.addCell();
                cell.value = j;
            }
        });
        //  initializes the header 
        init(column, 0, 0);
        //  unfold the columns in order 
        let columnLineArr = [];
        columnLine(column);
        //  according to the column, the dataSource the data inside is sorted and converted into a two-dimensional array 
        let dataSourceArr = [];
        dataSource.map(ele => {
            let dataTemp = [];
            columnLineArr.map(item => {
                dataTemp.push({
                    [item.dataIndex]: ele[item.dataIndex],
                    value: ele[item.dataIndex],
                });
            });
            dataSourceArr.push(dataTemp);
        });
        // debugger;
        //  drawing table data 
        dataSourceArr.forEach((item, index) => {
            // according to the data, create the corresponding number of rows 
            let row = sheet.addRow();
            row.setHeightCM(0.8);
            // creates a cell for that number 
            item.map(ele => {
                let cell = row.addCell();
                if (ele.hasOwnProperty('num')) {
                    cell.value = index + 1;
                } else {
                    cell.value = ele.value;
                }
                cell.style.align.v = 'center';
                cell.style.align.h = 'center';
            });
        });
        // set the width of each column 
        for (var i = 0; i < 4; i++) {
            sheet.col(i).width = 20;
        }
        file.saveAs('blob').then(function (content) {
            saveAs(content, fileName + '.xlsx');
        });

        //  unfold the columns in order 
        function columnLine(column) {
            column.map(ele => {
                if (ele.children === undefined || ele.children.length === 0) {
                    columnLineArr.push(ele);
                } else {
                    columnLine(ele.children);
                }
            });
        }
        //  initializes the header 
        function init(column, rowIndex, columnIndex) {
            column.map((item, index) => {
                let hCell = sheet.cell(rowIndex, columnIndex);
                //  if there are no child elements,   all the columns 
                if (item.title === ' operation ') {
                    hCell.value = '';
                    return;
                } else if (item.children === undefined || item.children.length === 0) {
                    //  add a cell to the first row 
                    hCell.value = item.title;
                    hCell.vMerge = depth - rowIndex - 1;
                    hCell.style.align.h = 'center';
                    hCell.style.align.v = 'center';
                    columnIndex++;
                    // rowIndex++
                } else {
                    let childrenNum = 0;
                    function getColumns(arr) {
                        arr.map(ele => {
                            if (ele.children) {
                                getColumns(ele.children);
                            } else {
                                childrenNum++;
                            }
                        });
                    }
                    getColumns(item.children);
                    hCell.hMerge = childrenNum - 1;
                    hCell.value = item.title;
                    hCell.style.align.h = 'center';
                    hCell.style.align.v = 'center';
                    let rowCopy = rowIndex;
                    rowCopy++;
                    init(item.children, rowCopy, columnIndex);
                    //  next cell start 
                    columnIndex = columnIndex + childrenNum;
                }
            });
        }
        //  gets table head rows 
        function getDepth(arr) {
            const eleDepths = [];
            arr.forEach(ele => {
                let depth = 0;
                if (Array.isArray(ele.children)) {
                    depth = getDepth(ele.children);
                }
                eleDepths.push(depth);
            });
            return 1 + max(eleDepths);
        }

        function max(arr) {
            return arr.reduce((accu, curr) => {
                if (curr > accu) return curr;
                return accu;
            });
        }
        //  calculates the number of header columns 
        function getColumns(arr) {
            let columnNum = 0;
            arr.map(ele => {
                if (ele.children) {
                    getColumns(ele.children);
                } else {
                    columnNum++;
                }
            });
            return columnNum;
        }
    }
    const exportToExcel = () => {
        var expertData = [], fileName = "";
        if (!filterData.length) {
            expertData = initData
        } else {
            expertData = filterData
        }
        if (dateFromTo) {
            let date_from = dateFromTo[0];
            let date_to = dateFromTo[1];
            date_from = new Date(date_from).toISOString().slice(0, 10);
            date_to = new Date(date_to).toISOString().slice(0, 10);
            fileName = "Reports" + date_from + "-" + date_to
        } else {
            fileName = new Date().toISOString().slice(0, 10);
        }
        ExportExcel(columns, expertData, fileName);
        // console.log(expertData)
    }
    const selectedDelete = () => {
        let selectedIds = [];
        selectedRowids.map((data, index) => {
            selectedIds.push(data.id)
        })
        axios.post(baseURL + "api/scaned_remove", selectedIds).then((res) => {
            if (res.data) {
                let result = res.data;
                result.map((data, index) => {
                    result[index]["key"] = result[index]["id"];
                })
                sourceDatas(result);
            }
        })
    }
    useEffect(() => {
        if (!filterValue) {
            setFilterData([])
        }
    }, [filterValue])
    const onShowSizeChange = (current, pageSize) => {
        console.log(current, pageSize);
    }
    const showTotal = (total, range) => {
        return `${range[0]}-${range[1]} de ${total} elementos`
    }
    return (
        <div className="main-content">
            <div className="example">
                <input className="m-1 cl-black" style={{ width: "30%", color: "white", height: "34px" }} placeholder="Buscar..." onChange={(e) => { setFilterVaue(e.target.value) }} enterButton="Buscar" size="small" />
                <DatePicker.RangePicker className="m-1 date_ranger" placeholder={["Fecha inicial","Fecha final"]} style={{width:"20%"}} onCalendarChange={(e) => { setFilterVaue(e); dateStore(e) }} />
                {

                    isRowSelected ? <Button  style={{  width: '10%' }} className="delete_button m-1" onClick={selectedDelete}>Borrar</Button> : ""
                }
                <Button className="m-1 export_button" onClick={exportToExcel} style={{width:"10%"}}>Exportar</Button>
            </div>
            <Table
                rowSelection={{
                    ...rowSelection,
                }}
                rowClassName="data_table"
                columns={columns}
                dataSource={!filterValue ? initData : filterData}
                pagination={{ alignment:  'center', showTotal: showTotal }}
            />
             
        </div>
    );
}

export default Create;


