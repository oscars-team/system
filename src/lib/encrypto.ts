import { createDecipheriv, createCipheriv } from "crypto";

/**
 * AES加密的配置 
 * 1.密钥 
 * 2.偏移向量 
 * 3.算法模式CBC 
 * 4.补全值
 */
const AES_conf = {
    key: '18a5277f8197a9vc', //密钥
    iv: '1012132405963708', //偏移向量
    padding: 'PKCS7Padding' //补全值
}


/**
 * AES_128_CBC 加密 
 * 128位 
 * return base64
 */
const encryption = (data: string) => {
    let key = AES_conf.key;
    let iv = AES_conf.iv;
    // let padding = AES_conf.padding;
    var cipherChunks = [];
    var cipher = createCipheriv('aes-128-cbc', key, iv);
    cipher.setAutoPadding(true);
    cipherChunks.push(cipher.update(data, 'utf8', 'base64'));
    cipherChunks.push(cipher.final('base64'));
    return cipherChunks.join('');
}


/**
 * 解密
 * return utf8
 */
const decryption = (data: string) => {
    try {
        let key = AES_conf.key;
        let iv = AES_conf.iv;
        // let padding = AES_conf.padding;
        var cipherChunks = [];
        var decipher = createDecipheriv('aes-128-cbc', key, iv);
        decipher.setAutoPadding(true);
        cipherChunks.push(decipher.update(data, 'base64', 'utf8'));
        cipherChunks.push(decipher.final('utf8'));
        return cipherChunks.join('');
    } catch (err) {
        return '';
    }
}


/**
 * 查询加密
 */
export const encrytQuery = (obj: any) => {
    try {
        let query = JSON.stringify(obj);
        return encodeURIComponent(encryption(query));
    }
    catch (err) {
        return {}
    }
}

export const decryptQuery = (encryption: string) => {
    try {
        return decryption(decodeURIComponent(encryption));
    } catch (err) {
        return '';
    }
}

