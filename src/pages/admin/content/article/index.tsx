import React, { useState, useEffect } from "react";
import { connect, routerRedux } from "dva";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import { ConnectProps } from "@/models/connect";
import { Card, Input, Form, Modal, Button, message, Spin } from "antd";
import TextArea from "antd/lib/input/TextArea";
import FooterToolbar from "@/components/FooterToolbar";
import BraftEditor, { ExtendControlType } from "braft-editor";
import 'braft-editor/dist/index.css'
import { create, show, update } from "./service";
import { ArticleQuery } from "./data.d";
import { useRequest } from "@umijs/hooks";
import SimpleUpload from "@/components/Upload/Simple";

interface ArticleProps extends ConnectProps {

}
const Article: React.FC<ArticleProps> = props => {
    const { location, dispatch } = props;
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [pageActiveKey, setPageActiveKey] = useState<string>('manual');
    const [isSourceModalShow, setIsSourceModalShow] = useState<boolean>(false);
    const [sourceHTML, setSourceHTML] = useState<string>();
    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 18 },
        },
    };
    const [form] = Form.useForm();
    const { data, run, loading } = useRequest(() => show(location?.query.id), { manual: true });

    useEffect(() => {
        switch (location?.query.tab) {
            case 'download': setPageActiveKey('download'); break;
            case 'upload': setPageActiveKey('upload'); break;
            default: setPageActiveKey('manual'); break;
        }
    }, [])

    useEffect(() => {
        if (location?.query.id) run();
    }, [location?.query.id]);


    useEffect(() => {
        if (data) {
            const { content, ...rest } = data;
            form.setFieldsValue({
                content: BraftEditor.createEditorState(content),
                ...rest
            });
        }
        else {
            // 设置默认值
            form.setFieldsValue({
            })
        }
    }, [data]);


    const onFormFinish = async (values: any) => {
        const articleId = location?.query.id;
        const { content, ...rest } = values;
        let query: ArticleQuery = {
            ...rest,
            content: content.toHTML()
        };
        let hide = message.loading('正在保存文章');
        setSubmitting(true);
        let res;
        if (!articleId) {
            res = await create(query);
        } else {
            res = await update(articleId, query);
        }
        setSubmitting(false);
        hide();
        if (res.err) {
            message.error(res.errmsg);
            return;
        }
        message.success('保存成功');
    }


    const buildPreviewHtml = () => {
        return `
      <!Doctype html>
      <html>
        <head>
          <title>预览</title>
          <style>
            html,body{
              height: 100%;
              margin: 0;
              padding: 0;
              overflow: auto;
              background-color: #f1f2f3;
            }
            .container{
              box-sizing: border-box;
              width: 1000px;
              max-width: 100%;
              min-height: 100%;
              margin: 0 auto;
              padding: 30px 20px;
              overflow: hidden;
              background-color: #fff;
              border-right: solid 1px #eee;
              border-left: solid 1px #eee;
            }
            .container img,
            .container audio,
            .container video{
              max-width: 100%;
              height: auto;
            }
            .container p{
              white-space: pre-wrap;
              min-height: 1em;
            }
            .container pre{
              padding: 15px;
              background-color: #f1f1f1;
              border-radius: 5px;
            }
            .container blockquote{
              margin: 0;
              padding: 15px;
              background-color: #f1f1f1;
              border-left: 3px solid #d1d1d1;
            }
          </style>
        </head>
        <body>
          <div class="container">${form.getFieldValue("content")?.toHTML()}</div>
        </body>
      </html>
    `}

    const extendControls: ExtendControlType[] = [
        {
            key: 'copy-html',
            type: 'button',
            text: '来自源码',
            onClick: () => { setIsSourceModalShow(true); }
        }, {
            key: 'preview',
            type: 'button',
            text: '预览',
            onClick: () => {
                let win: any = window;

                if (win.previewWindow) {
                    win.previewWindow.close()
                }

                win.previewWindow = window.open()
                win.previewWindow.document.write(buildPreviewHtml())
                win.previewWindow.document.close()
            }
        }
    ]

    return (
        <>
            <PageHeaderWrapper
                tabActiveKey={pageActiveKey}
                onTabChange={(e) => { dispatch(routerRedux.push('article?tab=' + e)), setPageActiveKey(e); }}
                tabList={[
                    { key: 'manual', tab: '录入文章' },
                    { key: 'download', tab: '下载文章' },
                    { key: 'upload', tab: '上传文章' },
                ]}>
                <Spin spinning={loading}>
                    <Card title="编辑文章">
                        <Form  {...formItemLayout} style={{ maxWidth: 1200 }} form={form}
                            onFinish={onFormFinish}>
                            <Form.Item label="缩略图" name="thumb" >
                                <SimpleUpload name="thumb" onChange={(value) => { form.setFieldsValue({ thumb: value }) }} ></SimpleUpload>
                            </Form.Item>
                            <Form.Item label="文章标题" name="title" rules={[{
                                required: true,
                                message: '请输入文章标题'
                            }]}>
                                <Input></Input>
                            </Form.Item>
                            <Form.Item label="文章描述" name="desc">
                                <TextArea rows={3}></TextArea>
                            </Form.Item>

                            <Form.Item label="内容" name="content">
                                <BraftEditor
                                    style={{ border: '1px solid #d9d9d9', borderRadius: 2 }}
                                    contentStyle={{ height: "800px" }}
                                    extendControls={extendControls}
                                ></BraftEditor>
                            </Form.Item>
                        </Form>
                    </Card>
                </Spin>
                <Modal
                    title="输入HTML源码"
                    width={800}
                    visible={isSourceModalShow}
                    onCancel={() => { setIsSourceModalShow(false); }}
                    okText="开始转换"
                    onOk={() => {
                        form.setFieldsValue({
                            content: BraftEditor.createEditorState(sourceHTML),
                        });
                        setIsSourceModalShow(false);
                    }}>
                    <TextArea rows={20} value={sourceHTML} onChange={(e) => { setSourceHTML(e.target.value) }}></TextArea>
                </Modal>
            </PageHeaderWrapper>
            <FooterToolbar>
                <Button type="primary" onClick={() => { form.submit() }} loading={submitting}>保存</Button>
            </FooterToolbar>
        </>
    )
}

export default connect()(Article);