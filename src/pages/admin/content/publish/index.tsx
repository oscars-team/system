import React, { useEffect, useState } from "react";
import { connect } from "dva";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import { Card, Form, Switch, Tooltip, Empty, Input, InputNumber, Button, message } from "antd";
import SimpleArticle from '../article/components/simplearticle'
import { ConnectProps } from "@/models/connect";
import FooterToolbar from "@/components/FooterToolbar";
import { show } from "../article/service";
import { ArticleModel } from "../article/data";
import Select from "@/components/Controls/Data/Select";
import { index } from "../../wechat/platform/service";
import { create } from "@/services/contentcampaign";
interface ArticlePublishProps extends ConnectProps {

}
const ArticlePublish: React.FC<ArticlePublishProps> = props => {

    const { location } = props;
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState<boolean>(false)
    const [model, setModel] = useState<ArticleModel>();
    const [enableRule, setEnableRule] = useState<boolean>(true);
    useEffect(() => {
        if (location?.query.id) {
            (async () => {
                let res = await show(location?.query.id);
                if (res.err) {
                    return
                }
                setModel(res);

                form.setFieldsValue({
                    title: `${(res as ArticleModel).title?.padEnd(10, ' ').substring(0, 9).trim()}的默认策略`,
                    depth: 0,
                    isForce: false,
                    isPartial: true,
                    partialPages: 4,
                    canSkip: true,
                    browsers: ['mobile'],
                    chance: 20
                })
            })();
        }
    }, [location?.query.id])

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

    const handleOnFinish = async (values: any) => {
        setSubmitting(true);
        let res = await create({ content: location?.query.id, ...values })
        setSubmitting(false);
        if (res.err) {
            message.error(res.errmsg);
            return;
        }
        message.success('保存成功');
    }
    return (<>
        <PageHeaderWrapper title="发布文章">
            <Card title="文章">
                <SimpleArticle article={model}
                    onLoaded={article => {
                    }}></SimpleArticle>
            </Card>
            <Card title="规则" style={{ marginTop: 24 }} extra={
                <Tooltip title={!enableRule ? '启用:用户浏览时会有规则限制' : '禁用:用户浏览时不受任何规则限制'} placement="right">
                    <Switch
                        checked={enableRule}
                        onChange={(e) => { setEnableRule(e) }}
                    >
                    </Switch>
                </Tooltip>}>
                {enableRule
                    ? (<Form
                        form={form}
                        onFinish={handleOnFinish}
                        {...layout}
                    >
                        <Form.Item label="标题" name="title">
                            <Input></Input>
                        </Form.Item>
                        <Form.Item label="转发深度" name="depth" rules={[{
                            required: true, message: '请填写转发深度'
                        }]}>
                            <InputNumber></InputNumber>
                        </Form.Item>
                        <Form.Item label="微信平台" name="platform" rules={[{
                            required: true, message: '请选择要发布的微信平台'
                        }]}>
                            <Select
                                request={index}
                                params={{}}
                                textField="title"
                                valueField="id"
                            >
                            </Select>
                        </Form.Item>
                        <Form.Item label="强制关注" name="isForce" valuePropName="checked">
                            <Switch checkedChildren="是" unCheckedChildren="否"></Switch>
                        </Form.Item>
                        <Form.Item label="是否部分显示" name="isPartial" valuePropName="checked">
                            <Switch checkedChildren="是" unCheckedChildren="否"></Switch>
                        </Form.Item>
                        <Form.Item label="部分显示页数" name="partialPages">
                            <InputNumber></InputNumber>
                        </Form.Item>
                        <Form.Item label="能否跳过" name="canSkip" valuePropName="checked">
                            <Switch checkedChildren="允许" unCheckedChildren="禁止"></Switch>
                        </Form.Item>
                        <Form.Item label="浏览器" name="browsers">
                            <Select mode="multiple"
                                dataSource={[{ text: '手机浏览器', value: 'mobile' }, { text: '电脑浏览器', value: 'desktop' }]}
                            >
                            </Select>
                        </Form.Item>
                        <Form.Item label="强制关注几率" name="chance">
                            <InputNumber></InputNumber>
                        </Form.Item>
                    </Form>)
                    : <Empty description="这篇文章不采用规则" image={Empty.PRESENTED_IMAGE_SIMPLE}></Empty>
                }
            </Card>
        </PageHeaderWrapper>
        <FooterToolbar inverse={true}>
            <Button type="primary" onClick={() => { form.submit() }} loading={submitting}>保存</Button>
        </FooterToolbar>
    </>)
}

export default connect()(ArticlePublish);