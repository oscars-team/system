/**
 * Simple Article Component
 * 文章简单展示模块
 *  - 用于显示简要的文章信息
 */

import React, { useState, useEffect } from "react";
import { Row, Col, Skeleton } from "antd";
import { ArticleModel } from "../../data.d";
import { show } from "../../service";
import styles from "./index.less";
import moment from 'moment'
moment.locale('zh-cn');
interface SimpleArticleProps {
    articleid?: string
    article?: any,
    onLoaded?: (value: ArticleModel) => void
}
const SimpleArticle: React.FC<SimpleArticleProps> = props => {
    const { articleid, article, onLoaded } = props;
    const [model, setModel] = useState<ArticleModel>();
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        if (article) {
            setModel(article);
            return
        }
        if (articleid) {
            setLoading(true);
            (async () => {
                let res = await show(articleid);
                setLoading(false);
                if (res.err) {
                    return
                }
                setModel(res);
                onLoaded ? onLoaded(res) : null;
            })();
        }
    }, [article, articleid])
    return (
        <Skeleton loading={loading}>
            <Row gutter={[16, 16]}>
                <Col span={4} className={styles.cover}>
                    <img src={model?.thumb}></img>
                </Col>
                <Col span={6} className={styles.title}>
                    <h2>{model?.title}</h2>
                </Col>
                <Col span={14} className={styles.desc}>
                    <h3>{model?.desc}</h3>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <p style={{ color: '#999', fontStyle: 'italic' }}> {model?.update_at
                        ? `更新于 ${moment(model.update_at).format('llll')}`
                        : `创建于 ${moment(model?.create_at).format('llll')}`
                    }</p>
                </Col>
            </Row>
        </Skeleton>
    )
}

export default SimpleArticle;