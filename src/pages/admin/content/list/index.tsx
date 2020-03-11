import React, { useState, useEffect } from "react";
import { connect } from "dva";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import { Input, List, Card, Tooltip } from "antd";
import { ConnectProps } from "@/models/connect";
import router from 'umi/router';
import { IArticleItem } from "./data";
import { index } from "./service";
import { EditOutlined, DeleteOutlined, FunctionOutlined } from "@ant-design/icons";
import styles from "./index.less";
interface ArticleListProps extends ConnectProps {

}

const ArticleList: React.FC<ArticleListProps> = props => {

    const handleTabChange = (key: string) => {
        switch (key) {
            case 'all':
                router.push(`list?tab=all`);
                break;
            case 'draft':
                router.push(`list?tab=draft`);
                break;
            case 'trash':
                router.push(`list?tab=trash`);
                break;
            default: break;
        }
        setTabActiveKey(key);
    }



    const handleSearchSubmit = () => { }

    const mainSearch = (<div style={{ textAlign: 'center' }}>
        <Input.Search
            placeholder="输入标题搜索文章"
            enterButton="搜索"
            size="large"
            onSearch={handleSearchSubmit}
            style={{ maxWidth: 522, width: '100%' }}></Input.Search>
    </div>)



    const [tabActiveKey, setTabActiveKey] = useState<string>('all');
    const [dataSource, setDataSource] = useState<IArticleItem[]>([]);
    useEffect(() => {
        (async () => {
            let res = await index();
            if (res.err) {
                return;
            }
            setDataSource(res.data);
        })();
    }, [])

    return (<PageHeaderWrapper
        content={mainSearch}
        tabActiveKey={tabActiveKey}
        onTabChange={handleTabChange}
        tabList={[{
            key: 'all',
            tab: '所有文章'
        }, {
            key: 'draft',
            tab: '草稿'
        }, {
            key: 'trash',
            tab: '回收站'
        }]}>
        <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 6 }}
            dataSource={dataSource}
            renderItem={item => (
                <List.Item>
                    <Card
                        cover={
                            <div className={styles.cover}>
                                <img src={item.thumb ? item.thumb : 'http://127.0.0.1:7001/public/default/none.jpg'}
                                ></img>
                            </div>
                        }
                        actions={[
                            <Tooltip title="编辑文章">
                                <EditOutlined key='edit' onClick={() => { router.push('article?id=' + item._id) }} />
                            </Tooltip>,
                            <Tooltip title="编辑功能">
                                <FunctionOutlined key="campaign" onClick={() => { router.push('publish?id=' + item._id) }} />
                            </Tooltip>,
                            <Tooltip title="扔进回收站">
                                <DeleteOutlined key='trash' />
                            </Tooltip>,
                        ]}
                    >
                        <Card.Meta
                            title={item.title?.padEnd(20, ' ').substring(0, 19).trim()}
                            description={item.desc?.padEnd(100, ' ').substring(0, 99).trim()}
                            style={{ height: 100, overflow: 'hidden' }}
                        ></Card.Meta>
                    </Card>
                </List.Item>
            )}
        >

        </List>
    </PageHeaderWrapper >)
}

export default connect()(ArticleList);