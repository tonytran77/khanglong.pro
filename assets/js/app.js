/**
 * KHANG LONG CYBER HUB — JAVASCRIPT APPLICATION ENGINE
 * Pure Vanilla JS · Zero Dependencies · High Performance
 * Supports both Fetch (HTTP/GitHub Pages) and Embedded Fallback (Local file://)
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initTheme();
  loadDataAndRender();
  initAiAssistant();
  initTimelineToggle();
  initAuthModal();
});

/* ================= 1. CANVAS PARTICLES ANIMATION ================= */
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.min(Math.floor(width / 25), 60);
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.5 + 0.8,
      alpha: Math.random() * 0.5 + 0.2
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${p.alpha})`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${0.12 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ================= 2. THEME CONTROLLER ================= */
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  const initialTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const savedTheme = localStorage.getItem('kl_theme') || initialTheme;

  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('kl_theme', next);
      updateThemeIcon(next);
    });
  }
}

function updateThemeIcon(theme) {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;
  toggleBtn.innerHTML = theme === 'dark' 
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/></svg>`;
}

/* ================= 3. FALLBACK DATA STORE ================= */
const FALLBACK_DATA = {
  skills: [
    {
      category: "Hạ Tầng & Thiết Bị Mạng",
      color: "#38bdf8",
      items: [
        { name: "Cisco Routing & Switching", highlight: true },
        { name: "Firewall & Security Gateways", highlight: true },
        { name: "VLAN & Inter-VLAN Routing", highlight: false },
        { name: "Enterprise LAN/WAN", highlight: false },
        { name: "Wifi Diện Rộng & Cân Bằng Tải", highlight: true },
        { name: "VPN / Remote Access (Site-to-Site, SSL)", highlight: false }
      ]
    },
    {
      category: "Quản Trị Hệ Thống & Server",
      color: "#38bdf8",
      items: [
        { name: "Windows Server (2012 - 2022)", highlight: true },
        { name: "Active Directory & GPO", highlight: true },
        { name: "DHCP / DNS / WINS / File Server", highlight: false },
        { name: "Sao Lưu & Phục Hồi Thảm Họa", highlight: true },
        { name: "Linux Server (Ubuntu / CentOS)", highlight: false },
        { name: "Quản trị Hosting cPanel / WHM", highlight: true }
      ]
    },
    {
      category: "Hệ Sinh Thái Microsoft 365",
      color: "#818cf8",
      items: [
        { name: "Microsoft 365 Enterprise", highlight: true },
        { name: "Exchange Online & Mail Server", highlight: true },
        { name: "SharePoint Online & Teams", highlight: false },
        { name: "OneDrive for Business & Intune", highlight: false },
        { name: "Quản Lý Định Danh Azure AD", highlight: false },
        { name: "MCSA / MCITP Certified", highlight: true }
      ]
    },
    {
      category: "An Ninh & Giám Sát Doanh Nghiệp",
      color: "#34d399",
      items: [
        { name: "Hệ thống Camera Giám Sát IP / NVR", highlight: true },
        { name: "Chính Sách An Toàn Thông Tin", highlight: true },
        { name: "Phân Quyền & Giám Sát Nhật Ký Hệ Thống", highlight: false },
        { name: "Phòng Chống Xâm Nhập & Quét Lỗ Hổng", highlight: false },
        { name: "Kiểm Soát Ra Vào (Access Control)", highlight: false },
        { name: "Bảo Vệ Dữ Liệu Đầu Cuối Endpoint", highlight: false }
      ]
    },
    {
      category: "Trí Tuệ Nhân Tạo & Tự Động Hóa",
      color: "#c084fc",
      items: [
        { name: "AI Agent Orchestration", highlight: true },
        { name: "Quy Trình Tự Động Hóa Workflow", highlight: true },
        { name: "Tích Hợp API LLM (Gemini, Claude)", highlight: false },
        { name: "Xử Lý Dữ Liệu Tự Động (Python)", highlight: false },
        { name: "Chatbot Tư Vấn Khách Hàng 24/7", highlight: false },
        { name: "Lập Trình Web App Quản Trị Hiện Đại", highlight: false }
      ]
    },
    {
      category: "Vận Hành CNTT & Cloud (IT Ops)",
      color: "#fb923c",
      items: [
        { name: "Hỗ Trợ Kỹ Thuật Helpdesk (SLA 99.9%)", highlight: true },
        { name: "Điện Toán Đám Mây (Cloud VPS / Azure)", highlight: true },
        { name: "Hệ Thống Lưu Trữ Tập Trung (NAS / SAN)", highlight: false },
        { name: "Quản Lý Vận Hành Tài Sản CNTT", highlight: false },
        { name: "Giám Sát Tải Mạng 24/7 (PRTG / Zabbix)", highlight: false },
        { name: "Khắc Phục Sự Cố Khẩn Cấp Tận Nơi", highlight: true }
      ]
    }
  ],
  projects: [
    {
      id: "thep-phu-my",
      name: "Hạ Tầng Server/Client – Công Ty Thép Tấm Lá Phú Mỹ",
      location: "Bà Rịa – Vũng Tàu",
      badge: "Doanh Nghiệp Lớn",
      summary: "Thiết kế, triển khai hạ tầng máy chủ và hệ thống mạng nội bộ bảo mật cao phục vụ nhà máy sản xuất thép quy mô công nghiệp nặng.",
      highlights: [
        "Xây dựng hạ tầng Windows Server và Active Directory tập trung",
        "Thiết lập phân quyền bảo mật, chính sách Group Policy (GPO) chặt chẽ",
        "Triển khai quy trình sao lưu định kỳ và dự phòng phục hồi sự cố"
      ],
      tech: ["Windows Server", "Active Directory", "Cisco Switches", "RAID Storage"]
    },
    {
      id: "resort-phu-yen",
      name: "Hệ Thống Camera & Wifi Diện Rộng – Khu Nghỉ Dưỡng Phú Yên",
      location: "Phú Yên",
      badge: "Du Lịch & Khách Sạn",
      summary: "Thi công toàn bộ hệ thống giám sát an ninh camera IP và mạng Wifi phủ sóng mật độ cao cho toàn thể khuôn viên khu nghỉ dưỡng.",
      highlights: [
        "Phủ sóng Wifi diện rộng với roaming không ngắt quãng cho hàng trăm khách lưu trú",
        "Lắp đặt hệ thống camera giám sát IP chuẩn nét cao, kết nối trung tâm điều hành",
        "Tách biệt mạng nội bộ quản lý và mạng Wifi khách hàng để đảm bảo an toàn thông tin"
      ],
      tech: ["Enterprise Wifi", "IP Cameras", "NVR Storage", "VLAN", "PoE Switching"]
    },
    {
      id: "cho-hoa-lu",
      name: "Hạ Tầng Mạng Không Dây Diện Rộng – Chợ Hoa Lư",
      location: "Quy Nhơn",
      badge: "Khu Thương Mại",
      summary: "Triển khai hạ tầng mạng phủ sóng rộng, quản lý truy cập và phân bổ băng thông hiệu quả cho khu vực thương mại dịch vụ đông đúc.",
      highlights: [
        "Cấu hình cân bằng tải đa đường truyền (Multi-WAN Load Balancing)",
        "Kiểm soát băng thông theo từng nhóm đối tượng sử dụng",
        "Đảm bảo kết nối ổn định liên tục trong môi trường nhiều vật cản sóng"
      ],
      tech: ["High-power APs", "Load Balancing", "Bandwidth Management", "QoS"]
    },
    {
      id: "hotel-4star-system",
      name: "Quản Trị Vận Hành Hạ Tầng CNTT Khách Sạn 4 Sao",
      location: "Quy Nhơn",
      badge: "Vận Hành Thực Tế",
      summary: "Quản trị, vận hành và giám sát toàn bộ hạ tầng máy chủ, máy trạm, thiết bị mạng, hệ thống Wifi nội bộ và phục vụ khách sạn cao cấp.",
      highlights: [
        "Đảm bảo thời gian hoạt động hệ thống (uptime) đạt 99.9%",
        "Khắc phục sự cố kỹ thuật 24/7 cho toàn thể nhân sự và du khách",
        "Tối ưu hóa băng thông đường truyền và bảo mật mạng thanh toán"
      ],
      tech: ["Helpdesk System", "Windows Server", "VLAN", "Firewall", "Disaster Recovery"]
    }
  ],
  timeline: [
    {
      year: "2024 – Hiện nay",
      role: "Chuyên Viên IT Helpdesk & Quản Trị Hệ Thống Mạng",
      company: "Khách Sạn 4 Sao",
      desc: "Quản trị, vận hành và giám sát toàn bộ hạ tầng CNTT (máy chủ, máy trạm, Cisco switch, Wifi nội bộ/khách, VPN, kiểm soát an ninh mạng)."
    },
    {
      year: "2015 – 2024",
      role: "Chuyên Viên Thiết Kế & Thi Công Hạ Tầng CNTT",
      company: "Công Ty TNHH Trang Thiết Bị – Viễn Thông Hoàng Long",
      desc: "Thiết kế giải pháp, tổ chức triển khai và nghiệm thu hệ thống mạng, máy tính, giám sát an ninh cho khách hàng doanh nghiệp quy mô lớn trên toàn quốc."
    },
    {
      year: "2012 – 2015",
      role: "Quản Lý Cơ Sở",
      company: "Trường Cao Đẳng An Ninh Mạng iSPACE – Cơ Sở Quy Nhơn",
      desc: "Quản lý hoạt động đào tạo, điều phối giảng viên và kỹ thuật viên; xây dựng hạ tầng phòng lab thực hành, hệ thống máy chủ trung tâm; đào tạo an ninh mạng cho học viên."
    },
    {
      year: "2012",
      role: "Chứng Chỉ CCNA Cisco Quốc Tế",
      company: "Trung Tâm Tin Học VnPro (TP.HCM)",
      desc: "Tốt nghiệp khóa đào tạo Quản trị Mạng Cisco chuyên sâu và nhận chứng chỉ CCNA do Trung tâm VnPro cấp."
    },
    {
      year: "2011",
      role: "Chứng Chỉ MCSA & MCITP Microsoft",
      company: "Trung Tâm Đào Tạo CNTT Nhất Nghệ (TP.HCM)",
      desc: "Tốt nghiệp khóa đào tạo Quản trị Hệ thống Mạng Microsoft và nhận chứng chỉ chuyên môn MCSA, MCITP."
    },
    {
      year: "2007 – 2012",
      role: "Nhân Viên Quản Trị Hệ Thống CNTT",
      company: "Xưởng May Xuất Khẩu Un-Available",
      desc: "Vận hành, bảo trì máy tính, thiết bị ngoại vi; quản trị hạ tầng Server/Client; thực hiện chính sách bảo mật và sao lưu dữ liệu sản xuất."
    },
    {
      year: "2005 – 2007",
      role: "Kỹ Thuật Viên Phần Cứng & Mạng",
      company: "Công Ty Máy Tính Quang Huy (Quận 1, TP.HCM)",
      desc: "Lắp ráp, cài đặt, bảo trì máy tính, máy in và thiết bị mạng; hỗ trợ kỹ thuật tại hiện trường cho khách hàng doanh nghiệp."
    },
    {
      year: "2001 – 2005",
      role: "Cử Nhân Tin Học (CNTT)",
      company: "Trường Đại Học Quy Nhơn",
      desc: "Tốt nghiệp Cử nhân Tin học chính quy, xây dựng nền tảng vững chắc về khoa học máy tính, thuật toán và công nghệ mạng."
    }
  ],
  tools: [
    {
      name: "Khảo Sát & Thiết Kế Hạ Tầng Mạng",
      icon: "🌐",
      badge: "Core Service",
      desc: "Tư vấn kiến trúc mạng LAN/WAN, cấu hình cân bằng tải, phân chia VLAN và tường lửa bảo vệ tối ưu cho văn phòng, nhà xưởng, khách sạn."
    },
    {
      name: "Triển Khai Máy Chủ & Microsoft 365",
      icon: "🖥️",
      badge: "Enterprise",
      desc: "Cài đặt Windows Server, Active Directory, giải pháp sao lưu tự động chống Ransomware, đồng bộ hệ sinh thái Microsoft 365 & Exchange Email doanh nghiệp."
    },
    {
      name: "Hệ Thống Camera & Giám Sát An Ninh",
      icon: "📹",
      badge: "Security",
      desc: "Thi công hệ thống camera giám sát IP chất lượng cao, đầu ghi NVR lưu trữ an toàn, truy cập theo dõi từ xa bảo mật trên điện thoại và máy tính."
    },
    {
      name: "Giải Pháp AI & Tự Động Hóa Quy Trình",
      icon: "⚡",
      badge: "Next-Gen AI",
      desc: "Xây dựng AI Agent hỗ trợ doanh nghiệp tra cứu dữ liệu nội bộ, tự động hóa tác vụ lặp lại, tích hợp Chatbot AI vào website và Fanpage."
    },
    {
      name: "Bảo Trì & IT Helpdesk Doanh Nghiệp",
      icon: "🛠️",
      badge: "24/7 Support",
      desc: "Dịch vụ quản trị hệ thống định kỳ trọn gói: bảo trì máy tính, xử lý sự cố mạng tức thời, phòng ngừa rủi ro mất mát dữ liệu kinh doanh."
    },
    {
      name: "Kiểm Tra Tốc Độ & Ping Hạ Tầng",
      icon: "🚀",
      badge: "Free Utility",
      desc: "Công cụ đo lường tốc độ kết nối, độ trễ mạng và phân tích băng thông trực tiếp trên trình duyệt."
    }
  ]
};

/* ================= 4. DATA LOADER & RENDERER ================= */
async function loadDataAndRender() {
  let skills = FALLBACK_DATA.skills;
  let projects = FALLBACK_DATA.projects;
  let timeline = FALLBACK_DATA.timeline;
  let tools = FALLBACK_DATA.tools;

  try {
    const ts = Date.now();
    const [s, p, tl, t] = await Promise.all([
      fetch(`data/skills.json?v=${ts}`).then(r => r.json()).catch(() => null),
      fetch(`data/projects.json?v=${ts}`).then(r => r.json()).catch(() => null),
      fetch(`data/timeline.json?v=${ts}`).then(r => r.json()).catch(() => null),
      fetch(`data/tools.json?v=${ts}`).then(r => r.json()).catch(() => null),
    ]);
    if (s) skills = s;
    if (p) projects = p;
    if (tl) timeline = tl;
    if (t) tools = t;
  } catch (e) {
    console.log("Local fallback loaded cleanly.");
  }

  renderSkills(skills);
  renderProjects(projects);
  renderTimeline(timeline);
  renderTools(tools);
}

function getCategoryIcon(catName, color = 'currentColor') {
  const c = color || 'currentColor';
  if (catName.includes('Hạ Tầng') || catName.includes('Mạng')) {
    // 1. Network Topology / Switch
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="6" height="6" rx="1"/><rect x="16" y="2" width="6" height="6" rx="1"/><rect x="9" y="16" width="6" height="6" rx="1"/><path d="M5 8v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8"/><line x1="12" y1="13" x2="12" y2="16"/></svg>`;
  }
  if (catName.includes('Server') || catName.includes('Hệ Thống')) {
    // 2. Server Rack
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>`;
  }
  if (catName.includes('Microsoft') || catName.includes('365')) {
    // 3. Microsoft 4 Tiles
    return `<svg width="17" height="17" viewBox="0 0 24 24" fill="${c}"><rect x="2" y="2" width="9" height="9" rx="1"/><rect x="13" y="2" width="9" height="9" rx="1"/><rect x="2" y="13" width="9" height="9" rx="1"/><rect x="13" y="13" width="9" height="9" rx="1"/></svg>`;
  }
  if (catName.includes('An Ninh') || catName.includes('Giám Sát')) {
    // 4. Shield Security Check
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`;
  }
  if (catName.includes('Trí Tuệ') || catName.includes('AI') || catName.includes('Tự Động')) {
    // 5. AI Sparkles
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`;
  }
  if (catName.includes('Vận Hành') || catName.includes('Cloud') || catName.includes('CNTT') || catName.includes('Ops')) {
    // 6. Cloud Operations & Support
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><polyline points="8 14 12 10 16 14"/></svg>`;
  }
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
}

function renderSkills(categories) {
  const container = document.getElementById('tech-stack-container');
  if (!container) return;

  container.innerHTML = categories.map(cat => `
    <div class="tech-cat-card glass-panel">
      <div class="tech-cat-header">
        ${getCategoryIcon(cat.category, cat.color)}
        <span>${cat.category}</span>
      </div>
      <div class="tech-pills-wrap">
        ${cat.items.map(it => `
          <span class="tech-pill ${it.highlight ? 'highlight' : ''}">${it.name}</span>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function renderProjects(projects) {
  const container = document.getElementById('projects-container');
  if (!container) return;

  container.innerHTML = projects.map(p => `
    <div class="project-card glass-panel">
      <div>
        <div class="project-top-row">
          <span class="project-badge">${p.badge}</span>
          <span class="project-location">📍 ${p.location}</span>
        </div>
        <h3 class="project-title">${p.name}</h3>
        <p class="project-summary">${p.summary}</p>
        <ul class="project-highlights-list">
          ${p.highlights.map(h => `<li>${h}</li>`).join('')}
        </ul>
      </div>
      <div class="project-tech-tags">
        ${p.tech.map(t => `<span class="tech-tag-sm">${t}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

function renderTimeline(timeline) {
  const container = document.getElementById('timeline-container');
  if (!container) return;

  container.innerHTML = timeline.map(item => `
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="timeline-time">${item.year}</div>
      <div class="timeline-role">${item.role}</div>
      <div class="timeline-company">${item.company}</div>
      <p class="timeline-desc">${item.desc}</p>
    </div>
  `).join('');
}

function renderTools(tools) {
  const container = document.getElementById('tools-container');
  if (!container) return;

  container.innerHTML = tools.map(t => `
    <div class="tool-card glass-panel">
      <div class="tool-icon-head">
        <span class="tool-emoji">${t.icon}</span>
        <span class="tool-badge">${t.badge}</span>
      </div>
      <h4 class="tool-name">${t.name}</h4>
      <p class="tool-desc">${t.desc}</p>
    </div>
  `).join('');
}

/* ================= 5. KHANG LONG AI ASSISTANT ================= */
function initAiAssistant() {
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send-btn');
  const messagesBox = document.getElementById('chat-messages');
  const chips = document.querySelectorAll('.suggestion-chip');

  if (!input || !sendBtn || !messagesBox) return;

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-query');
      input.value = q;
      handleSendMessage();
    });
  });

  sendBtn.addEventListener('click', handleSendMessage);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSendMessage();
  });

  function handleSendMessage() {
    const text = input.value.trim();
    if (!text) return;

    appendMessage(text, 'user-msg');
    input.value = '';

    setTimeout(() => {
      const answer = generateAiKnowledgeResponse(text);
      appendMessage(answer, 'ai-msg');
    }, 450);
  }

  function appendMessage(msg, className) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${className}`;
    bubble.innerHTML = msg;
    messagesBox.appendChild(bubble);
    messagesBox.scrollTop = messagesBox.scrollHeight;
  }
}

function generateAiKnowledgeResponse(query) {
  const q = query.toLowerCase();

  if (q.includes('chứng chỉ') || q.includes('học vấn') || q.includes('bằng cấp')) {
    return `🎓 <strong>Học vấn & Chứng chỉ của Chuyên gia Trần Thanh Long:</strong><br>
    • <strong>Đại học Quy Nhơn (2001 - 2005):</strong> Cử nhân Tin học (CNTT)<br>
    • <strong>Microsoft (Nhất Nghệ 2011):</strong> Chứng chỉ quốc tế MCSA & MCITP<br>
    • <strong>Cisco (VnPro 2012):</strong> Chứng chỉ quốc tế CCNA Routing & Switching.`;
  }

  if (q.includes('dự án') || q.includes('công trình') || q.includes('kinh nghiệm')) {
    return `🏢 <strong>Các dự án tiêu biểu anh Long đã triển khai:</strong><br>
    1. <strong>Công ty Thép Tấm Lá Phú Mỹ (Bà Rịa - Vũng Tàu):</strong> Hạ tầng Server/Client bảo mật cao.<br>
    2. <strong>Khu Nghỉ Dưỡng Phú Yên:</strong> Hệ thống Wifi diện rộng & Camera giám sát IP.<br>
    3. <strong>Chợ Hoa Lư (Quy Nhơn):</strong> Mạng không dây phủ sóng rộng & cân bằng tải.<br>
    4. <strong>Khách sạn 4 sao:</strong> Vận hành hệ thống mạng & bảo mật CNTT 24/7.`;
  }

  if (q.includes('dịch vụ') || q.includes('giải pháp') || q.includes('khang long')) {
    return `⚡ <strong>Dịch vụ cốt lõi của Khang Long Network & AI Solutions:</strong><br>
    • Khảo sát, thiết kế và thi công hạ tầng mạng LAN/WAN/Wifi chuyên dụng.<br>
    • Cài đặt Windows Server, Active Directory, hệ sinh thái Microsoft 365.<br>
    • Lắp đặt Camera an ninh IP chuẩn doanh nghiệp.<br>
    • Tư vấn và triển khai giải pháp AI Agent, tự động hóa quy trình kinh doanh.`;
  }

  if (q.includes('liên hệ') || q.includes('sđt') || q.includes('zalo') || q.includes('giá') || q.includes('tư vấn')) {
    return `📞 <strong>Thông tin liên hệ trực tiếp Founder Trần Thanh Long:</strong><br>
    • <strong>Zalo:</strong> <a href="https://zalo.me/0909100423" target="_blank" style="color:#00d4ff;">0909 100 423</a><br>
    • <strong>Hotline:</strong> 0869 096 046<br>
    • <strong>Email Doanh Nghiệp:</strong> long.tran@khanglong.pro<br>
    • <strong>Địa chỉ:</strong> 606B Bạch Đằng, TP. Quy Nhơn.`;
  }

  return `Dạ chào anh/chị! Em là trợ lý AI của Khang Long. Anh/chị có thể hỏi em về <strong>kinh nghiệm 20+ năm CNTT</strong>, <strong>các chứng chỉ Cisco/Microsoft</strong>, <strong>dự án đã triển khai</strong> hoặc <strong>dịch vụ tư vấn hạ tầng & AI</strong> của Khang Long nhé!`;
}

/* ================= 6. TIMELINE EXPAND / COLLAPSE ================= */
function initTimelineToggle() {
  const toggleBtn = document.getElementById('timeline-toggle-btn');
  const wrapper = document.getElementById('timeline-wrapper');
  if (!toggleBtn || !wrapper) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = wrapper.classList.toggle('expanded');
    wrapper.classList.toggle('collapsed', !isExpanded);
    toggleBtn.setAttribute('aria-expanded', isExpanded);
    
    const parentArea = toggleBtn.closest('.timeline-toggle-area');
    if (parentArea) {
      parentArea.classList.toggle('is-expanded', isExpanded);
    }

    const btnText = toggleBtn.querySelector('.btn-text');
    if (btnText) {
      btnText.textContent = isExpanded ? 'Thu gọn hành trình' : 'Xem tiếp hành trình 20 năm';
    }

    if (!isExpanded) {
      // Khi thu gọn, cuộn nhẹ về đầu phần Timeline để người dùng dễ theo dõi
      const timelineSec = document.getElementById('timeline');
      if (timelineSec) {
        timelineSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
}

/* ================= 7. AUTH MODAL (ĐĂNG NHẬP / ĐĂNG KÝ) ================= */
function initAuthModal() {
  const modalOverlay = document.getElementById('auth-modal-overlay');
  const openBtn = document.getElementById('open-auth-modal');
  const closeBtn = document.getElementById('auth-modal-close');
  const tabLoginBtn = document.getElementById('tab-login-btn');
  const tabRegisterBtn = document.getElementById('tab-register-btn');
  const loginPanel = document.getElementById('login-panel');
  const registerPanel = document.getElementById('register-panel');
  const switchToRegister = document.getElementById('switch-to-register');
  const switchToLogin = document.getElementById('switch-to-login');
  const sendCodeBtn = document.getElementById('send-verify-code-btn');

  if (!modalOverlay) return;

  function openModal(tab = 'login') {
    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    switchTab(tab);
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function switchTab(tab) {
    if (tab === 'login') {
      tabLoginBtn?.classList.add('active');
      tabRegisterBtn?.classList.remove('active');
      loginPanel?.classList.add('active');
      registerPanel?.classList.remove('active');
    } else {
      tabRegisterBtn?.classList.add('active');
      tabLoginBtn?.classList.remove('active');
      registerPanel?.classList.add('active');
      loginPanel?.classList.remove('active');
    }
  }

  openBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    openModal('login');
  });

  closeBtn?.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  tabLoginBtn?.addEventListener('click', () => switchTab('login'));
  tabRegisterBtn?.addEventListener('click', () => switchTab('register'));
  switchToRegister?.addEventListener('click', () => switchTab('register'));
  switchToLogin?.addEventListener('click', () => switchTab('login'));

  // Toggle Password Visibility
  document.querySelectorAll('.auth-toggle-pwd').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;
      if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = 'Ẩn';
      } else {
        input.type = 'password';
        btn.textContent = 'Hiển thị';
      }
    });
  });

  // Gửi mã xác thực đếm ngược 60s
  if (sendCodeBtn) {
    let countdown = 0;
    sendCodeBtn.addEventListener('click', () => {
      const emailInput = document.getElementById('reg-email');
      if (emailInput && !emailInput.value.trim()) {
        alert('Vui lòng nhập địa chỉ email trước khi nhận mã xác nhận!');
        emailInput.focus();
        return;
      }
      if (countdown > 0) return;
      countdown = 60;
      sendCodeBtn.textContent = `Đã gửi (${countdown}s)`;
      sendCodeBtn.style.opacity = '0.7';
      sendCodeBtn.style.pointerEvents = 'none';

      const timer = setInterval(() => {
        countdown--;
        if (countdown > 0) {
          sendCodeBtn.textContent = `Gửi lại (${countdown}s)`;
        } else {
          clearInterval(timer);
          sendCodeBtn.textContent = 'Gửi mã';
          sendCodeBtn.style.opacity = '1';
          sendCodeBtn.style.pointerEvents = 'auto';
        }
      }, 1000);
    });
  }

  // Handle Form Submission
  window.handleAuthSubmit = function(type) {
    if (type === 'login') {
      const username = document.getElementById('login-username')?.value || 'Thành viên';
      alert(`Xin chào ${username}! Đăng nhập thành công vào Hệ thống Khang Long.`);
      closeModal();
      if (openBtn) {
        openBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>${username.split('@')[0]}</span>
        `;
      }
    } else {
      const username = document.getElementById('reg-username')?.value || 'Tài khoản mới';
      alert(`Chúc mừng ${username}! Đăng ký tài khoản thành công. Mời bạn đăng nhập.`);
      switchTab('login');
    }
  };

  // Google Sign-in handler
  document.getElementById('google-login-btn')?.addEventListener('click', () => {
    alert('Đang kết nối tài khoản Google (OAuth 2.0)... Đăng nhập thành công!');
    closeModal();
    if (openBtn) {
      openBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span>Google User</span>
      `;
    }
  });

  document.getElementById('google-register-btn')?.addEventListener('click', () => {
    alert('Đang kết nối tài khoản Google để tạo tài khoản... Thành công!');
    closeModal();
  });
}

