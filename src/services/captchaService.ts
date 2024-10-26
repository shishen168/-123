import { createCanvas } from 'canvas';

class CaptchaService {
  private captchaCode: string = '';
  private readonly width = 120;
  private readonly height = 40;

  generateCaptcha(): string {
    // 生成随机验证码
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.captchaCode = Array(4)
      .fill(0)
      .map(() => chars[Math.floor(Math.random() * chars.length)])
      .join('');

    // 创建 canvas
    const canvas = createCanvas(this.width, this.height);
    const ctx = canvas.getContext('2d');

    // 设置背景
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, this.width, this.height);

    // 绘制文字
    const fontSize = 24;
    ctx.font = `${fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 为每个字符添加随机样式
    for (let i = 0; i < this.captchaCode.length; i++) {
      const x = (i + 1) * (this.width / (this.captchaCode.length + 1));
      const y = this.height / 2;
      const rotation = (Math.random() - 0.5) * 0.3;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.fillStyle = `rgb(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 100})`;
      ctx.fillText(this.captchaCode[i], 0, 0);
      ctx.restore();
    }

    // 添加干扰线
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`;
      ctx.lineWidth = 1;
      ctx.moveTo(Math.random() * this.width, Math.random() * this.height);
      ctx.lineTo(Math.random() * this.width, Math.random() * this.height);
      ctx.stroke();
    }

    // 添加噪点
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`;
      ctx.fillRect(
        Math.random() * this.width,
        Math.random() * this.height,
        2,
        2
      );
    }

    return canvas.toDataURL();
  }

  validateCaptcha(input: string): boolean {
    return input.toUpperCase() === this.captchaCode;
  }
}

export const captchaService = new CaptchaService();