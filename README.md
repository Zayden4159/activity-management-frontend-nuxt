# Activity Management

ระบบจัดการกิจกรรม พัฒนาด้วย Nuxt 4 + Nuxt UI + Pinia + Tailwind CSS v4
Deploy บน Cloudflare Pages

---
 
## 🚀 Tech Stack

| Package | Version | คำอธิบาย |
|---------|---------|----------|
| `nuxt` | ^4.3.0 | Framework หลัก |
| `@nuxt/ui` | ^4.4.0 | UI Component Library |
| `pinia` + `@pinia/nuxt` | ^3.0.4 | State Management |
| `tailwindcss` | ^4.1.18 | Styling (Vite plugin) |
| `axios` | ^1.13.4 | HTTP Client |
| `jwt-decode` | ^4.0.0 | Decode JWT Token |
| `socket.io-client` | ^4.8.3 | Realtime (WebSocket) |
| `vuejs-paginate-next` | ^1.0.2 | Pagination Component |
| `wrangler` | ^4.67.0 | Cloudflare Pages Deploy |

---

## Setup

### 1. Clone โปรเจค
 
```bash
git clone https://github.com/your-org/activity-management.git
cd activity-management
```

### 2. ติดตั้ง dependencies

```bash
npm install
```

.env.development

### 3. ตั้งค่า environment

สร้างไฟล์ `.env.development` และ `.env.production`

**.env.development**
```bash
NUXT_PUBLIC_API_BASE=http://localhost:8000
```

**.env.production**

### 4. Start Development Server

```bash
npm run dev
```

เปิดเบราว์เซอร์ `http://localhost:3000`

## Scripts

| คำสั่ง | คำอธิบาย |
|--------|----------|
| `npm run dev` | Start development server |
| `npm run build` | Build สำหรับ production |
| `npm run preview` | Preview build ที่ build แล้ว |
| `npm run generate` | Generate static site |
 
---
