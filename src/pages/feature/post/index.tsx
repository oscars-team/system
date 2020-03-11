import React, { useState } from 'react'
import FeatureLayout from "@/layouts/FeatureLayout";
import { connect } from 'dva';
import { ConnectProps } from '@/models/connect';
interface FeaturePostProps extends ConnectProps {

}
const FeaturePost: React.FC<FeaturePostProps> = props => {
    const { match, location } = props;
    const [campaign, setCampaign] = useState();
    return (<FeatureLayout
        params={match?.params}
        location={location}
        onReady={(params) => { setCampaign(params) }}
    >
        {campaign ? JSON.stringify(campaign) : null}
    </FeatureLayout>)


}

export default connect()(FeaturePost)