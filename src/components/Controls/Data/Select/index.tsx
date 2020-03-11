import React, { useState, useEffect } from "react";
import { Select as ASelect } from "antd";

interface SelectProps {
    dataSource?: any[]
    request?: (params: any) => Promise<any>
    params?: any
    textField?: string
    valueField?: string
    [key: string]: any
}

const Select: React.FC<SelectProps> = (props) => {

    const { dataSource, request, textField, valueField, params, ...rest } = props;
    const [vParams, setParams] = useState<any>({});
    const [vDataSource, setDataSource] = useState<any[]>([]);
    const [vTextField, setTextField] = useState<string>('text');
    const [vValueField, setValueField] = useState<string>('value')


    useEffect(() => {
        if (dataSource) setDataSource(dataSource)
    }, [dataSource])

    useEffect(() => {
        if (textField) setTextField(textField);
    }, [textField])

    useEffect(() => {
        if (valueField) setValueField(valueField);
    }, [valueField])

    useEffect(() => {
        if (vParams) setParams(params)
    }, [params])

    useEffect(() => {
        if (vParams && request) {
            (async () => {
                let res = await request(vParams)
                if (res.err) {
                    return;
                }
                setDataSource(res.data);
            })();
        }
    }, [vParams])


    return (<ASelect {...rest}>
        {vDataSource.map(e => (<ASelect.Option value={e[vValueField]} key={e[vValueField]}>{e[vTextField]}</ASelect.Option>))}
    </ASelect>)
}

export default Select

