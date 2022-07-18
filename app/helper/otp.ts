import axios, { AxiosResponse } from 'axios';
declare function require(name: string);
const otpConfig = global['configuration'].otp;
import OtpConfig from '../config/otp';
import logger from '../lib/logger';
import commonHelper from '../helper';

const Otp = {
    async send_otp(otpData: { login_id: any, name: any, mobile: any, otp: any }) {

        const capitalizeFirstLetter = (str) => {
            const arr = str.split(" ");
            for (var i = 0; i < arr.length; i++) {
                arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
            }
            return arr.join(" ");
        }

        const messageData = JSON.stringify({
            "from": `${OtpConfig.global.from}`,
            "to": `${otpData.mobile}`,
            "msg": `${OtpConfig.global.message.replace(/##ZZZ##/g, capitalizeFirstLetter(otpData.name.toLowerCase())).replace(/##OTP##/g, otpData.otp)}`
        });

        const config = {
            method: 'post',
            url: otpConfig.apiUrl,
            headers: {
                'Content-Type': 'application/json'
            },
            auth: otpConfig.auth,
            data: messageData
        };

        const response: AxiosResponse = await axios(config);


        const { status, statusText, data } = response;
        if (status == 202) {
            return {
                status,
                message: statusText,
                data
            }
        } else {
            return {
                message: "Not Accepted",
                data: null
            }
        }
    },
    async send_update_otp(otpData) {
        const { mobile_number, distributor_id, otp_code, name } = otpData

        const messageData = JSON.stringify({
            "from": `${OtpConfig.global.from}`,
            "to": `${commonHelper.modifyMobileNumber(mobile_number)}`,
            "msg": `Dear ${name}, use OTP ${otp_code} to verify and update your mobile number. ~ ABC`
        });
        this.send_otp_axios(messageData)
    },
    async send_otp_axios(messageData) {
        try {
            const config = {
                method: 'post',
                url: otpConfig.apiUrl,
                headers: {
                    'Content-Type': 'application/json'
                },
                auth: otpConfig.auth,
                data: messageData
            };

            const response: AxiosResponse = await axios(config);

            logger.info('SMS response', response);
            const { status, statusText, data } = response;
            if (status == 202) {
                return {
                    status,
                    message: statusText,
                    data
                }
            } else {
                return {
                    message: "Not Accepted",
                    data: null
                }
            }
        } catch (err) {
            logger.error('error in sending sms: ', err);
            return {
                message: "Not Accepted",
                data: null
            }
        }
    },


};
export default Otp;
