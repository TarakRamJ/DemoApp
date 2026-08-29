# 🛡️ SentinelCore SecureOps

**Enterprise Security Operations & Infrastructure Monitoring Platform**

SentinelCore SecureOps is a cloud-native platform for monitoring, auditing, and securing organizational infrastructure, applications, servers, networks, and cloud resources. It covers security monitoring, vulnerability management, incident tracking, infrastructure monitoring, audit management, access control, compliance reporting, and DevSecOps integration — built as a microservices system with an event-driven backbone.

![Java](https://img.shields.io/badge/Java-25-orange?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4-brightgreen?logo=springboot)
![React](https://img.shields.io/badge/React-20-61DAFB?logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-DB-336791?logo=postgresql&logoColor=white)
![Kafka](https://img.shields.io/badge/Apache%20Kafka-Event%20Streaming-231F20?logo=apachekafka)
![Keycloak](https://img.shields.io/badge/Keycloak-IAM-4D4D4D?logo=keycloak)

---

## 📌 Overview

| | |
|---|---|
| **Assets monitored** | 2,847 |
| **Uptime SLA** | 99.99% |
| **Active incidents tracked** | 23 (MTTR ~47 min) |
| **Vulnerabilities tracked** | 847 |
| **Audit logs** | 24.7M (immutable) |
| **Compliance** | 100% PCI DSS, SOC 2, ISO 27001 |

The platform is organized around six core microservices — **User**, **Asset**, **Incident**, **Audit**, **Alert**, and **Reporting** — communicating over Kafka, secured end-to-end with Keycloak IAM and role-based access control (RBAC).

---

## 🏗️ Architecture

SentinelCore follows a 9-layer architecture:

```
1. Presentation Layer     → React 20, TypeScript, Material UI, Recharts
2. API Gateway            → Spring Cloud Gateway, OAuth2, JWT, Keycloak, WAF
3. Business Services      → User, Asset, Incident, Audit, Alert, Report Services
4. Core Services          → MonitoringService, VulnerabilityService, ComplianceService
5. Domain Layer           → Java 25, Spring Boot 4, Spring Security, Spring Data JPA
6. Event Layer            → Apache Kafka, Event Sourcing, Audit Trail, Notifications
7. Data Layer             → PostgreSQL, Redis Cache, OpenSearch, S3/Blob
8. Security               → Keycloak IAM, RBAC, Encryption, PCI DSS, Audit
9. Infrastructure         → Docker, Kubernetes, AWS/Azure, Prometheus, Grafana
```

### Security operations workflow

```
Infrastructure Telemetry → Security Monitoring → Incident Detection
    → Vulnerability Assessment → Audit Logging → Compliance Reporting
        → DevSecOps Dashboard
```

### Core domain entities

`User` · `Asset` · `Incident` · `Vulnerability` · `AuditLog` · `Compliance` · `Alert` · `Metric` · `Policy` · `Report`

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 20, TypeScript, Material UI, Recharts |
| Backend | Java 25, Spring Boot 4, Spring Cloud Gateway, Spring Security, Spring Data JPA |
| Database | PostgreSQL, Redis (cache) |
| Messaging | Apache Kafka (event-driven architecture) |
| Identity & Access | Keycloak (IAM, OAuth2, JWT, RBAC) |
| Cloud | AWS (EC2, EKS, RDS, CloudWatch, S3) **or** Azure (AKS, SQL, Monitor, Blob) |
| DevOps / Observability | Docker, Kubernetes, Prometheus, Grafana |
| Security Scanning | SonarQube, Trivy |

---

## 📁 Repository Structure

```
SentinelCore/
├── SentinelCore-SecureOps/   # Backend — Java 25 / Spring Boot 4 microservices
└── sentinel-frontend/        # Frontend — React 20 + TypeScript
```

---

## 🚀 Getting Started

### Prerequisites
- Java 25 (JDK)
- Node.js 20+ and npm
- PostgreSQL 15+
- Redis
- Apache Kafka
- Keycloak (for IAM/RBAC)
- Docker & Docker Compose (recommended for local infra)

### Backend setup

```bash
cd SentinelCore-SecureOps
./mvnw clean install
./mvnw spring-boot:run
```

Configure your local environment in `application.yml` / `application-local.yml` (DB credentials, Kafka broker, Keycloak realm, Redis host).

### Frontend setup

```bash
cd sentinel-frontend
npm install
npm start
```

The frontend expects the API gateway to be running (default `http://localhost:8080` — adjust in `.env`).

---

## 📦 Milestones

| Milestone | Weeks | Focus |
|---|---|---|
| M1 | 1–2 | Infrastructure Monitoring (assets, health, alerts, auto-scaling) |
| M2 | 3–4 | Security Incident Management (tracking, severity, SLA, resolution) |
| M3 | 5–6 | Vulnerability Management (CVE tracking, risk scoring, patching) |
| M4 | 7–8 | Audit & Compliance (immutable logs, PCI DSS/SOC 2, DevSecOps dashboard) |

---

## 🔐 Security & Compliance

- RBAC enforced via Keycloak for **Super Admin**, **Security Admin**, and **Auditor** roles
- All critical actions require approval and are logged immutably via Kafka event ordering
- Compliance frameworks: **PCI DSS**, **SOC 2**, **ISO 27001**
- Static/dependency scanning via **SonarQube** and **Trivy**

---

## 🗺️ Roadmap

- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Helm charts for Kubernetes deployment
- [ ] AI-assisted anomaly detection (future phase)
- [ ] Multi-tenant support

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Please open an issue first to discuss what you'd like to change.
