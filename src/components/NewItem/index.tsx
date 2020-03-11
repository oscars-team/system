import React, { useState } from 'react';
import { PlusOutlined, CheckOutlined, CloseOutlined, LoadingOutlined } from '@ant-design/icons'
import styles from './index.less'
import { Input } from 'antd';
export interface NewItemProps {
    text?: string
    onSubmit?: (text: string) => void
    onCancel?: () => void
}

const NewItem: React.FC<NewItemProps> = props => {

    const {
        onSubmit,
        onCancel,
        text
    } = props;

    //#region ============ Hooks ============
    const [state, setState] = useState<string>('normal')
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [value, setValue] = useState<string>('')
    //#endregion

    const handleSubmit = async () => {
        setIsSubmit(true);
        if (onSubmit) await onSubmit(value);
        handleCancel();

    }
    const handleCancel = () => {
        if (onCancel) onCancel();
        setValue('');
        setState('normal');
        setIsSubmit(false);
    }

    const handelEdit = () => {
        setState('input');
    }

    const renderContent = () => {

        if (state === 'input')
            return (
                <div className={styles.input}>
                    <Input size="small" autoFocus={true}
                        value={value}
                        onChange={(e) => { setValue(e.target.value) }}
                        onKeyUp={(e) => { e.stopPropagation(); e.preventDefault(); if (e.keyCode === 13) handleSubmit() }}
                        disabled={isSubmit}
                    ></Input>
                    {isSubmit ?
                        <LoadingOutlined
                            className={styles.action}
                        ></LoadingOutlined> :
                        <CheckOutlined
                            className={styles.action}
                            onClick={handleSubmit}
                        ></CheckOutlined>
                    }

                    <CloseOutlined
                        className={styles.action}
                        onClick={handleCancel}
                    ></CloseOutlined>

                </div>
            )

        return (<>
            <div className={styles.normal} onClick={handelEdit}>
                <PlusOutlined ></PlusOutlined>&nbsp;
                {text}
            </div>
        </>)
    }

    return (
        <div className={styles.newitem}>
            {renderContent()}
        </div>
    )
}

export default NewItem;