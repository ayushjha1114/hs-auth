import CryptoJS from 'crypto-js';
const secretKey = '10'
const commenHelper = {

    otp() {
        return Math.floor(100000 + Math.random() * 900000);
    },
    encrypt(data) {
        return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
    },
    decrypt(data) {
        const bytes = CryptoJS.AES.decrypt(data, secretKey);
        return bytes.toString(CryptoJS.enc.Utf8);
    },
    feUrl(envirement) {
        return process.env.FE_URL
    },
    modifyMobileNumber(mobileNumber) {
        if (!mobileNumber) return null;
        mobileNumber = mobileNumber.toString();
        if (mobileNumber.length < 10) return mobileNumber;
        return ('91' + mobileNumber.slice(-10));
    },
    beUrl(envirement) {
        return process.env.API_BASE_PATH
    },
    createUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    changeDateTimeInIST(time) {
        let dateUTC = new Date(time).getTime();
        let dateIST = new Date(dateUTC);
        //date shifting for IST timezone (+5 hours and 30 minutes)
        dateIST.setHours(dateIST.getHours() + 5);
        dateIST.setMinutes(dateIST.getMinutes() + 30);
        return dateIST;
    },
    isCircular(data) {
        try {
            JSON.stringify(data);
        } catch (e) {
            return true;
        }
        return false;
    },
    isJsonObject(data) {
        try {
            JSON.stringify(data);
        } catch (e) {
            return false;
        }
        return true;
    }
};

export default commenHelper;


