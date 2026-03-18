# Vendorly — Backend Stack Recommendation

> This document outlines the recommended backend technology stack for the Vendorly multi-vendor marketplace, with reasoning for each choice. Read this before beginning any backend implementation.

---

## Programming Language: Python (FastAPI)

### Why Python over Node.js

Even though the frontend is built in TypeScript/Next.js, Python is the stronger choice for the backend. Here is why:

### 1. AI Integration is the Deciding Factor

Vendorly has planned AI features across all three portals — a shopping assistant, product description generator, vendor insights chat, and admin anomaly detection. The Anthropic Claude SDK, LangChain, vector embeddings, and every major AI/ML library are Python-native. Building these features in Python is seamless and requires no workarounds or third-party bridges.

When the time comes to replace simulated responses with real Claude API calls, you swap one function for an `anthropic.messages.create()` call. No architecture change needed.

### 2. FastAPI is Production-Ready and Fast

FastAPI is an async-first Python web framework that matches Node.js performance for I/O-bound workloads (which the majority of a marketplace API is). It also provides:

- Automatic OpenAPI/Swagger documentation at `/docs`
- Built-in request validation via Pydantic
- Native async/await support
- One of the fastest Python frameworks benchmarked

### 3. Pydantic for Typed Data Contracts

FastAPI uses Pydantic models for all request/response validation — the Python equivalent of TypeScript interfaces. Your frontend and backend will share the same data contract discipline even across different languages. All API responses are strictly typed and self-documenting.

### 4. Data Analytics is Native to Python

The vendor and admin analytics pages require aggregations, trend calculations, period comparisons, and cohort analysis. Python's pandas, numpy, and SQLAlchemy query builder make these trivial to build and easy to extend. Implementing the same in Node.js requires third-party libraries that do not integrate as cleanly.

### 5. Future-Proofing for Real AI

When you integrate real Claude API calls, you also gain access to:

- `anthropic` Python SDK (official)
- LangChain for chaining AI steps
- sentence-transformers for generating product embeddings
- scikit-learn for anomaly detection models
- All of these are Python-first and production-tested

---

## Database: PostgreSQL

### Why PostgreSQL over MongoDB or MySQL

### 1. Financial Data Requires ACID Transactions

Orders, payouts, coupon redemptions, and wallet credits must be atomic. If a payment succeeds but the corresponding order record fails to write, you have a financial inconsistency that is very hard to recover from. PostgreSQL guarantees full ACID compliance. MongoDB transactions are supported but were bolted on late and are fragile under high concurrency.

### 2. Relational Structure Fits the Data Model Perfectly

Vendorly's data is deeply relational:

```
User → Order → OrderItem → Product → Vendor → Category
Vendor → Payout → PayoutItem
Product → ProductImage, ProductVariant, Review
Coupon → CouponRedemption → Order
```

Modeling this in a document database means either duplicating data in every document or doing manual joins in application code. Both approaches create consistency bugs and slow development. PostgreSQL handles this natively with foreign keys, joins, and referential integrity.

### 3. JSONB for Flexible Product Attributes

Different products have different attributes — a dress has size and colour, a journal has dimensions and cover material, electronics have specs. PostgreSQL's `JSONB` column type stores these flexibly while still being fully queryable and indexable. You get the flexibility of a document store without sacrificing relational integrity.

```sql
-- Example: query products by a nested attribute
SELECT * FROM products WHERE attributes->>'material' = 'leather';
```

### 4. pgvector for AI-Powered Semantic Search

When the real AI shopping assistant is integrated, it will need vector similarity search to match natural language queries ("a gift for my mum under ₦20,000") to relevant products. The `pgvector` PostgreSQL extension adds this directly — no separate vector database (Pinecone, Weaviate, etc.) required. One database handles everything.

```sql
-- Example: semantic search via embeddings
SELECT * FROM products
ORDER BY embedding <-> $query_vector
LIMIT 10;
```

### 5. Full-Text Search Built In

Product search with `tsvector` and `tsquery` is production-ready inside PostgreSQL itself. Combined with `pgvector` for semantic search, you have a complete search solution with no external service.

### 6. One Database to Manage

Instead of running PostgreSQL + MongoDB + a vector database, you run one PostgreSQL instance that handles relational data, flexible JSON attributes, full-text search, and vector similarity. This reduces operational complexity, backup surface area, and infrastructure cost.

---

## Full Supporting Stack

| Layer | Choice | Reason |
|---|---|---|
| Backend framework | FastAPI | Async, typed, auto-docs, fast |
| Database | PostgreSQL 16+ | Relational, ACID, JSONB, pgvector |
| ORM | SQLAlchemy 2.0 | Async support, migrations via Alembic |
| Cache | Redis | Sessions, rate limiting, analytics caching |
| File storage | Cloudinary or AWS S3 | Product images, vendor banners |
| Auth | JWT + refresh tokens | Stateless, works across all three portals |
| AI | Anthropic Claude API | Direct replacement for simulated responses |
| Task queue | Celery + Redis | Async jobs — payouts, emails, analytics |
| Email | SendGrid or Resend | Transactional emails |
| Hosting | Railway, Render, or AWS | Python + PostgreSQL friendly |

---

## What Comes Next

Once this stack is confirmed, the next document will cover:

- **Database schema** — all tables, columns, relationships, and indexes
- **API endpoints** — every REST route mapped to the pages already built in the frontend
- **Auth flow** — buyer, vendor, and admin role separation using JWT
- **AI integration architecture** — how Claude API slots into the existing simulated UI
- **File upload flow** — images from vendor portal to cloud storage
- **Order and payout processing logic** — the financial state machine
- **Celery task definitions** — background jobs for analytics and notifications

---

*Document version: 1.0 — March 2026*
*Frontend: Next.js 14, TypeScript, Tailwind CSS*
*Backend: To be implemented — see recommendations above*
