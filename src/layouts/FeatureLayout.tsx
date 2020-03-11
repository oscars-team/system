import React, { useState, useRef, useEffect } from 'react'
import { connect } from 'dva';
import styles from './FeatureLayout.less';
import { useSize, useScroll } from '@umijs/hooks';
import { ConnectProps } from '@/models/connect';
import { decryptQuery } from "@/lib/encrypto";
import { show } from "@/services/contentcampaign";
import { ContentCampaignEntity } from "@/models/contentcampaign";
import { sign } from "@/services/feature";
import SocketLayout from './SocketLayout';
interface Size {
    width?: number;
    height?: number;
};
interface Position {
    left: number;
    top: number;
}
interface FeatureLayoutProps extends ConnectProps {
    children: React.ReactNode,
    /**
     * 指的是加密参数
     */
    params: any
    location: any
    onScrollBottom?: (dimention: Size, scroll: Position) => void
    /**
     * Feature 功能都加载完成
     */
    onReady: (params: any) => void
}
interface ISecret {
    cid: string,
    dep: number,
    frm: string
}

export interface IWechatSignResult {
    // 跳转地址, 如果有值说明需要跳转
    redirectUrl: string
    profile: any
}
/**
 * 这里对secret object做如下约定
 * {
 *  cid: 表示 content campaign id
 *  dep: 表示 转发深度, 即
 *       a->b           dep=1
 *       a->b->c        dep=2
 *       a->b, a->c     dep=1
 *       a->b->c->a->b  dep=2
 *  frm: 表示 文章来源
 * }
 * @param props Feature Post 处理的参数
 */
const FeatureLayout: React.FC<FeatureLayoutProps> = props => {
    const { children, onScrollBottom, params, onReady, location } = props
    const [popup, setPopup] = useState<boolean>(false)
    const [layoutHeight, setLayoutHeight] = useState<string>('400%');
    const [dimention] = useSize<HTMLBodyElement>(document.body);
    const [scroll] = useScroll(document);
    const layoutRef = useRef<HTMLDivElement>(null);
    const [isError, setError] = useState<boolean>(false);
    const [secret, setSecret] = useState<ISecret>();
    const [campaign, setCampaign] = useState<ContentCampaignEntity>();
    // Socket 链接token
    const [socketToken, setSocketToken] = useState();
    // 处理页面滑动的effect
    useEffect(() => {
        //计算是否显示popup
        if (dimention.height && layoutRef.current &&
            scroll.top > dimention.height &&
            layoutRef.current.clientHeight - scroll.top < dimention.height + 20) {
            // 此时已经滑到底了
            setPopup(true);
            onScrollBottom?.call(layoutRef.current, dimention, scroll);
        }
        else {
            setPopup(false);
        }
    }, [dimention.height, scroll.top])

    // 处理解密参数的effect
    useEffect(() => {
        if (!params.any) { setError(true); return }
        let secretStr;
        try {
            secretStr = decryptQuery(params.any);
            if (!secretStr) { setError(true); return }
            setSecret(JSON.parse(secretStr));
        } catch (err) {
            setError(true);
        }
    }, [params.any])

    // 处理获取内容的effect
    useEffect(() => {
        if (!secret) return;
        (async () => {
            let res = await show(secret.cid);
            if (res.err) {
                console.log(res);
                return;
            }
            setCampaign(res);
            onReady ? onReady(res) : null;
        })();
    }, [secret])

    // 处理Socket链接的effect
    // Socket 链接成功标志
    useEffect(() => {
        if (!socketToken) return;
        if (!campaign?.platform) return;
        (async () => {
            let redirect = await sign(campaign?.platform, { sourceUrl: `${window.location.origin}${window.location.pathname}` })
            console.log(redirect);
        })();
    }, [socketToken, campaign])



    return (
        <SocketLayout
            server="http://127.0.0.1:7001"
            nsp="/feature"
            onConnect={(socket, args) => { setSocketToken(args); }}
            onDisconnect={() => { console.log('disconnect'); }}
        >
            {/* // wrapper
                // 根据设定来显示页数
                // 比如 设置只显示 4页 -> height:'400%'
                // 同时要根据 isPartial 参数来决定是否部分显示 */}
            <div
                ref={layoutRef}
                className={styles.layout}
                style={{
                    height: layoutHeight
                }}>

                <div className={styles.modal} style={{ display: popup ? 'block' : 'none' }}>
                    <div className={styles.pop}>
                        <div className={styles.content}>
                        </div>
                    </div>
                </div>
                {children}
                <br />
                code: {location.code}, state: {location.state}
                <br />
                {JSON.stringify(socketToken)}
            </div >
        </SocketLayout>
    )
}

export default connect()(FeatureLayout)