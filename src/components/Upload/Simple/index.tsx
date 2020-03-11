
import React, { useState, useEffect } from "react";
import { Upload, message } from 'antd';
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";

interface SimpleUploadProps {
    name?: string
    value?: string
    onChange?: (value: string) => void;
}



const SimpleUpload: React.FC<SimpleUploadProps> = props => {
    const { name, value: valueProp, onChange } = props;
    const [imageUrl, setImageUrl] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (info: any) => {

        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            setLoading(false);
            setImageUrl(info.file.response.url);
            onChange ? onChange(info.file.response.url) : null;
        }
    };

    useEffect(() => {
        valueProp ? setImageUrl(valueProp) : null;
    }, [valueProp])

    const beforeUpload = (file: { type: string; size: number; }) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('只支持 JPG/PNG 文件!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('只支持小于 2MB 的图片!');
        }
        return isJpgOrPng && isLt2M;
    }

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div className="ant-upload-text">上传</div>
        </div>
    );

    return (
        <Upload
            name={name}
            listType="picture-card"
            showUploadList={false}
            action="/api/static/resources"
            beforeUpload={beforeUpload}
            onChange={handleChange}
        >
            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
        </Upload>
    );
}

export default SimpleUpload;

