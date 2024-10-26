// 定义国家区号和区域号段映射
export const countryAreaCodes = {
  '+1': { // 美国
    // ... 美国区号保持不变 ...
  },
};

// 定义国家号码格式规则
export const phoneNumberRules = {
  '+1': { // 美国/加拿大
    format: /^\+1[2-9]\d{9}$/, // +1 + NXX + 7位数字
    areaCodeLength: 3,
    totalLength: 12 // 包含+1
  },
  '+86': { // 中国
    format: /^\+86\d{11}$/,
    areaCodeLength: 0,
    totalLength: 14
  },
  '+852': { // 中国香港
    format: /^\+852[2-9]\d{7}$/,
    areaCodeLength: 0,
    totalLength: 12
  },
  '+81': { // 日本
    format: /^\+81[1-9]\d{8,9}$/,
    areaCodeLength: 0,
    totalLength: 12
  },
  '+82': { // 韩国
    format: /^\+82[1-9]\d{8,9}$/,
    areaCodeLength: 0,
    totalLength: 12
  },
  '+44': { // 英国
    format: /^\+44[1-9]\d{9}$/,
    areaCodeLength: 0,
    totalLength: 13
  },
  '+33': { // 法国
    format: /^\+33[1-9]\d{8}$/,
    areaCodeLength: 0,
    totalLength: 12
  },
  '+49': { // 德国
    format: /^\+49[1-9]\d{10}$/,
    areaCodeLength: 0,
    totalLength: 14
  },
  '+61': { // 澳大利亚
    format: /^\+61[1-9]\d{8}$/,
    areaCodeLength: 0,
    totalLength: 12
  },
  '+64': { // 新西兰
    format: /^\+64[1-9]\d{7,9}$/,
    areaCodeLength: 0,
    totalLength: 12
  },
  '+65': { // 新加坡
    format: /^\+65[1-9]\d{7}$/,
    areaCodeLength: 0,
    totalLength: 11
  },
  '+66': { // 泰国
    format: /^\+66[1-9]\d{8}$/,
    areaCodeLength: 0,
    totalLength: 12
  },
  '+84': { // 越南
    format: /^\+84[1-9]\d{8,9}$/,
    areaCodeLength: 0,
    totalLength: 12
  },
  '+91': { // 印度
    format: /^\+91[1-9]\d{9}$/,
    areaCodeLength: 0,
    totalLength: 13
  },
  '+62': { // 印度尼西亚
    format: /^\+62[1-9]\d{8,10}$/,
    areaCodeLength: 0,
    totalLength: 13
  },
  '+60': { // 马来西亚
    format: /^\+60[1-9]\d{7,9}$/,
    areaCodeLength: 0,
    totalLength: 12
  },
  '+63': { // 菲律宾
    format: /^\+63[1-9]\d{9}$/,
    areaCodeLength: 0,
    totalLength: 13
  },
  '+7': { // 俄罗斯
    format: /^\+7[1-9]\d{9}$/,
    areaCodeLength: 0,
    totalLength: 12
  }
};