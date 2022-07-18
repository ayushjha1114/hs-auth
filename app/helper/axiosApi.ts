import axios, { AxiosResponse } from 'axios';
import logger from '../lib/logger';
import { AuthModel } from '../models/authModel';

const axiosApi = {

    async postApiUpdateEmailMobile(apiUrl, type, updateValue, user_id) {
        let messageData = {
            type,
            updateValue
        }
        const responseData = await AuthModel.getLastFailedAttemptCount(user_id);
        const correlation_id = responseData.length && responseData[responseData.length - 1].correlation_id;
        
        const config = {
            method: 'post',
            url: `${apiUrl}/sap/api/v1/update-email-mobile/${user_id}`,
            data: messageData,
            headers: {
                'x-correlation-id': correlation_id,
            }
        };  

        logger.info(`Config email mobile ${JSON.stringify(config)}`);
        const response: AxiosResponse = await axios(config);
        // console.log('responseresponse', response)
        const { status, statusText, data } = response;
        if (status === 200) {
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
    }
};

export default axiosApi;


