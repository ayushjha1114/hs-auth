const Joi = require('joi');

const appLevelConfigurationItem = Joi.object().keys({
  key: Joi.string().required(),
  value: Joi.string().required(),
  remarks: Joi.string().required()
});

const validation = {
  loginUser: Joi.object({
      mobile: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
      password: Joi.string().min(6).max(50).required()
    }),
  changePassword: {
    body: {
      current_password: Joi.string().required(),
      new_password: Joi.string().min(6).max(50).required()
    },
  },
  createUser: Joi.object({
      first_name: Joi.string().max(50).required(),
      email: Joi.string().regex(/^[\w.]+@[\w]+?(\.[a-zA-Z]{2,3}){1,3}$/).required(),
      password: Joi.string().min(6).max(50).required(),
      mobile: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
      role: Joi.string().valid('ADMIN', 'USER', 'ADMIN', 'ENGINEER').required(),
      date_of_birth: Joi.string(),
      gender:  Joi.string().valid('male', 'female', 'other'),
      aadhaar_number: Joi.string().length(12).pattern(/^[0-9]+$/),
      current_address: Joi.string(),
      permanent_address: Joi.string(),
      current_state: Joi.string(),
      current_city: Joi.string(),
      current_pincode: Joi.string(),
      permanent_state: Joi.string(),
      permanent_city: Joi.string(),
      permanent_pincode: Joi.string(),
    }),
  resetPassword: {
    body: {
      login_id: Joi.string().required(),
      otp: Joi.string().regex(/^[0-9]{6}$/).required(),
      password: Joi.string().min(6).max(50).required()
    }
  },
  generateOtp: {
    body: {
      login_id: Joi.string().required()
    }
  },
  updateAlert: {
    body: {
      cloumn_name: Joi.array().required(),
      login_id: Joi.string().required(),
    }
  },
  getAlert: {
    params: {

      id: Joi.string().required(),
    }
  },
  sendOtpMailMobile: {
    body: {
      type: Joi.string().required(),
      updateValue: Joi.string().required(),
    }
  },
  sessions: {
    body: {
      from: Joi.string().required(),
      to: Joi.string().required(),
      type: Joi.string().valid('all', 'success', 'failure', 'active', ''),
      login_id: Joi.string(),
      search: Joi.string().allow(''),
    }
  },
  verifyMobile: {
    body: {
      otp: Joi.number().required(),
    }
  },
  verifyEmail: {
    params: {
      id: Joi.string().required(),
    }
  },
  distributorList: {
    body: {
      limit: Joi.number().required(),
      offset: Joi.number().required(),
      search: Joi.string().allow(''),
    }
  },
  updateLoginSetting: {
    params: {
      distributor_id: Joi.string().required()
    },
    body: {
      enable_login: Joi.boolean().required()
    }
  },
  updateAlertSettings: {
    params: {
      distributor_id: Joi.string().required()
    },
    body: {
      enable_po_so_sms: Joi.boolean(),
      enable_po_so_email: Joi.boolean(),
      enable_invoice_sync_sms: Joi.boolean(),
      enable_invoice_sync_email: Joi.boolean(),
      sms_tse_asm: Joi.boolean(),
      email_tse_asm: Joi.boolean(),
    }
  },
  updateAlertHistory: {
    params: {
      distributor_id: Joi.string().required()
    },
    body: {
      alert_setting_changes: Joi.object().keys({
        enable_po_so_sms: Joi.boolean(),
        enable_po_so_email: Joi.boolean(),
        enable_invoice_sync_sms: Joi.boolean(),
        enable_invoice_sync_email: Joi.boolean(),
        enable_login: Joi.boolean(),
        sms_tse_asm: Joi.boolean(),
        email_tse_asm: Joi.boolean(),
      }).required(),
      remarks: Joi.string().required(),
      // changed_by: Joi.string().required()
    }
  },
};
export default validation
