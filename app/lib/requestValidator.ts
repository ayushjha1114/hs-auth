const Joi = require('joi');

const appLevelConfigurationItem = Joi.object().keys({
  key: Joi.string().required(),
  value: Joi.string().required(),
  remarks: Joi.string().required()
});

const validation = {
  loginUser: {
    body: {
      login_id: Joi.string().required(),
      password: Joi.string().min(6).max(50).required()
    }
  },
  changePassword: {
    body: {
      current_password: Joi.string().required(),
      new_password: Joi.string().min(6).max(50).required()
    },
  },
  createUser: {
    body: {
      username: Joi.string().min(4).max(50).required(),
      password: Joi.string().min(6).max(50).required(),
      email: Joi.string().regex(/^[\w.]+@[\w]+?(\.[a-zA-Z]{2,3}){1,3}$/).required(),
      verify_password: Joi.string().min(6).max(50).required()
    },
  },
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
  updateDistributorSettings: {
    params: {
      distributor_id: Joi.string().required()
    },
    body: {
      enable_po_so_sms: Joi.boolean(),
      enable_po_so_email: Joi.boolean(),
      enable_invoice_sync_sms: Joi.boolean(),
      enable_invoice_sync_email: Joi.boolean(),
      enable_login: Joi.boolean(),
      sms_tse_asm: Joi.boolean(),
      email_tse_asm: Joi.boolean(),
      remarks: Joi.string().required(),
      // changed_by: Joi.string().required()
    }
  },
  alertCommentList: {
    params: {
      distributor_id: Joi.string().required(),
    }
  },
  updateDistributorMobile: {
    body: {
      mobile_number: Joi.string().regex(/^[0-9]{10,12}$/).required(),
    },
    params: {
      distributor_id: Joi.string().required(),
    }
  },
  updateDistributorEmail: {
    body: {
      email: Joi.string().email().required(),
    },
    params: {
      distributor_id: Joi.string().required(),
    }
  },
  updateTseUserSetting: {
    body: {
      user_id: Joi.string().required(),
      enableLogin: Joi.string().valid('ACTIVE', 'INACTIVE'),
      role: Joi.string().valid('SUPER_ADMIN', 'DIST_ADMIN', 'TSE')
    }
  },
  updateAppLevelSettings: {
    body: {
      app_level_configuration: Joi.array().items(appLevelConfigurationItem).min(1).required(),
    }
  }
};
export default validation
