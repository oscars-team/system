import React, { useEffect, useState } from "react";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import { connect } from "dva";
import { ConnectProps } from "@/models/connect";
import { MerchantVoucherQuery } from "../data.d";
import { show, create } from "../service";
import { Form, message, Card, Row, Col, Input, InputNumber, Select, DatePicker, Button } from "antd";
import FooterToolbar from "@/components/FooterToolbar";
import TextArea from "antd/lib/input/TextArea";
import moment from 'moment'
interface EditFormProps extends ConnectProps {
}

const EditForm: React.FC<EditFormProps> = props => {
    const { location } = props;
    const [form] = Form.useForm();
    const [contentTitle, setContentTitle] = useState<string>('');
    const [submitFlag, setSubmitFlag] = useState<boolean>(false);
    const [merchentVoucher, setMerchentVoucher] = useState<MerchantVoucherQuery>({
        title: '',
        amount: 100,
        type: 2,
        condition: 100,
        start_at: moment().add(1, 'day'),
        expire_at: moment().add(3, 'month').add(1, 'day')
    });
    useEffect(() => {

        if (location?.query.id) {
            (async () => {
                let res = await show(location.query.id);
                if (res.err) {
                    message.error(res.errmsg);
                    return;
                }
                setMerchentVoucher(res);
                setContentTitle(`编辑'${(res as MerchantVoucherQuery).title}'`)
                const { start_at, expire_at, condition, ...rest } = res;
                if (condition.price) setConditionLabel(`消费满 ${condition.price} 元时可用`)
                form.setFieldsValue({
                    start_at: start_at ? moment(start_at) : null,
                    expire_at: expire_at ? moment(expire_at) : null,
                    condition: condition ? condition.price : null,
                    ...rest
                });
            })();
        } else {
            setContentTitle('创建新的优惠券');
            form.setFieldsValue(merchentVoucher);
        }

    }, [])


    const onFormFinish = async (values: any) => {
        setSubmitFlag(true);
        let { condition, ...rest } = values
        let res = await create({
            condition: { price: condition },
            ...rest
        });
        setSubmitFlag(false);
        if (res.err) {
            message.error(res.errmsg);
            return;
        }
        message.success(<><span>创建成功</span>, <a onClick={() => { history.back() }}>返回</a></>);
    }

    const [conditionLable, setConditionLabel] = useState<string>('使用条件');
    return (
        <>
            <PageHeaderWrapper title={contentTitle}>
                <Form form={form} layout="vertical"
                    onFinish={onFormFinish}>
                    <Card title="推广策略">
                        <Row gutter={[8, 8]}>
                            <Col span={22} offset={1}>
                                <Row gutter={16} >
                                    <Col span={8}>
                                        <Form.Item label="数量" name="amount" rules={[{
                                            required: true,
                                            message: '请填写优惠券数量, 0表示数量不限'
                                        }]}>
                                            <InputNumber min={0} max={99999} style={{ width: '100%' }}></InputNumber>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item label="活动开始日期" name="start_at" rules={[{
                                            required: true,
                                            message: '请输入开始日期'
                                        }]}>
                                            <DatePicker style={{ width: '100%' }}></DatePicker>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item label="活动结束日期" name="expire_at" rules={[{
                                            required: true,
                                            message: '请输入截止日期'
                                        }]}>
                                            <DatePicker style={{ width: '100%' }}></DatePicker>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Card>
                    <Card title="优惠券" style={{ marginTop: 24 }}>
                        <Row gutter={[8, 8]}>
                            <Col span={22} offset={1}>
                                <Row gutter={16} >
                                    <Col span={8}>
                                        <Form.Item label="标题" name="title" rules={[{
                                            required: true,
                                            message: '请输入标题'
                                        }]}>
                                            <Input placeholder="如: 5 元代金券"></Input>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item label="描述" name="desc">
                                            <Input placeholder="如: 满100元使用"></Input>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item label="选择类型" name="type" rules={[{
                                            required: true,
                                            message: '请选择优惠券类型'
                                        }]} >
                                            <Select>
                                                <Select.Option value={1}>折扣券</Select.Option>
                                                <Select.Option value={2}>代金券</Select.Option>
                                                <Select.Option value={3}>满减券</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col span={8}>
                                        <Form.Item label="价值奖励" name="value" rules={[{
                                            required: true,
                                            message: '请输入优惠券价值'
                                        }]}>
                                            <InputNumber min={0} max={999999} defaultValue={0} style={{ width: '100%' }}></InputNumber>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item label={conditionLable} name="condition">
                                            <InputNumber placeholder="消费满多少元时可用" onChange={(e) => {
                                                if (e != null)
                                                    setConditionLabel(`消费满 ${e} 元时可用`);
                                                else
                                                    setConditionLabel('使用条件');
                                            }} min={0} max={999999} style={{ width: '100%' }}></InputNumber>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item label="详细的使用说明" name="instruction">
                                            <TextArea rows={5} placeholder="本优惠券有使用期限限制，过了有效期不能使用&#13;&#10;优惠券只能抵扣订单金额，优惠金额超出订单金额部分不能再次使用，不能兑换现金； &#13;&#10;优惠券等抵扣金额不能开具发票；&#13;&#10;... "></TextArea>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Card>
                </Form>
            </PageHeaderWrapper>
            <FooterToolbar>
                <Button type="primary" onClick={() => { form.submit() }} loading={submitFlag}>提交</Button>
            </FooterToolbar>
        </>)

}

export default connect()(EditForm);