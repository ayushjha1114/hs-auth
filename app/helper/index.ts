import CryptoJS from 'crypto-js';
const secretKey = '10'
const commonHelper = {
    encrypt(data) {
        return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
    },
    decrypt(data) {
        const bytes = CryptoJS.AES.decrypt(data, secretKey);
        return bytes.toString(CryptoJS.enc.Utf8);
    },
    createUniqueTicketNumber(lastTicket) {
        if ((lastTicket === 'null') || (Object.keys(lastTicket).length === 0)) {
            return 'DGST-00000001';
        } else {
            let id = JSON.parse(lastTicket).ticket_number.split('-')[1];
            const finalNumber = String(Number(id) + 1).padStart(8, '0');
            return 'DGST-' + finalNumber;
        }
    },
    createUniqueUserNumber(lastUser) {
        if ((lastUser === 'null') || (Object.keys(lastUser).length === 0)) {
            return '#DGCID-000001';
        } else {
            let id = JSON.parse(lastUser).user_id.split('-')[1];
            const finalNumber = String(Number(id) + 1).padStart(6, '0');
            return '#DGCID-' + finalNumber;
        }
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

export default commonHelper;


