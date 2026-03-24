// Canvas 初始化
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// 设置 Canvas 大小为窗口大小
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();

// 粒子数组
let particles = [];
let mouseX = 0;
let mouseY = 0;
const mouseRadius = 150;

// 粒子类
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2.5 + 1;
    this.speedX = (Math.random() - 0.5) * 0.8;
    this.speedY = (Math.random() - 0.5) * 0.8;
    this.opacity = Math.random() * 0.6 + 0.2;
    this.originalOpacity = this.opacity;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // 边界处理
    if (this.x > canvas.width) this.x = 0;
    if (this.x < 0) this.x = canvas.width;
    if (this.y > canvas.height) this.y = 0;
    if (this.y < 0) this.y = canvas.height;

    // 鼠标交互
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < mouseRadius) {
      const angle = Math.atan2(dy, dx);
      this.speedX = -Math.cos(angle) * 3;
      this.speedY = -Math.sin(angle) * 3;
      this.opacity = 0.8;
    } else {
      this.opacity = this.originalOpacity;
    }
  }

  draw() {
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 初始化粒子
function initParticles() {
  particles = [];
  const particleCount = Math.min(150, Math.floor((canvas.width * canvas.height) / 10000));
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

initParticles();

// 绘制连接线
function drawConnections() {
  ctx.globalAlpha = 0.15;
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2;

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

// 动画循环
function animate() {
  // 清空画布并绘制背景渐变
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#0f172a');
  gradient.addColorStop(1, '#1e3a8a');
  
  ctx.globalAlpha = 1;
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 绘制连接线
  drawConnections();

  // 更新和绘制粒子
  particles.forEach(particle => {
    particle.update();
    particle.draw();
  });

  ctx.globalAlpha = 1;
  requestAnimationFrame(animate);
}

animate();

// 事件监听
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

window.addEventListener('resize', () => {
  resizeCanvas();
  initParticles();
});

// 触摸事件（手机支持）
document.addEventListener('touchmove', (e) => {
  if (e.touches.length > 0) {
    mouseX = e.touches[0].clientX;
    mouseY = e.touches[0].clientY;
  }
});

// 平滑滚动函数
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// 处理导航链接点击
document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      scrollToSection(href.substring(1));
    }
  });
});