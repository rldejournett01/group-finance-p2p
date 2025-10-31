# P2P Group Finance Architecture
Modern, scalable, secure P2P social finance app. This will be designed to facilitate group expense splitting, collaborative saving,a nd collective money goals. At core this built from multiple services (mircoservce) to demo data consistency, real-time updates, and fault tolerance. 

## Overview
This repo detials the high-lvl architecture for **[LetsDoIt]**, a modern P2P social finace platform. The application is designed to simplify group financial management, allowing users to:

1. **Split Expenses:** Easily divide bills, travel costs, or household expenses evenly or by custom percentages (70/30, 20/80, 30/30/30/10, etc...)
2. **Collective Pooling:** Create joint savings goals (e.g, family trip, family pics, cookout etc) where members can contribute over time.
3. **Real-Time Tracking:** Provide instant, transparent updates on IOUs, group balances, and goal progress.

This design emphasizes **data integrity, scalability, and security**, focusing on a robust microservices approach suitable for a fintech product.


## Core Tech Stack

The stack was chosen to balance rapid development with the performance and consistency requirements of a financial system.

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Backend Language** | **Go (Golang)** or **Python (FastAPI)** | Optimal for high-concurrency microservices and efficient API handling. |
| **Core Database (Ledger)** | **PostgreSQL** | Provides essential **ACID properties** (Atomicity, Consistency, Isolation, Durability) for all financial transactions. |
| **Asynchronous Messaging** | **Apache Kafka** | Decouples services, ensuring reliability, resilience, and enabling the **Eventual Consistency** model for group states. |
| **Caching** | **Redis** | Used for user sessions, non-critical lookup data, and leaderboard caching to reduce database load. |
| **Cloud Infrastructure** | **AWS (EKS/ECS)** or **GCP (GKE)** | For container orchestration, autoscaling, and high-availability deployment of the microservices. |
| **Frontend/Mobile** | **React Native / Flutter** | Cross-platform development to efficiently target both iOS and Android users. |
| **Payments Integration** | **Stripe API/Webhooks** | Secure, compliant method for processing deposits, withdrawals, and handling sensitive payment tokenization. |

---


## System Arch

### 1. Context Diagram (L1: System-User View)

This diagram illustrates the boundaries of the application, showing that all user interactions are routed through the application layer, which securely communicates with external financial and communication services.

> <img width="706" height="421" alt="SystemCxtDiagram(LDT-L1) drawio" src="https://github.com/user-attachments/assets/a45e302e-0535-4322-b86e-1591910c9777" />

### 2. Container Diagram (L2: Backend Structure)


> <img width="696" height="438" alt="ContainerDia(LDI-L2) drawio (1)" src="https://github.com/user-attachments/assets/c6b90f5e-6f9b-416f-93a9-4e7d34a8a919" />




The core design utilizes the following distinct, decoupled mircoservices:

* **API Gateway:** Single entry point, handling request throttling, authentication, and routing
* **User & Group Service:** Manages user profiles, authentication (JWT), and group metadata. **Owned Data: User/Group Metadata**
* **Transation Ledger Service(CORE)** **Single source of truth** for all finacial data. It validates all transactions, and maintains the PostgreSQL ledger. **Owned Data: Financial Transcation, Balances)**
* **Payment Service:** Handles the secure initiation and fulfillment of payments via the external Stripe API, including processing asynchronous webhooks.
* **Notification Service:** Consumes events from the Kafka streams to deliver real-time push notifications, emails, and SMS alerts to users.

--- 
## Critical Architectural Decisions

### A. Data Consistency Model (ACID vs. Eventual)

| Requirement | Solution | Implementation |
| :--- | :--- | :--- |
| **Financial Integrity** | **Strict ACID** on all transaction commits. | The **Ledger Service** uses PostgreSQL transactions for all balance changes, preventing race conditions. |
| **System Resilience** | **Eventual Consistency** between services. | A successful transaction commit in the Ledger Service publishes an event to Kafka. Other services (like Notification) consume this event asynchronously, ensuring the system remains responsive even if other services lag. |

### B. Transaction Management (Double-Entry Ledger)

Every financial action (adding an expense, contributing to a goal) is recorded as a set of compensating **Debit and Credit** entries in the PostgreSQL ledger.

* **Benefit:** This guarantees that the sum of all debits always equals the sum of all credits ($\sum(\text{Debits}) = \sum(\text{Credits})$), providing a verifiable, auditable trail that is critical for a finance application.

### C. Real-Time User Experience

To ensure all group members see immediate updates on debts, payments, and goal progress:

* The **Notification Service** leverages **WebSockets** (or server-sent events) to push real-time updates to the mobile clients immediately after a relevant Kafka event is processed.

---

## ⏭️ Key Use Case Flow: Splitting a New Expense

This flow demonstrates the interaction between multiple services for a core action (e.g., 'One user adds a $600 expense for tires to be split').

1.  **Client Request:** Mobile App $\to$ **API Gateway** $\to$ **User/Group Service** (Authentication check).
2.  **Validation & Calculation:** **Group Service** calculates the resulting IOUs/debits for all members based on the chosen split logic.
3.  **Event Publishing:** **Group Service** publishes a `NEW_EXPENSE_CREATED` message to the **Kafka** queue.
4.  **Ledger Update (Critical Path):** The **Ledger Service** consumes the Kafka event, validates the financial logic, and commits the Debit/Credit entries to **PostgreSQL**.
5.  **User Alerting (Asynchronous):** The **Notification Service** consumes the same Kafka event and broadcasts a WebSocket update to all group members' mobile clients.



