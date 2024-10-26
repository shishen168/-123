export interface MonthlyRevenue {
  month: string;
  amount: number;
  userCount: number;
}

class RevenueService {
  getMonthlyRevenue(startDate: Date | null, endDate: Date | null): MonthlyRevenue[] {
    // 从localStorage获取用户数据
    const savedUsers = localStorage.getItem('users');
    if (!savedUsers) return [];

    const users = JSON.parse(savedUsers);
    const revenueMap = new Map<string, MonthlyRevenue>();

    // 处理每个用户的充值记录
    users.forEach((user: any) => {
      const rechargeAmount = user.totalRecharge || 0;
      const registerDate = new Date(user.registerDate);
      const month = `${registerDate.getFullYear()}/${String(registerDate.getMonth() + 1).padStart(2, '0')}`;

      if (startDate && endDate) {
        const recordDate = new Date(registerDate);
        if (recordDate < startDate || recordDate > endDate) return;
      }

      if (!revenueMap.has(month)) {
        revenueMap.set(month, {
          month,
          amount: 0,
          userCount: 0
        });
      }

      const monthData = revenueMap.get(month)!;
      monthData.amount += rechargeAmount;
      monthData.userCount += 1;
    });

    // 转换为数组并排序
    return Array.from(revenueMap.values())
      .sort((a, b) => a.month.localeCompare(b.month));
  }
}

export const revenueService = new RevenueService();