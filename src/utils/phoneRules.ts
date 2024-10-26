// 定义每个国家的电话号码规则
export const phoneRules = {
  '+1': { // 美国
    countryName: '美国',
    startsWith: ['2', '3', '4', '5', '6', '7', '8', '9'],
    lengths: [10],
    format: /^\+1[2-9]\d{9}$/,
    areaCodeRules: {
      'NY': ['212', '315', '332', '347', '516', '518', '585', '607', '631', '646', '680', '716', '718', '838', '845', '914', '917', '929', '934'],
      'CA': ['209', '213', '279', '310', '323', '341', '408', '415', '424', '442', '510', '530', '559', '562', '619', '626', '628', '650', '657', '661', '669', '707', '714', '747', '760', '805', '818', '820', '831', '858', '909', '916', '925', '949', '951'],
      'TX': ['210', '214', '254', '281', '325', '346', '361', '409', '430', '432', '469', '512', '682', '713', '726', '737', '806', '817', '830', '832', '903', '915', '936', '940', '956', '972', '979'],
      'FL': ['239', '305', '321', '352', '386', '407', '561', '727', '754', '772', '786', '813', '850', '863', '904', '941', '954'],
      'IL': ['217', '224', '309', '312', '331', '618', '630', '708', '773', '815', '847', '872']
    },
    carriers: {
      'AT&T': {
        prefixes: ['201', '203', '205', '207', '209', '210', '212', '213', '214', '215'],
        features: ['全美覆盖', '5G网络']
      },
      'Verizon': {
        prefixes: ['301', '302', '303', '304', '305', '306', '307', '308', '309', '310'],
        features: ['信号稳定', '企业服务']
      },
      'T-Mobile': {
        prefixes: ['401', '402', '403', '404', '405', '406', '407', '408', '409', '410'],
        features: ['资费优惠', '无限流量']
      }
    }
  },
  '+86': { // 中国大陆
    countryName: '中国大陆',
    startsWith: ['1'],
    lengths: [11],
    format: /^\+86[1][3-9]\d{9}$/,
    carriers: {
      '中国移动': {
        prefixes: ['134', '135', '136', '137', '138', '139', '150', '151', '152', '157', '158', '159', '178', '182', '183', '184', '187', '188', '198'],
        features: ['4G/5G网络覆盖广', '资费相对较低']
      },
      '中国联通': {
        prefixes: ['130', '131', '132', '155', '156', '166', '175', '176', '185', '186', '196'],
        features: ['网络质量稳定', '国际漫游优势']
      },
      '中国电信': {
        prefixes: ['133', '149', '153', '173', '177', '180', '181', '189', '191', '199'],
        features: ['光纤宽带优势', '网络速度快']
      }
    }
  },
  '+81': { // 日本
    countryName: '日本',
    startsWith: ['7', '8', '9'],
    lengths: [10],
    format: /^\+81[7-9]\d{8}$/,
    carriers: {
      'NTT DoCoMo': {
        prefixes: ['70', '80', '90'],
        features: ['覆盖范围最广', '5G网络领先']
      },
      'au by KDDI': {
        prefixes: ['70', '80', '90'],
        features: ['信号稳定性好', '用户满意度高']
      },
      'SoftBank': {
        prefixes: ['70', '80', '90'],
        features: ['资费方案灵活', '国际漫游优惠']
      }
    }
  },
  '+82': { // 韩国
    countryName: '韩国',
    startsWith: ['1'],
    lengths: [10],
    format: /^\+82[1]\d{8}$/,
    carriers: {
      'SK Telecom': {
        prefixes: ['10', '11', '16', '17', '19'],
        features: ['市场份额最大', '5G网络领先']
      },
      'KT': {
        prefixes: ['12', '13', '18'],
        features: ['网络质量稳定', '企业服务优势']
      },
      'LG U+': {
        prefixes: ['14', '15'],
        features: ['资费优惠', '创新服务多']
      }
    }
  },
  '+852': { // 中国香港
    countryName: '中国香港',
    startsWith: ['2', '3', '5', '6', '9'],
    lengths: [8],
    format: /^\+852[2356]\d{7}$/
  }
  // ... 其他国家的规则可以继续添加
};

export const validatePhoneNumber = (countryCode: string, phoneNumber: string): boolean => {
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  const rules = phoneRules[countryCode];
  
  if (!rules) return false;

  // 检查完整格式
  if (!rules.format.test(countryCode + cleanNumber)) {
    return false;
  }

  // 检查号码长度
  if (!rules.lengths.includes(cleanNumber.length)) {
    return false;
  }

  // 检查开头数字
  if (!rules.startsWith.includes(cleanNumber[0])) {
    return false;
  }

  // 运营商规则检查
  if (rules.carriers) {
    const prefix = cleanNumber.substring(0, 3);
    const isValidCarrier = Object.values(rules.carriers).some(carrier => {
      if ('prefixes' in carrier) {
        return carrier.prefixes.some(p => prefix.startsWith(p));
      }
      return false;
    });
    
    if (!isValidCarrier) {
      return false;
    }
  }

  // 特殊规则检查（美国区号）
  if (countryCode === '+1') {
    const areaCode = cleanNumber.substring(0, 3);
    const isValidAreaCode = Object.values(rules.areaCodeRules).some(
      codes => codes.includes(areaCode)
    );
    if (!isValidAreaCode) {
      return false;
    }
  }

  return true;
};

export const getPhoneNumberError = (countryCode: string, phoneNumber: string): string => {
  if (!phoneNumber) {
    return '请输入电话号码';
  }

  const rules = phoneRules[countryCode];
  if (!rules) {
    return '不支持该国家的号码验证';
  }

  const cleanNumber = phoneNumber.replace(/\D/g, '');
  
  // 检查号码长度
  if (!rules.lengths.includes(cleanNumber.length)) {
    return `${rules.countryName}号码长度应为${rules.lengths.join('或')}位`;
  }

  // 检查开头数字
  if (!rules.startsWith.includes(cleanNumber[0])) {
    return `${rules.countryName}号码应以${rules.startsWith.join('、')}开头`;
  }

  // 检查运营商
  if (rules.carriers) {
    const prefix = cleanNumber.substring(0, 3);
    const carrier = Object.entries(rules.carriers).find(([_, carrier]) => {
      if ('prefixes' in carrier) {
        return carrier.prefixes.some(p => prefix.startsWith(p));
      }
      return false;
    });

    if (!carrier) {
      return `该号码不属于${rules.countryName}的已知运营商`;
    }
  }

  // 检查美国区号
  if (countryCode === '+1') {
    const areaCode = cleanNumber.substring(0, 3);
    let state = '';
    let isValidAreaCode = false;
    
    for (const [stateName, codes] of Object.entries(rules.areaCodeRules)) {
      if (codes.includes(areaCode)) {
        state = stateName;
        isValidAreaCode = true;
        break;
      }
    }

    if (!isValidAreaCode) {
      return '无效的美国区号';
    }
  }

  if (!validatePhoneNumber(countryCode, phoneNumber)) {
    return `请输入有效的${rules.countryName}号码格式`;
  }

  return '';
};