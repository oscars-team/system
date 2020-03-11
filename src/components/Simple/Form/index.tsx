import React, { useEffect, useState } from "react";
import { ConnectProps } from "@/models/connect";
import { Form, Input, InputNumber, DatePicker, Select } from "antd";
import { Rule } from "rc-field-form/lib/interface";
export interface IFieldSet {
    label?: string,
    name?: string,
    rules?: Rule[],
    type?: 'string' | 'number' | 'date' | string[] | number[]
    collection?: string[]
    render?: () => React.ReactElement
}

export class FieldSet implements IFieldSet {
    label?: string | undefined; name?: string | undefined;
    type?: 'string' | 'number' | 'date' | any[] | undefined;
    collection?: string[] | undefined; rules?: Rule[];

    constructor(props: IFieldSet) {
        this.label = props.label;
        this.name = props.name;
        this.type = props.type;
        this.rules = props.rules
        this.collection = props.collection
    }

    render(): React.ReactElement {
        const renderControl = () => {
            if (this.type === 'number')
                return <InputNumber></InputNumber>

            if (this.type === 'date')
                return <DatePicker></DatePicker>

            if (typeof this.type === 'object') {
                return (
                    <Select>
                        {this.type.map((e, i) => (
                            <Select.Option key={e} value={e}>{this.collection ? this.collection[i] : ''}</Select.Option>
                        ))}
                    </Select>
                )
            }
            return <Input></Input>
        }
        return (<Form.Item
            rules={this.rules ? this.rules : []}
            label={this.label}
            key={this.name}
            name={this.name}>
            {renderControl()}
        </Form.Item>)
    }
}

interface SimpleFormProps extends ConnectProps {
    fields: IFieldSet[]
    form?: any,
    onFinish?: (values: any) => void

}

const SimpleForm: React.FC<SimpleFormProps> = props => {

    const { fields, onFinish: handleOnFinish } = props;
    const [mapFields, setMapFields] = useState<FieldSet[]>([]);

    const layout = {
        labelCol: {
            //<576px 响应式栅格，可为栅格数或一个包含其他属性的对象
            xs: { span: 24 },
            //≥576px 响应式栅格，可为栅格数或一个包含其他属性的对象
            sm: { span: 6 },
            //≥768px 响应式栅格，可为栅格数或一个包含其他属性的对象
            // md: { span: 6 },
            //≥992px 响应式栅格，可为栅格数或一个包含其他属性的对象
            // lg: { span: 4 },
            //≥1200px 响应式栅格，可为栅格数或一个包含其他属性的对象
            xl: { span: 4 },
            //≥1600px 响应式栅格，可为栅格数或一个包含其他属性的对象
            xxl: { span: 2 },

        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 12 },
            // md: { span: 12 },
            // lg: { span: 4 },
            xl: { span: 12 },
            xxl: { span: 6 },
        },
    };
    useEffect(() => {
        if (!fields) return;
        setMapFields(fields.map(f => new FieldSet(f)))
    }, [])

    const [internelForm] = Form.useForm();
    return (<Form
        form={props.form ? props.form : internelForm}
        {...layout}
        onFinish={handleOnFinish}
    >
        {mapFields.map(s => s.render())}
    </Form>)
}

export default SimpleForm;