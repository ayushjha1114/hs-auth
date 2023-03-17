import moment from "moment";

const customerEmailTicketCreationTemplate = (data) => {
    const { customer, ticket_number } = data;
    return `<p>Dear ${customer}</p>
            </br>
            <p>Your ticket has been created with Ticket No. ${ticket_number}. Someone from our customer service team will review it and respond shortly. 
            Please let us know if you have any query regarding this complaint. </p> 
            </br>
            <p>
                Regards
                <br> 
                Support Team
            </p>
            <img src="cid:logo" alt="DGSOFT" width="140" height="30">
            <br>
            <img src="cid:map" alt="Google Maps" width="35" height="35">
            <h4>9, The Edge, Ground Floor, Behind Prakash Talkies, Palghar(West) - 401404</h4>
            </br>
            <p>
                HELP DESK- +9175888444478
                <br>
                Email- info@dgsoft.in
                <br>
                Website- www.dgsoft.org
            </p>
            </br>
            <img src="cid:follow" alt="Follow" width="100" height="80">
            <br>
            <a href="https://www.facebook.com/dgsoftinfotek"><img src="cid:facebook" alt="FaceBook" width="30" height="30"></a>
            <a href="https://twitter.com/dgsoftinfotek"><img src="cid:twitter" alt="twitter" width="30" height="30"></a>
            <a href="https://www.instagram.com/dgsoftinfotek/"><img src="cid:instagram" alt="instagram" width="30" height="30"></a>
            <a href="https://www.linkedin.com/in/dgsoftinfotek/"><img src="cid:linkedin" alt="linkedin" width="30" height="30"></a>
            <a href="https://api.whatsapp.com/send?phone=919326943126&text=&source=&data="><img src="cid:whatsapp" alt="whatsapp" width="30" height="30"></a>
            `
}

const engineerEmailTicketCreationTemplate = (data) => {
    const { customer, service_provided, ticket_number, priority='-', remark='-', visit_address='-', userData, parent_service } = data;
    const { amcDetail = {} } = userData;
    const { plan_expired_date = '' } = amcDetail;

    return `<p>Hi</p>
            </br>
            <p>
                New Ticket Created.
                <br>
                Party Name: ${customer}
                <br>
                Ticket No: ${ticket_number}
                <br>
                Product: ${parent_service}
                <br>
                Problem: ${service_provided}
                <br>
                Priority: ${priority}
                <br>
                Remark: ${remark}
                <br>
                AMC Valid Till: ${plan_expired_date ? moment(plan_expired_date).format('ll') : '-'}
                <br>
                Party Address: ${visit_address}
            </p> 
            </br>
            <p>
                Regards
                <br> 
                Admin Team
            </p>
            <img src="cid:logo" alt="DGSOFT" width="140" height="30">
            <br>
            <img src="cid:map" alt="Google Maps" width="35" height="35">
            <h4>9, The Edge, Ground Floor, Behind Prakash Talkies, Palghar(West) - 401404</h4>
            </br>
            <p>
                HELP DESK- +9175888444478
                <br>
                Email- info@dgsoft.in
                <br>
                Website- www.dgsoft.org
            </p>
            </br>
            <img src="cid:follow" alt="Follow" width="100" height="80">
            <br>
            <a href="https://www.facebook.com/dgsoftinfotek"><img src="cid:facebook" alt="FaceBook" width="30" height="30"></a>
            <a href="https://twitter.com/dgsoftinfotek"><img src="cid:twitter" alt="twitter" width="30" height="30"></a>
            <a href="https://www.instagram.com/dgsoftinfotek/"><img src="cid:instagram" alt="instagram" width="30" height="30"></a>
            <a href="https://www.linkedin.com/in/dgsoftinfotek/"><img src="cid:linkedin" alt="linkedin" width="30" height="30"></a>
            <a href="https://api.whatsapp.com/send?phone=919326943126&text=&source=&data="><img src="cid:whatsapp" alt="whatsapp" width="30" height="30"></a>
            `
}

export { customerEmailTicketCreationTemplate, engineerEmailTicketCreationTemplate };