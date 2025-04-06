# 🛰️ TrackIt

**TrackIt** is a real-time SaaS platform built by [Hdev Group](https://hdev.uk) to help SaaS businesses streamline operations with efficient **team management**, **incident tracking**, **status pages**, **support handling**, and **on-call response** workflows — all in one platform. Built with performance, reliability, and security in mind.

---

## 📦 Features

### ✅ Status Pages
- Real-Time **Public & Private** status pages.
- **Incident history tracking** with timestamps and severity.
- Subscriber alerts via **email, SMS**, and **in-app push**.
- Custom branding and subdomain support.

### 💬 Real-Time Communication
- Slack-style **chat** for internal teams.
- **Voice channels** for incidents and meetings.
- Real-time **incident rooms** for crisis coordination.

### 🆘 Integrated Support System
- Built-in **ticketing** system like Zendesk.
- Assign agents, priorities, categories, and statuses.
- Real-time **support chat** (mobile-ready).
- Integrations via **email, webhooks**, and custom forms.

### 🧑‍💻 Team Management
- **Role-based access control** (Admin, Support, Manager).
- Shift scheduling and **on-call escalation** workflows.
- Slack-style team organization.

### 🔔 Downtime & Monitoring
- Automated **downtime detection** and incident creation.
- **Webhook** support for external monitoring tools.
- Health check endpoints and service monitoring.

### 📱 Mobile App (Coming Soon)
- Free companion app for iOS & Android.
- Real-time alerts, ticket management, team chat.
- On-call notifications and voice comms.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, TailwindCSS  
- **Backend:** Node.js, Express  
- **Database:** PostgreSQL  
- **Authentication:** Bearer tokens  
- **Security:** AES-256 encryption in transit  
- **Infrastructure:** Docker, Vercel (Frontend), Custom Node.js backend

---

## 💼 Pricing

| Plan       | Features Included                                                                  | Price       |
|------------|-------------------------------------------------------------------------------------|-------------|
| **Free**   | 1 status page, 2 team members, basic ticketing and monitoring                       | £0/month    |
| **Pro**    | Unlimited status pages, up to 25 users, real-time chat, ticketing, custom domains   | £19/month   |
| **Enterprise** | Everything in Pro + Dedicated infra, SLAs, advanced analytics, priority support | Contact Us  |

---

## 🔐 Security

TrackIt was designed with security from the ground up:
- **AES-256 encryption** for all data in transit.
- Token-based authentication with **secure bearer tokens**.
- Regular **penetration testing** and internal auditing.
- Fully compliant with **GDPR** and **UK Data Protection Act**.

---

## 🧩 Roadmap

- 📱 Launch mobile app (iOS + Android)
- 📊 Service analytics and incident metrics
- 🧠 AI-powered incident analysis and recommendations
- 🔌 Plugin system for 3rd-party tools
- ✅ Enhanced auto-monitoring and alert rules

---

## 🚀 Getting Started

> 🚧 **Note:** TrackIt is currently in **private beta**. Request access via [email](mailto:hello@hdev.uk).

1. Clone the repository:
    ```bash
    git clone https://github.com/hdevgroup/trackit.git
    ```

2. Setup environment variables from `.env.example`:
    ```bash
    cp .env.example .env
    ```

3. Start development servers:
    ```bash
    # Frontend
    cd frontend
    npm install
    npm run dev

    # Backend
    cd ../api
    npm install
    npm run dev
    ```

---

## 🤝 Contributing

Currently in development — contributions are closed for now.  

---

## 🧠 Built By

**Harry Campbell**  
Founder & Lead Software + Security Engineer at [Hdev Group](https://hdev.uk)

---

## 📫 Contact

- 📧 Email: [contact@hdev.group](mailto:hello@hdev.uk)  
- 🌍 Website: [https://hdev.group](https://hdev.uk)

---

# 📜 License

# © 2025 Hdev Group. All rights reserved.  
# This software is proprietary and not open-source.
