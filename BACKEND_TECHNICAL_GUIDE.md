# Vendorly — Backend Technical Guide

> In-depth backend specification for the Vendorly multi-vendor marketplace.
> Stack: Node.js · Express · TypeScript · Mongoose · MongoDB · Amazon S3 · JWT

---

## Table of Contents

1. [System Architecture](#1-system-architecture)
2. [Project Folder Structure](#2-project-folder-structure)
3. [Database Design & Schema Overview](#3-database-design--schema-overview)
4. [Models / Schemas (All Collections)](#4-models--schemas-all-collections)
5. [How the Schemas Connect](#5-how-the-schemas-connect)
6. [Authentication & Single Device Login](#6-authentication--single-device-login)
7. [Role-Based Access Control](#7-role-based-access-control)
8. [API Endpoints](#8-api-endpoints)
9. [File Upload Flow (Amazon S3)](#9-file-upload-flow-amazon-s3)
10. [Order & Payout State Machine](#10-order--payout-state-machine)
11. [AI Integration Architecture](#11-ai-integration-architecture)
12. [Analytics System](#12-analytics-system)
13. [Error Handling Strategy](#13-error-handling-strategy)
14. [Environment Variables](#14-environment-variables)

---

## 1. System Architecture

### Overview

Vendorly follows a **monolithic REST API** architecture. This is intentional — a monolith is the right choice at this stage because it is simpler to build, deploy, debug, and scale until the product has proven demand. The codebase is structured so that individual modules (auth, orders, AI, etc.) can be extracted into microservices later without rewriting business logic.

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTS                              │
│   Storefront (buyer)  │  Vendor Portal  │  Admin Console    │
│         Next.js App (already built)                         │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS / REST
┌──────────────────────────▼──────────────────────────────────┐
│                     EXPRESS API SERVER                       │
│                                                             │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐ │
│  │  Auth       │  │  Rate        │  │  Request           │ │
│  │  Middleware │  │  Limiter     │  │  Validator         │ │
│  └──────┬──────┘  └──────────────┘  └────────────────────┘ │
│         │                                                   │
│  ┌──────▼──────────────────────────────────────────────┐   │
│  │                     ROUTES                          │   │
│  │  /auth  /products  /orders  /vendors  /admin  /ai   │   │
│  └──────┬──────────────────────────────────────────────┘   │
│         │                                                   │
│  ┌──────▼──────────────────────────────────────────────┐   │
│  │                   CONTROLLERS                        │   │
│  │  Handle HTTP, call services, return responses        │   │
│  └──────┬──────────────────────────────────────────────┘   │
│         │                                                   │
│  ┌──────▼──────────────────────────────────────────────┐   │
│  │                    SERVICES                          │   │
│  │  Business logic — auth, orders, payouts, AI, S3     │   │
│  └──────┬──────────────────────────────────────────────┘   │
│         │                                                   │
│  ┌──────▼──────────────────────────────────────────────┐   │
│  │                     MODELS                           │   │
│  │  Mongoose schemas — MongoDB                          │   │
│  └──────┬──────────────────────────────────────────────┘   │
└─────────┼───────────────────────────────────────────────────┘
          │
┌─────────▼────────┐   ┌───────────┐   ┌──────────────────┐
│    MongoDB        │   │  AWS S3   │   │  Anthropic API   │
│  (primary data)   │   │  (files)  │   │  (AI features)   │
└──────────────────┘   └───────────┘   └──────────────────┘
```

### Request Lifecycle

Every API request follows this exact path:

```
Request
  → Rate Limiter (blocks abuse)
  → Auth Middleware (validates JWT + checks active session)
  → Role Middleware (checks buyer/vendor/admin permission)
  → Route Handler
  → Controller (validates input, calls service)
  → Service (business logic, DB operations)
  → Response
```

### Design Principles

- **Controllers are thin** — they only parse the request, call a service, and return a response. No business logic lives in controllers.
- **Services are fat** — all business logic, DB queries, and external API calls live in services. This makes testing and reuse easy.
- **Models are dumb** — Mongoose schemas define shape and validation only. No logic in models except simple instance methods.
- **One error format** — every error response across the entire API has the same shape so the frontend can handle errors uniformly.

---

## 2. Project Folder Structure

```
vendorly-api/
├── src/
│   ├── config/
│   │   ├── db.ts              # MongoDB connection
│   │   ├── s3.ts              # AWS S3 client setup
│   │   └── ai.ts              # Anthropic client setup
│   │
│   ├── models/
│   │   ├── User.ts
│   │   ├── Session.ts
│   │   ├── Vendor.ts
│   │   ├── Category.ts
│   │   ├── Product.ts
│   │   ├── Order.ts
│   │   ├── Review.ts
│   │   ├── Coupon.ts
│   │   ├── CouponRedemption.ts
│   │   ├── Payout.ts
│   │   ├── Cart.ts
│   │   ├── Notification.ts
│   │   └── DailyStat.ts
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── vendor.controller.ts
│   │   ├── product.controller.ts
│   │   ├── order.controller.ts
│   │   ├── review.controller.ts
│   │   ├── coupon.controller.ts
│   │   ├── payout.controller.ts
│   │   ├── cart.controller.ts
│   │   ├── category.controller.ts
│   │   ├── analytics.controller.ts
│   │   ├── ai.controller.ts
│   │   ├── upload.controller.ts
│   │   └── admin/
│   │       ├── users.controller.ts
│   │       ├── vendors.controller.ts
│   │       ├── orders.controller.ts
│   │       └── analytics.controller.ts
│   │
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── vendor.routes.ts
│   │   ├── product.routes.ts
│   │   ├── order.routes.ts
│   │   ├── review.routes.ts
│   │   ├── coupon.routes.ts
│   │   ├── payout.routes.ts
│   │   ├── cart.routes.ts
│   │   ├── category.routes.ts
│   │   ├── analytics.routes.ts
│   │   ├── ai.routes.ts
│   │   ├── upload.routes.ts
│   │   └── admin.routes.ts
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts      # JWT verification + session check
│   │   ├── role.middleware.ts      # buyer / vendor / admin guard
│   │   ├── upload.middleware.ts    # multer for S3
│   │   ├── rateLimiter.middleware.ts
│   │   └── errorHandler.middleware.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── email.service.ts
│   │   ├── s3.service.ts
│   │   ├── ai.service.ts
│   │   ├── analytics.service.ts
│   │   └── payout.service.ts
│   │
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── hash.ts
│   │   ├── orderNumber.ts
│   │   ├── apiError.ts
│   │   └── apiResponse.ts
│   │
│   ├── types/
│   │   └── index.ts            # Shared TypeScript types
│   │
│   ├── app.ts                  # Express app setup, middleware, routes
│   └── server.ts               # Server entry point
│
├── .env
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

## 3. Database Design & Schema Overview

Vendorly has **13 MongoDB collections**. The diagram below shows every collection and how they relate to each other.

```
User ──────────────────── Session       (one active session per user)
 │
 ├── (role: vendor) ────── Vendor ──── Product ──── Review
 │                          │            │
 │                          │            ├── Category
 │                          │            └── OrderItem (embedded in Order)
 │                          │
 │                          └── Payout ── Order (many)
 │
 ├── (role: buyer) ──────── Order ────── Coupon
 │                           │
 │                           └── CouponRedemption
 │
 ├── Cart (one per user)
 ├── Wishlist (field on User)
 ├── Addresses (embedded in User)
 └── Notification
```

### Collection Summary

| Collection | Purpose | Key Relationships |
|---|---|---|
| User | All accounts (buyer, vendor, admin) | Has one Session, one Vendor (if vendor), many Orders |
| Session | Tracks active login per user | Belongs to User |
| Vendor | Vendor store profile | Belongs to User, has many Products and Payouts |
| Category | Product categories (supports nesting) | Self-referencing for subcategories |
| Product | Product listings | Belongs to Vendor and Category |
| Order | Purchase records | Belongs to User and Vendor, has embedded items |
| Review | Product and vendor reviews | Belongs to Product, Vendor, User, Order |
| Coupon | Discount codes | Belongs to Vendor (or platform-wide) |
| CouponRedemption | Tracks who used which coupon | Belongs to Coupon, User, Order |
| Payout | Vendor earnings payouts | Belongs to Vendor, references many Orders |
| Cart | Active shopping cart | Belongs to User |
| Notification | In-app notifications | Belongs to User |
| DailyStat | Pre-aggregated analytics data | Belongs to Vendor (or platform) |

---

## 4. Models / Schemas (All Collections)

---

### 4.1 User

The central model. Every person in the system — buyer, vendor, or admin — is a User. Role determines what they can access.

```typescript
// models/User.ts

import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  firstName:              string
  lastName:               string
  email:                  string
  password:               string
  phone?:                 string
  avatar?:                string           // S3 URL
  role:                   'buyer' | 'vendor' | 'admin'
  status:                 'active' | 'suspended' | 'banned'
  isEmailVerified:        boolean
  emailVerificationToken?: string
  emailVerificationExpires?: Date
  passwordResetToken?:    string
  passwordResetExpires?:  Date
  activeSessionId?:       string           // SINGLE DEVICE LOGIN — see Section 6
  addresses:              IAddress[]       // embedded subdocuments
  wishlist:               mongoose.Types.ObjectId[]  // ref: Product
  createdAt:              Date
  updatedAt:              Date
}

const AddressSchema = new Schema({
  label:      { type: String, default: 'Home' },  // 'Home', 'Work', 'Other'
  firstName:  { type: String, required: true },
  lastName:   { type: String, required: true },
  street:     { type: String, required: true },
  city:       { type: String, required: true },
  state:      { type: String, required: true },
  country:    { type: String, default: 'Nigeria' },
  postalCode: { type: String },
  phone:      { type: String },
  isDefault:  { type: Boolean, default: false },
}, { _id: true })

const UserSchema = new Schema<IUser>({
  firstName:               { type: String, required: true, trim: true },
  lastName:                { type: String, required: true, trim: true },
  email:                   { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:                { type: String, required: true, select: false },  // never returned by default
  phone:                   { type: String },
  avatar:                  { type: String },
  role:                    { type: String, enum: ['buyer', 'vendor', 'admin'], default: 'buyer' },
  status:                  { type: String, enum: ['active', 'suspended', 'banned'], default: 'active' },
  isEmailVerified:         { type: Boolean, default: false },
  emailVerificationToken:  { type: String, select: false },
  emailVerificationExpires:{ type: Date,   select: false },
  passwordResetToken:      { type: String, select: false },
  passwordResetExpires:    { type: Date,   select: false },
  activeSessionId:         { type: String, select: false },  // key field for single device login
  addresses:               [AddressSchema],
  wishlist:                [{ type: Schema.Types.ObjectId, ref: 'Product' }],
}, { timestamps: true })

// Indexes
UserSchema.index({ email: 1 })
UserSchema.index({ role: 1 })
UserSchema.index({ status: 1 })

export const User = mongoose.model<IUser>('User', UserSchema)
```

**Key design decisions:**
- `password` has `select: false` — it is never returned in any query unless explicitly asked for with `.select('+password')`
- `activeSessionId` has `select: false` — same reason; only the auth middleware reads it
- `addresses` are embedded because a user will never have more than ~10 addresses and they are always fetched with the user
- `wishlist` is an array of Product ObjectIds on the User — simple and fast to check

---

### 4.2 Session

Enables the **single device login** requirement. Every login creates a session record. On each request, the session ID in the JWT is compared against the stored `activeSessionId` on the User.

```typescript
// models/Session.ts

export interface ISession extends Document {
  userId:     mongoose.Types.ObjectId
  sessionId:  string           // UUID stored in JWT and on User.activeSessionId
  userAgent?: string           // browser/device info
  ipAddress?: string
  isActive:   boolean
  expiresAt:  Date
  createdAt:  Date
}

const SessionSchema = new Schema<ISession>({
  userId:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sessionId: { type: String, required: true, unique: true },
  userAgent: { type: String },
  ipAddress: { type: String },
  isActive:  { type: Boolean, default: true },
  expiresAt: { type: Date, required: true },
}, { timestamps: true })

SessionSchema.index({ userId: 1 })
SessionSchema.index({ sessionId: 1 })
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })  // TTL index — auto-deletes expired sessions

export const Session = mongoose.model<ISession>('Session', SessionSchema)
```

**How single device login works — step by step:**

```
LOGIN REQUEST
  1. Validate email + password
  2. Generate a new UUID → sessionId
  3. Create Session document { userId, sessionId, expiresAt: +30days }
  4. Update User.activeSessionId = sessionId  (invalidates ALL previous tokens)
  5. Sign JWT: { userId, role, sessionId }
  6. Return JWT to client

EVERY SUBSEQUENT REQUEST
  1. Middleware extracts JWT from Authorization header
  2. Verify JWT signature and expiry
  3. Extract sessionId from JWT payload
  4. Fetch User.activeSessionId from DB
  5. Compare: if JWT.sessionId !== User.activeSessionId → 401 "Logged in on another device"
  6. If match → proceed

NEW LOGIN ON ANOTHER DEVICE
  1. New sessionId is generated
  2. User.activeSessionId is updated to new sessionId
  3. All existing JWTs now fail the session check → previous device is logged out
```

---

### 4.3 Vendor

A Vendor is always linked to a User with `role: 'vendor'`. The Vendor model holds the store profile and financial data.

```typescript
// models/Vendor.ts

export interface IVendor extends Document {
  userId:          mongoose.Types.ObjectId    // ref: User
  storeName:       string
  slug:            string                     // URL-friendly unique store name
  logo?:           string                     // S3 URL
  banner?:         string                     // S3 URL
  bannerPosition:  { x: number; y: number }   // for drag-to-reposition feature
  description?:    string
  plan:            'starter' | 'growth' | 'pro'
  status:          'pending' | 'active' | 'suspended' | 'rejected'
  category?:       string                     // primary business category
  commissionRate:  number                     // platform fee %, e.g. 10
  payoutBalance:   number                     // pending earnings not yet paid out
  totalRevenue:    number                     // lifetime revenue
  totalSales:      number                     // lifetime order count
  rating:          number                     // average rating
  totalReviews:    number
  isVerified:      boolean
  bankDetails?: {
    bankName:      string
    accountNumber: string
    accountName:   string
  }
  socialLinks?: {
    instagram?:  string
    twitter?:    string
    facebook?:   string
    website?:    string
  }
  policies?: {
    returnPolicy?:  string
    shippingPolicy?: string
  }
  joinedAt:    Date
  createdAt:   Date
  updatedAt:   Date
}

const VendorSchema = new Schema<IVendor>({
  userId:         { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  storeName:      { type: String, required: true, trim: true },
  slug:           { type: String, required: true, unique: true, lowercase: true },
  logo:           { type: String },
  banner:         { type: String },
  bannerPosition: { x: { type: Number, default: 50 }, y: { type: Number, default: 50 } },
  description:    { type: String },
  plan:           { type: String, enum: ['starter', 'growth', 'pro'], default: 'starter' },
  status:         { type: String, enum: ['pending', 'active', 'suspended', 'rejected'], default: 'pending' },
  category:       { type: String },
  commissionRate: { type: Number, default: 10 },
  payoutBalance:  { type: Number, default: 0 },
  totalRevenue:   { type: Number, default: 0 },
  totalSales:     { type: Number, default: 0 },
  rating:         { type: Number, default: 0 },
  totalReviews:   { type: Number, default: 0 },
  isVerified:     { type: Boolean, default: false },
  bankDetails:    {
    bankName:      { type: String },
    accountNumber: { type: String },
    accountName:   { type: String },
  },
  socialLinks:    {
    instagram: String, twitter: String, facebook: String, website: String,
  },
  policies: {
    returnPolicy: String, shippingPolicy: String,
  },
  joinedAt: { type: Date, default: Date.now },
}, { timestamps: true })

VendorSchema.index({ slug: 1 })
VendorSchema.index({ status: 1 })
VendorSchema.index({ plan: 1 })
VendorSchema.index({ rating: -1 })

export const Vendor = mongoose.model<IVendor>('Vendor', VendorSchema)
```

---

### 4.4 Category

Supports nested categories (e.g. Fashion → Women → Dresses) via a `parent` self-reference.

```typescript
// models/Category.ts

export interface ICategory extends Document {
  name:        string
  slug:        string
  icon?:       string        // emoji or icon name
  description?: string
  image?:      string        // S3 URL
  parent?:     mongoose.Types.ObjectId   // ref: Category (null = top-level)
  isActive:    boolean
  sortOrder:   number
  createdAt:   Date
  updatedAt:   Date
}

const CategorySchema = new Schema<ICategory>({
  name:        { type: String, required: true, trim: true },
  slug:        { type: String, required: true, unique: true, lowercase: true },
  icon:        { type: String },
  description: { type: String },
  image:       { type: String },
  parent:      { type: Schema.Types.ObjectId, ref: 'Category', default: null },
  isActive:    { type: Boolean, default: true },
  sortOrder:   { type: Number, default: 0 },
}, { timestamps: true })

CategorySchema.index({ slug: 1 })
CategorySchema.index({ parent: 1 })

export const Category = mongoose.model<ICategory>('Category', CategorySchema)
```

---

### 4.5 Product

The most complex model. Stores full product data including variants, images, and computed analytics fields.

```typescript
// models/Product.ts

export interface IProductImage {
  url:       string    // S3 URL
  alt?:      string
  isPrimary: boolean
  sortOrder: number
}

export interface IVariantCombination {
  sku:        string
  price:      number
  stock:      number
  attributes: Map<string, string>  // { size: 'M', color: 'Red' }
}

export interface IVariantOption {
  name:   string     // e.g. 'Size'
  values: string[]   // e.g. ['S', 'M', 'L', 'XL']
}

export interface IProduct extends Document {
  vendorId:         mongoose.Types.ObjectId   // ref: Vendor
  categoryId:       mongoose.Types.ObjectId   // ref: Category
  name:             string
  slug:             string
  shortDescription?: string
  description:      string
  price:            number
  compareAtPrice?:  number
  sku:              string
  stock:            number
  weight?:          number                    // grams
  images:           IProductImage[]
  variantOptions:   IVariantOption[]
  variants:         IVariantCombination[]     // all purchasable combinations
  attributes:       Map<string, string>       // flexible: { material: 'leather', dimensions: 'A5' }
  tags:             string[]
  status:           'active' | 'draft' | 'archived' | 'out_of_stock'
  condition:        'new' | 'like_new' | 'good' | 'fair'
  featured:         boolean
  isBestseller:     boolean
  isNew:            boolean
  rating:           number
  totalReviews:     number
  totalSales:       number
  totalRevenue:     number
  viewCount:        number
  shippingInfo?:    string
  returnPolicy?:    string
  aiGenerated:      boolean   // true if description was AI-generated
  createdAt:        Date
  updatedAt:        Date
}

const ProductImageSchema = new Schema({
  url:       { type: String, required: true },
  alt:       { type: String },
  isPrimary: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 0 },
}, { _id: false })

const ProductSchema = new Schema<IProduct>({
  vendorId:         { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  categoryId:       { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  name:             { type: String, required: true, trim: true },
  slug:             { type: String, required: true, unique: true },
  shortDescription: { type: String },
  description:      { type: String, required: true },
  price:            { type: Number, required: true, min: 0 },
  compareAtPrice:   { type: Number, min: 0 },
  sku:              { type: String, required: true, unique: true },
  stock:            { type: Number, required: true, min: 0, default: 0 },
  weight:           { type: Number },
  images:           [ProductImageSchema],
  variantOptions:   [{ name: String, values: [String] }],
  variants:         [{
    sku:        { type: String },
    price:      { type: Number },
    stock:      { type: Number },
    attributes: { type: Map, of: String },
  }],
  attributes:       { type: Map, of: String },
  tags:             [String],
  status:           { type: String, enum: ['active', 'draft', 'archived', 'out_of_stock'], default: 'draft' },
  condition:        { type: String, enum: ['new', 'like_new', 'good', 'fair'], default: 'new' },
  featured:         { type: Boolean, default: false },
  isBestseller:     { type: Boolean, default: false },
  isNew:            { type: Boolean, default: false },
  rating:           { type: Number, default: 0 },
  totalReviews:     { type: Number, default: 0 },
  totalSales:       { type: Number, default: 0 },
  totalRevenue:     { type: Number, default: 0 },
  viewCount:        { type: Number, default: 0 },
  shippingInfo:     { type: String },
  returnPolicy:     { type: String },
  aiGenerated:      { type: Boolean, default: false },
}, { timestamps: true })

// Indexes for common queries
ProductSchema.index({ vendorId: 1 })
ProductSchema.index({ categoryId: 1 })
ProductSchema.index({ status: 1 })
ProductSchema.index({ slug: 1 })
ProductSchema.index({ price: 1 })
ProductSchema.index({ rating: -1 })
ProductSchema.index({ totalSales: -1 })
ProductSchema.index({ createdAt: -1 })
ProductSchema.index({ featured: 1, status: 1 })
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' })  // full-text search

export const Product = mongoose.model<IProduct>('Product', ProductSchema)
```

---

### 4.6 Order

The most financially sensitive model. An order belongs to one buyer and one vendor. If a buyer purchases from multiple vendors at checkout, the system creates one Order per vendor (linked by `checkoutId`).

```typescript
// models/Order.ts

export interface IOrderItem {
  productId:   mongoose.Types.ObjectId
  variantSku?: string
  name:        string     // snapshot of product name at purchase time
  image:       string     // snapshot of product image
  price:       number     // snapshot of price at purchase time
  quantity:    number
  sku:         string
  subtotal:    number
}

export interface IOrder extends Document {
  orderNumber:    string                       // e.g. VND-2026-00001
  checkoutId?:    string                       // groups orders from same checkout session
  customerId:     mongoose.Types.ObjectId      // ref: User
  vendorId:       mongoose.Types.ObjectId      // ref: Vendor
  items:          IOrderItem[]
  status:         'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  paymentStatus:  'pending' | 'paid' | 'failed' | 'refunded'
  paymentMethod?: string
  paymentReference?: string                    // from payment gateway
  subtotal:       number
  shippingFee:    number
  discount:       number
  total:          number
  platformFee:    number                       // platform commission amount
  vendorEarnings: number                       // total - platformFee - shippingFee
  couponId?:      mongoose.Types.ObjectId      // ref: Coupon
  couponCode?:    string
  shippingAddress: {
    firstName:   string
    lastName:    string
    street:      string
    city:        string
    state:       string
    country:     string
    phone:       string
  }
  trackingNumber?: string
  notes?:          string
  cancelReason?:   string
  refundReason?:   string
  isPaidOut:       boolean                     // whether included in a payout
  payoutId?:       mongoose.Types.ObjectId     // ref: Payout
  confirmedAt?:    Date
  shippedAt?:      Date
  deliveredAt?:    Date
  cancelledAt?:    Date
  refundedAt?:     Date
  createdAt:       Date
  updatedAt:       Date
}

const OrderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  variantSku:{ type: String },
  name:      { type: String, required: true },
  image:     { type: String },
  price:     { type: Number, required: true },
  quantity:  { type: Number, required: true, min: 1 },
  sku:       { type: String },
  subtotal:  { type: Number, required: true },
}, { _id: false })

const OrderSchema = new Schema<IOrder>({
  orderNumber:      { type: String, required: true, unique: true },
  checkoutId:       { type: String },
  customerId:       { type: Schema.Types.ObjectId, ref: 'User', required: true },
  vendorId:         { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  items:            [OrderItemSchema],
  status:           { type: String, enum: ['pending','confirmed','processing','shipped','delivered','cancelled','refunded'], default: 'pending' },
  paymentStatus:    { type: String, enum: ['pending','paid','failed','refunded'], default: 'pending' },
  paymentMethod:    { type: String },
  paymentReference: { type: String },
  subtotal:         { type: Number, required: true },
  shippingFee:      { type: Number, default: 0 },
  discount:         { type: Number, default: 0 },
  total:            { type: Number, required: true },
  platformFee:      { type: Number, required: true },
  vendorEarnings:   { type: Number, required: true },
  couponId:         { type: Schema.Types.ObjectId, ref: 'Coupon' },
  couponCode:       { type: String },
  shippingAddress:  {
    firstName: { type: String, required: true },
    lastName:  { type: String, required: true },
    street:    { type: String, required: true },
    city:      { type: String, required: true },
    state:     { type: String, required: true },
    country:   { type: String, default: 'Nigeria' },
    phone:     { type: String, required: true },
  },
  trackingNumber: { type: String },
  notes:          { type: String },
  cancelReason:   { type: String },
  refundReason:   { type: String },
  isPaidOut:      { type: Boolean, default: false },
  payoutId:       { type: Schema.Types.ObjectId, ref: 'Payout' },
  confirmedAt:    { type: Date },
  shippedAt:      { type: Date },
  deliveredAt:    { type: Date },
  cancelledAt:    { type: Date },
  refundedAt:     { type: Date },
}, { timestamps: true })

OrderSchema.index({ orderNumber: 1 })
OrderSchema.index({ customerId: 1 })
OrderSchema.index({ vendorId: 1 })
OrderSchema.index({ status: 1 })
OrderSchema.index({ paymentStatus: 1 })
OrderSchema.index({ checkoutId: 1 })
OrderSchema.index({ createdAt: -1 })
OrderSchema.index({ isPaidOut: 1, vendorId: 1 })   // for payout queries

export const Order = mongoose.model<IOrder>('Order', OrderSchema)
```

**Why items are snapshots:** Product price and name can change after purchase. By copying the name, price, and image into the order at purchase time, you preserve an accurate historical record. The `productId` reference still links back to the live product.

---

### 4.7 Review

```typescript
// models/Review.ts

export interface IReview extends Document {
  productId:         mongoose.Types.ObjectId   // ref: Product
  vendorId:          mongoose.Types.ObjectId   // ref: Vendor
  userId:            mongoose.Types.ObjectId   // ref: User
  orderId:           mongoose.Types.ObjectId   // ref: Order — ensures verified purchase
  rating:            number                    // 1 – 5
  title?:            string
  body:              string
  images:            string[]                  // S3 URLs
  isVerifiedPurchase: boolean
  status:            'pending' | 'approved' | 'rejected'
  vendorReply?:      string
  vendorRepliedAt?:  Date
  helpfulCount:      number
  createdAt:         Date
  updatedAt:         Date
}

const ReviewSchema = new Schema<IReview>({
  productId:          { type: Schema.Types.ObjectId, ref: 'Product',  required: true },
  vendorId:           { type: Schema.Types.ObjectId, ref: 'Vendor',   required: true },
  userId:             { type: Schema.Types.ObjectId, ref: 'User',     required: true },
  orderId:            { type: Schema.Types.ObjectId, ref: 'Order',    required: true },
  rating:             { type: Number, required: true, min: 1, max: 5 },
  title:              { type: String },
  body:               { type: String, required: true },
  images:             [String],
  isVerifiedPurchase: { type: Boolean, default: true },
  status:             { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  vendorReply:        { type: String },
  vendorRepliedAt:    { type: Date },
  helpfulCount:       { type: Number, default: 0 },
}, { timestamps: true })

// A user can only review a product once per order
ReviewSchema.index({ productId: 1, userId: 1, orderId: 1 }, { unique: true })
ReviewSchema.index({ vendorId: 1 })
ReviewSchema.index({ status: 1 })
ReviewSchema.index({ rating: -1 })

export const Review = mongoose.model<IReview>('Review', ReviewSchema)
```

---

### 4.8 Coupon

```typescript
// models/Coupon.ts

export interface ICoupon extends Document {
  vendorId?:             mongoose.Types.ObjectId   // null = platform-wide coupon
  code:                  string
  type:                  'percentage' | 'fixed'
  value:                 number                    // % or naira amount
  minOrderAmount:        number                    // minimum cart value to apply
  maxDiscount?:          number                    // cap for percentage coupons
  usageLimit:            number                    // total uses allowed (0 = unlimited)
  usageLimitPerUser:     number                    // uses per user (usually 1)
  usedCount:             number
  isActive:              boolean
  expiresAt?:            Date
  applicableProducts:    mongoose.Types.ObjectId[] // empty = all products
  applicableCategories:  mongoose.Types.ObjectId[] // empty = all categories
  createdAt:             Date
  updatedAt:             Date
}

const CouponSchema = new Schema<ICoupon>({
  vendorId:            { type: Schema.Types.ObjectId, ref: 'Vendor', default: null },
  code:                { type: String, required: true, unique: true, uppercase: true },
  type:                { type: String, enum: ['percentage', 'fixed'], required: true },
  value:               { type: Number, required: true, min: 0 },
  minOrderAmount:      { type: Number, default: 0 },
  maxDiscount:         { type: Number },
  usageLimit:          { type: Number, default: 0 },
  usageLimitPerUser:   { type: Number, default: 1 },
  usedCount:           { type: Number, default: 0 },
  isActive:            { type: Boolean, default: true },
  expiresAt:           { type: Date },
  applicableProducts:  [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  applicableCategories:[{ type: Schema.Types.ObjectId, ref: 'Category' }],
}, { timestamps: true })

CouponSchema.index({ code: 1 })
CouponSchema.index({ vendorId: 1 })
CouponSchema.index({ isActive: 1, expiresAt: 1 })

export const Coupon = mongoose.model<ICoupon>('Coupon', CouponSchema)
```

---

### 4.9 CouponRedemption

Tracks every time a coupon is used. Needed to enforce `usageLimitPerUser`.

```typescript
// models/CouponRedemption.ts

export interface ICouponRedemption extends Document {
  couponId:  mongoose.Types.ObjectId    // ref: Coupon
  userId:    mongoose.Types.ObjectId    // ref: User
  orderId:   mongoose.Types.ObjectId    // ref: Order
  discount:  number                     // actual discount applied
  createdAt: Date
}

const CouponRedemptionSchema = new Schema<ICouponRedemption>({
  couponId: { type: Schema.Types.ObjectId, ref: 'Coupon', required: true },
  userId:   { type: Schema.Types.ObjectId, ref: 'User',   required: true },
  orderId:  { type: Schema.Types.ObjectId, ref: 'Order',  required: true },
  discount: { type: Number, required: true },
}, { timestamps: true })

CouponRedemptionSchema.index({ couponId: 1, userId: 1 })

export const CouponRedemption = mongoose.model<ICouponRedemption>('CouponRedemption', CouponRedemptionSchema)
```

---

### 4.10 Payout

```typescript
// models/Payout.ts

export interface IPayout extends Document {
  vendorId:    mongoose.Types.ObjectId
  amount:      number     // gross earnings from included orders
  platformFee: number     // already deducted during order creation
  netAmount:   number     // amount actually transferred to vendor
  status:      'pending' | 'processing' | 'completed' | 'failed'
  orderIds:    mongoose.Types.ObjectId[]   // ref: Order
  bankDetails: {
    bankName:      string
    accountNumber: string
    accountName:   string
  }
  reference?:  string     // bank transfer reference
  notes?:      string
  processedAt?: Date
  createdAt:   Date
  updatedAt:   Date
}

const PayoutSchema = new Schema<IPayout>({
  vendorId:   { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  amount:     { type: Number, required: true },
  platformFee:{ type: Number, required: true },
  netAmount:  { type: Number, required: true },
  status:     { type: String, enum: ['pending','processing','completed','failed'], default: 'pending' },
  orderIds:   [{ type: Schema.Types.ObjectId, ref: 'Order' }],
  bankDetails: {
    bankName:      { type: String, required: true },
    accountNumber: { type: String, required: true },
    accountName:   { type: String, required: true },
  },
  reference:   { type: String },
  notes:       { type: String },
  processedAt: { type: Date },
}, { timestamps: true })

PayoutSchema.index({ vendorId: 1 })
PayoutSchema.index({ status: 1 })

export const Payout = mongoose.model<IPayout>('Payout', PayoutSchema)
```

---

### 4.11 Cart

```typescript
// models/Cart.ts

export interface ICartItem {
  productId:   mongoose.Types.ObjectId
  variantSku?: string
  quantity:    number
  price:       number    // snapshot at time of adding
}

export interface ICart extends Document {
  userId:    mongoose.Types.ObjectId
  items:     ICartItem[]
  couponCode?: string
  updatedAt: Date
}

const CartSchema = new Schema<ICart>({
  userId:     { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items:      [{
    productId:  { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    variantSku: { type: String },
    quantity:   { type: Number, required: true, min: 1 },
    price:      { type: Number, required: true },
  }],
  couponCode: { type: String },
}, { timestamps: true })

CartSchema.index({ userId: 1 })

export const Cart = mongoose.model<ICart>('Cart', CartSchema)
```

---

### 4.12 Notification

```typescript
// models/Notification.ts

export interface INotification extends Document {
  userId:   mongoose.Types.ObjectId
  title:    string
  body:     string
  type:     'order' | 'payout' | 'review' | 'system' | 'promotion'
  isRead:   boolean
  link?:    string    // e.g. /vendor/orders/abc123
  createdAt: Date
}

const NotificationSchema = new Schema<INotification>({
  userId:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title:   { type: String, required: true },
  body:    { type: String, required: true },
  type:    { type: String, enum: ['order','payout','review','system','promotion'], required: true },
  isRead:  { type: Boolean, default: false },
  link:    { type: String },
}, { timestamps: true })

NotificationSchema.index({ userId: 1, isRead: 1 })
NotificationSchema.index({ createdAt: -1 })

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema)
```

---

### 4.13 DailyStat

Pre-aggregated analytics. Instead of running expensive aggregations on Orders every time a chart loads, a background job runs nightly to compute and store daily stats. The dashboard reads from this collection — fast and cheap.

```typescript
// models/DailyStat.ts

export interface IDailyStat extends Document {
  vendorId?:    mongoose.Types.ObjectId   // null = platform-wide stat
  date:         Date                      // midnight UTC of the stat day
  revenue:      number
  orders:       number
  refunds:      number
  newCustomers: number
  productViews: number
  avgOrderValue: number
  createdAt:    Date
}

const DailyStatSchema = new Schema<IDailyStat>({
  vendorId:      { type: Schema.Types.ObjectId, ref: 'Vendor', default: null },
  date:          { type: Date, required: true },
  revenue:       { type: Number, default: 0 },
  orders:        { type: Number, default: 0 },
  refunds:       { type: Number, default: 0 },
  newCustomers:  { type: Number, default: 0 },
  productViews:  { type: Number, default: 0 },
  avgOrderValue: { type: Number, default: 0 },
}, { timestamps: true })

// Unique per vendor per day
DailyStatSchema.index({ vendorId: 1, date: -1 }, { unique: true })
DailyStatSchema.index({ date: -1 })

export const DailyStat = mongoose.model<IDailyStat>('DailyStat', DailyStatSchema)
```

---

## 5. How the Schemas Connect

```
User (role: buyer)
  └── has one Cart
  └── has many Orders (as customer)
  └── has embedded Addresses[]
  └── has wishlist: Product[]
  └── has one active Session

User (role: vendor)
  └── has one Vendor
        └── has many Products
              └── has many Reviews
        └── has many Orders (as vendor)
        └── has many Payouts
              └── references many Orders

User (role: admin)
  └── manages all of the above

Order
  └── belongs to User (buyer)
  └── belongs to Vendor
  └── has embedded OrderItems[] (snapshots of Products)
  └── optionally references Coupon
  └── optionally references Payout (once paid out)

Coupon
  └── belongs to Vendor (or platform)
  └── tracked via CouponRedemption → links back to User + Order

Review
  └── belongs to Product
  └── belongs to Vendor
  └── belongs to User
  └── requires Order (verified purchase check)

DailyStat
  └── belongs to Vendor (or null for platform)
  └── populated nightly from Orders
```

---

## 6. Authentication & Single Device Login

### JWT Structure

```typescript
// Payload stored inside every JWT
interface JWTPayload {
  userId:    string    // User._id
  role:      'buyer' | 'vendor' | 'admin'
  sessionId: string   // UUID that must match User.activeSessionId
}
```

### Auth Flow

```
REGISTER
POST /api/auth/register
  1. Validate input (email unique, password strength)
  2. Hash password with bcrypt (12 rounds)
  3. Create User document
  4. Send verification email with token
  5. Return success (do not auto-login until email verified)

LOGIN
POST /api/auth/login
  1. Find user by email, select +password +activeSessionId
  2. Compare password with bcrypt
  3. Check user.status === 'active'
  4. Generate sessionId = uuid()
  5. Create Session document
  6. Update user.activeSessionId = sessionId
  7. Sign JWT: { userId, role, sessionId }, expires 30d
  8. Return { token, user }

EVERY PROTECTED REQUEST
Authorization: Bearer <token>
  Middleware:
  1. Extract and verify JWT
  2. Fetch user.activeSessionId from DB (lightweight query, only selects that field)
  3. If payload.sessionId !== user.activeSessionId → 401 { message: "Session expired. Please log in again." }
  4. If user.status !== 'active' → 403 { message: "Account suspended." }
  5. Attach user to req.user → proceed

LOGOUT
POST /api/auth/logout
  1. Set user.activeSessionId = null
  2. Mark session as inactive
  3. Return 200

FORCE LOGOUT (new device logs in)
  Happens automatically:
  1. New login sets user.activeSessionId to new sessionId
  2. Old JWT's sessionId no longer matches
  3. Next request from old device → 401
```

### Auth Middleware Code Pattern

```typescript
// middleware/auth.middleware.ts

export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'No token provided' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload

    // Fetch only the fields we need — don't fetch full user on every request
    const user = await User.findById(decoded.userId)
      .select('activeSessionId status role firstName lastName email avatar')

    if (!user) return res.status(401).json({ message: 'User not found' })
    if (user.status !== 'active') return res.status(403).json({ message: 'Account suspended' })

    // SINGLE DEVICE LOGIN CHECK
    if (user.activeSessionId !== decoded.sessionId) {
      return res.status(401).json({
        message: 'Your session has expired. You may have logged in on another device.'
      })
    }

    req.user = user
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}
```

---

## 7. Role-Based Access Control

Three roles exist: `buyer`, `vendor`, `admin`. Access is enforced at the route level by the role middleware.

```typescript
// middleware/role.middleware.ts

export const requireRole = (...roles: string[]) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' })
    }
    next()
  }
}

// Usage in routes:
router.get('/admin/users',    protect, requireRole('admin'),          getUsers)
router.post('/vendor/product', protect, requireRole('vendor'),        createProduct)
router.get('/account/orders',  protect, requireRole('buyer', 'admin'), getMyOrders)
```

### Route Access Matrix

| Route Group | Buyer | Vendor | Admin |
|---|---|---|---|
| /auth/* | Public | Public | Public |
| /products (read) | Yes | Yes | Yes |
| /products (write) | No | Own only | All |
| /orders (read) | Own only | Own store | All |
| /orders (write/status) | Place only | Update status | All |
| /vendor/* | No | Own store | All |
| /admin/* | No | No | Yes |
| /reviews (read) | Yes | Yes | Yes |
| /reviews (write) | Verified buyers | Reply only | All |
| /coupons (read) | Public codes | Own only | All |
| /coupons (write) | No | Own only | All |
| /payouts | No | Own only | All |
| /analytics | No | Own only | All |
| /ai/* | Yes (assistant) | Yes (insights) | Yes (command) |

---

## 8. API Endpoints

All routes are prefixed with `/api/v1`

### Authentication

```
POST   /auth/register              Register buyer account
POST   /auth/register/vendor       Register vendor account
POST   /auth/login                 Login (any role)
POST   /auth/logout                Logout (clears session)
POST   /auth/verify-email          Verify email with token
POST   /auth/forgot-password       Send password reset email
POST   /auth/reset-password        Reset password with token
GET    /auth/me                    Get current user profile
```

### Users (Buyer Account)

```
GET    /users/me                   Get profile
PATCH  /users/me                   Update profile (name, phone, avatar)
PATCH  /users/me/password          Change password
GET    /users/me/addresses         Get all saved addresses
POST   /users/me/addresses         Add address
PATCH  /users/me/addresses/:id     Update address
DELETE /users/me/addresses/:id     Delete address
GET    /users/me/wishlist          Get wishlist with product details
POST   /users/me/wishlist/:productId    Add to wishlist
DELETE /users/me/wishlist/:productId   Remove from wishlist
GET    /users/me/notifications     Get notifications
PATCH  /users/me/notifications/read-all   Mark all as read
```

### Storefront — Products

```
GET    /products                   List all active products (filters, sort, search, pagination)
GET    /products/:slug             Get single product by slug
GET    /products/featured          Get featured products
GET    /products/new-arrivals      Get newest products
GET    /products/bestsellers       Get bestselling products
POST   /products/:id/view          Increment view count
```

### Storefront — Categories

```
GET    /categories                 Get all top-level categories
GET    /categories/:slug           Get category + subcategories
GET    /categories/:slug/products  Get products in category
```

### Storefront — Vendors

```
GET    /vendors                    List all active vendor stores
GET    /vendors/:slug              Get vendor store profile + products
```

### Cart

```
GET    /cart                       Get current cart
POST   /cart/items                 Add item to cart
PATCH  /cart/items/:productId      Update quantity
DELETE /cart/items/:productId      Remove item
DELETE /cart                       Clear cart
POST   /cart/coupon                Apply coupon code
DELETE /cart/coupon                Remove coupon
```

### Orders (Buyer)

```
POST   /orders/checkout            Place order (creates one order per vendor)
GET    /orders                     Get buyer's order history
GET    /orders/:id                 Get single order detail
POST   /orders/:id/cancel          Cancel order (if still pending)
```

### Reviews

```
POST   /reviews                    Submit review (requires delivered order)
GET    /reviews/product/:productId Get product reviews (paginated)
PATCH  /reviews/:id/helpful        Mark review as helpful
```

### Vendor Portal

```
GET    /vendor/profile             Get own vendor profile
PATCH  /vendor/profile             Update store info, bio, policies
PATCH  /vendor/profile/bank        Update bank details
GET    /vendor/dashboard           Dashboard stats summary

GET    /vendor/products            List own products (all statuses)
POST   /vendor/products            Create product
GET    /vendor/products/:id        Get single product
PATCH  /vendor/products/:id        Update product
DELETE /vendor/products/:id        Delete (sets to archived)

GET    /vendor/orders              List store orders (filters by status)
GET    /vendor/orders/:id          Get order detail
PATCH  /vendor/orders/:id/status   Update order status (confirm/ship/etc)
PATCH  /vendor/orders/:id/tracking Add tracking number

GET    /vendor/reviews             List store reviews
PATCH  /vendor/reviews/:id/reply   Reply to a review

GET    /vendor/coupons             List own coupons
POST   /vendor/coupons             Create coupon
PATCH  /vendor/coupons/:id         Update coupon
PATCH  /vendor/coupons/:id/toggle  Enable/disable coupon
DELETE /vendor/coupons/:id         Delete coupon

GET    /vendor/payouts             List payouts
GET    /vendor/payouts/:id         Get payout detail
POST   /vendor/payouts/request     Request a payout

GET    /vendor/analytics           Analytics data (revenue, orders, views — by period)
GET    /vendor/customers           Unique customers who ordered from this vendor
```

### Admin Console

```
GET    /admin/dashboard            Platform-wide stats

GET    /admin/users                List all users (search, filter by role/status)
GET    /admin/users/:id            Get user detail
PATCH  /admin/users/:id/status     Suspend / ban / reactivate user

GET    /admin/vendors              List all vendors (filter by status/plan)
GET    /admin/vendors/:id          Get vendor detail
PATCH  /admin/vendors/:id/status   Approve / suspend / reject vendor
PATCH  /admin/vendors/:id/plan     Change vendor plan

GET    /admin/products             List all products across all vendors
PATCH  /admin/products/:id/status  Feature / archive any product

GET    /admin/orders               List all orders (all vendors)
GET    /admin/orders/:id           Get order detail
PATCH  /admin/orders/:id/status    Override order status

GET    /admin/reviews              List all reviews (pending moderation)
PATCH  /admin/reviews/:id/status   Approve or reject review

GET    /admin/coupons              List all coupons (all vendors + platform)
POST   /admin/coupons              Create platform-wide coupon

GET    /admin/payouts              List all vendor payouts
PATCH  /admin/payouts/:id/status   Process / complete / fail payout

GET    /admin/analytics            Full platform analytics

GET    /admin/categories           List categories
POST   /admin/categories           Create category
PATCH  /admin/categories/:id       Update category
DELETE /admin/categories/:id       Delete category
```

### AI Endpoints

```
POST   /ai/assistant               Storefront shopping assistant (buyer)
POST   /ai/describe                Generate product description (vendor)
POST   /ai/insights                Store insights chat (vendor)
POST   /ai/command                 Platform Q&A chat (admin)
```

### File Upload

```
POST   /upload/image               Upload image → S3, returns URL
POST   /upload/images              Upload multiple images → S3, returns URL array
DELETE /upload/image               Delete image from S3 by URL
```

---

## 9. File Upload Flow (Amazon S3)

### Setup

```typescript
// config/s3.ts
import { S3Client } from '@aws-sdk/client-s3'

export const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId:     process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})
```

### Upload Flow

```
CLIENT
  1. Selects image file in the UI
  2. Sends multipart/form-data POST to /api/v1/upload/image

SERVER
  3. multer middleware receives the file in memory (not saved to disk)
  4. Validate: file must be image/*, max 5MB
  5. Generate unique S3 key: uploads/{userId}/{uuid}.{ext}
  6. Upload buffer to S3 via PutObjectCommand
  7. Return the public S3 URL to client

CLIENT
  8. Stores the URL in the form (product image, vendor banner, avatar, etc.)
  9. On save, the URL is written to the MongoDB document
```

### S3 Bucket Structure

```
vendorly-uploads/
  ├── avatars/          {userId}.jpg
  ├── vendor-logos/     {vendorId}.jpg
  ├── vendor-banners/   {vendorId}.jpg
  ├── products/         {productId}/{uuid}.jpg
  └── reviews/          {reviewId}/{uuid}.jpg
```

### S3 Service

```typescript
// services/s3.service.ts

import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { s3 } from '@/config/s3'
import { v4 as uuid } from 'uuid'

export const uploadToS3 = async (
  file: Express.Multer.File,
  folder: string
): Promise<string> => {
  const ext = file.mimetype.split('/')[1]
  const key = `${folder}/${uuid()}.${ext}`

  await s3.send(new PutObjectCommand({
    Bucket:      process.env.AWS_BUCKET_NAME,
    Key:         key,
    Body:        file.buffer,
    ContentType: file.mimetype,
  }))

  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
}

export const deleteFromS3 = async (url: string): Promise<void> => {
  const key = url.split('.amazonaws.com/')[1]
  await s3.send(new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key:    key,
  }))
}
```

---

## 10. Order & Payout State Machine

### Order Status Flow

```
[pending]
    │ Payment confirmed
    ▼
[confirmed]
    │ Vendor starts preparing
    ▼
[processing]
    │ Vendor ships item + adds tracking number
    ▼
[shipped]
    │ Buyer confirms receipt (or auto after 7 days)
    ▼
[delivered] ──────────────────────────────── vendorEarnings added to vendor.payoutBalance
    │
    └── [refunded]   (if dispute raised within 7 days of delivery)

From [pending] or [confirmed] → [cancelled]   (buyer cancels before shipment)
From [shipped] → [refunded]   (admin override only)
```

### Order Creation with MongoDB Transaction

This is the most critical piece of backend code. A transaction ensures all or nothing — if any step fails, nothing is saved.

```typescript
// services/order.service.ts

export const createOrder = async (userId, cartId, shippingAddress) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const cart = await Cart.findById(cartId).populate('items.productId').session(session)

    // 1. Validate all items are still in stock
    for (const item of cart.items) {
      const product = item.productId as IProduct
      if (product.stock < item.quantity) {
        throw new Error(`${product.name} is out of stock`)
      }
    }

    // 2. Validate and apply coupon if present
    let discount = 0
    if (cart.couponCode) {
      discount = await validateAndReserveCoupon(cart.couponCode, userId, session)
    }

    // 3. Group items by vendor (one order per vendor)
    const vendorGroups = groupItemsByVendor(cart.items)
    const checkoutId = uuid()
    const createdOrders = []

    for (const [vendorId, items] of Object.entries(vendorGroups)) {
      const vendor = await Vendor.findById(vendorId).session(session)
      const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
      const platformFee = subtotal * (vendor.commissionRate / 100)
      const vendorEarnings = subtotal - platformFee

      const order = await Order.create([{
        orderNumber:    generateOrderNumber(),
        checkoutId,
        customerId:     userId,
        vendorId,
        items:          items.map(snapshotItem),
        subtotal,
        shippingFee:    0,
        discount:       vendorId === primaryVendorId ? discount : 0,
        total:          subtotal - discount,
        platformFee,
        vendorEarnings,
        shippingAddress,
        paymentStatus:  'paid',
        status:         'confirmed',
      }], { session })

      createdOrders.push(order[0])

      // 4. Decrement stock for each product
      for (const item of items) {
        await Product.findByIdAndUpdate(
          item.productId,
          {
            $inc: { stock: -item.quantity, totalSales: item.quantity, totalRevenue: item.price * item.quantity }
          },
          { session }
        )
      }

      // 5. Add earnings to vendor balance
      await Vendor.findByIdAndUpdate(
        vendorId,
        { $inc: { payoutBalance: vendorEarnings, totalRevenue: subtotal, totalSales: 1 } },
        { session }
      )
    }

    // 6. Mark coupon as used
    if (cart.couponCode) {
      await commitCouponRedemption(cart.couponCode, userId, createdOrders[0]._id, discount, session)
    }

    // 7. Clear cart
    await Cart.findByIdAndUpdate(cartId, { items: [], couponCode: null }, { session })

    await session.commitTransaction()
    return createdOrders

  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }
}
```

### Payout Flow

```
VENDOR REQUESTS PAYOUT
  1. Vendor clicks "Request Payout" on /vendor/payouts
  2. API checks vendor.payoutBalance > minimum threshold (e.g. ₦5,000)
  3. Fetches all delivered orders where isPaidOut = false
  4. Creates Payout document { status: 'pending', orderIds, amount, netAmount }
  5. Marks all included orders: isPaidOut = true, payoutId = payout._id
  6. Resets vendor.payoutBalance = 0
  (All steps wrapped in a MongoDB transaction)

ADMIN PROCESSES PAYOUT
  PATCH /admin/payouts/:id/status { status: 'completed', reference: 'TRF123' }
  1. Updates payout.status = 'completed'
  2. Saves bank transfer reference
  3. Sends notification to vendor
  4. Logs processedAt timestamp
```

---

## 11. AI Integration Architecture

All four AI features in the frontend (shopping assistant, description generator, vendor insights, admin command) connect to the same pattern: a POST endpoint that receives context, calls Claude API, and streams or returns the response.

### Setup

```typescript
// config/ai.ts
import Anthropic from '@anthropic-ai/sdk'

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})
```

### AI Service Pattern

```typescript
// services/ai.service.ts

export const generateProductDescription = async (
  prompt: string,
  vendorContext: { storeName: string; category: string }
): Promise<string> => {

  const message = await anthropic.messages.create({
    model:      'claude-sonnet-4-6',
    max_tokens: 800,
    messages: [{
      role:    'user',
      content: `You are a product copywriter for ${vendorContext.storeName}, a vendor on Vendorly marketplace (${vendorContext.category} category).

Write a compelling product listing description for: "${prompt}"

Requirements:
- 150-200 words
- Highlight materials, craftsmanship, and unique selling points
- End with 3-4 bullet points of key features
- Tone: warm, professional, aspirational
- Do not use markdown headers`
    }],
  })

  return (message.content[0] as { text: string }).text
}

export const getShoppingAssistantResponse = async (
  query: string,
  context: { recentProducts: any[]; trendingCategories: string[] }
): Promise<string> => {

  const message = await anthropic.messages.create({
    model:      'claude-haiku-4-5-20251001',   // faster model for chat
    max_tokens: 400,
    system: `You are a helpful shopping assistant on Vendorly, a Nigerian handmade and artisan marketplace.
You help buyers find products, discover deals, and navigate the marketplace.
Current trending categories: ${context.trendingCategories.join(', ')}.
Keep responses conversational, friendly, and concise. Suggest real product names when relevant.`,
    messages: [{ role: 'user', content: query }],
  })

  return (message.content[0] as { text: string }).text
}
```

### AI Endpoints

```typescript
// routes/ai.routes.ts

// Shopping assistant — public or buyer only
router.post('/assistant',
  protect,
  requireRole('buyer', 'admin'),
  async (req, res) => {
    const { query } = req.body
    const context = await getMarketplaceContext()
    const response = await getShoppingAssistantResponse(query, context)
    res.json({ response })
  }
)

// Description generator — vendor only
router.post('/describe',
  protect,
  requireRole('vendor'),
  async (req, res) => {
    const { prompt } = req.body
    const vendor = await Vendor.findOne({ userId: req.user._id })
    const description = await generateProductDescription(prompt, {
      storeName: vendor.storeName,
      category: vendor.category,
    })
    res.json({ description })
  }
)
```

---

## 12. Analytics System

### Two-Layer Approach

**Layer 1 — Live queries:** For the last 24 hours, query Orders directly (small dataset, fast enough).

**Layer 2 — Pre-aggregated stats:** For anything beyond 24 hours, read from `DailyStat` collection (pre-computed, instant).

### Nightly Aggregation Job

Run via `node-cron` every night at midnight:

```typescript
// Runs at 00:05 UTC every day (after midnight)
cron.schedule('5 0 * * *', async () => {
  const yesterday = getYesterdayDateRange()

  // Aggregate orders for each vendor
  const vendorStats = await Order.aggregate([
    { $match: { createdAt: { $gte: yesterday.start, $lte: yesterday.end }, paymentStatus: 'paid' } },
    { $group: {
      _id:          '$vendorId',
      revenue:      { $sum: '$total' },
      orders:       { $sum: 1 },
      refunds:      { $sum: { $cond: [{ $eq: ['$status', 'refunded'] }, 1, 0] } },
      avgOrderValue:{ $avg: '$total' },
    }}
  ])

  // Upsert into DailyStat
  for (const stat of vendorStats) {
    await DailyStat.findOneAndUpdate(
      { vendorId: stat._id, date: yesterday.start },
      { ...stat, date: yesterday.start },
      { upsert: true }
    )
  }
})
```

### Vendor Analytics Query

```typescript
// GET /vendor/analytics?period=30d
export const getVendorAnalytics = async (vendorId, period) => {
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
  const startDate = subDays(new Date(), days)

  const stats = await DailyStat.find({
    vendorId,
    date: { $gte: startDate },
  }).sort({ date: 1 })

  const totals = stats.reduce((acc, s) => ({
    revenue:      acc.revenue + s.revenue,
    orders:       acc.orders + s.orders,
    refunds:      acc.refunds + s.refunds,
    productViews: acc.productViews + s.productViews,
  }), { revenue: 0, orders: 0, refunds: 0, productViews: 0 })

  return { daily: stats, totals }
}
```

---

## 13. Error Handling Strategy

### Standard Error Response Shape

Every error from the API returns the same structure:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": [...]   // optional, for validation errors
}
```

### ApiError Class

```typescript
// utils/apiError.ts
export class ApiError extends Error {
  statusCode: number
  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
  }
}
```

### Global Error Handler

```typescript
// middleware/errorHandler.middleware.ts
export const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ success: false, message: err.message })
  }

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e: any) => e.message)
    return res.status(400).json({ success: false, message: 'Validation failed', errors })
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0]
    return res.status(409).json({ success: false, message: `${field} already exists` })
  }

  console.error(err)
  res.status(500).json({ success: false, message: 'Internal server error' })
}
```

---

## 14. Environment Variables

```bash
# .env

# Server
NODE_ENV=development
PORT=5000

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vendorly

# JWT
JWT_SECRET=your_very_long_random_secret_here
JWT_EXPIRES_IN=30d

# AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=eu-west-1
AWS_BUCKET_NAME=vendorly-uploads

# Anthropic AI
ANTHROPIC_API_KEY=sk-ant-...

# Email (SendGrid or Resend)
EMAIL_FROM=noreply@vendorly.com
SENDGRID_API_KEY=SG....

# Frontend URL (for email links, CORS)
CLIENT_URL=http://localhost:3000
```

---

## Summary

| Item | Decision |
|---|---|
| Language | Node.js + TypeScript |
| Framework | Express.js |
| Database | MongoDB via Mongoose |
| Auth | JWT + UUID session ID for single device login |
| File storage | Amazon S3 |
| AI | Anthropic Claude API (`@anthropic-ai/sdk`) |
| Analytics | Pre-aggregated DailyStat + nightly cron job |
| Transactions | MongoDB sessions for all financial operations |
| Collections | 13 total (User, Session, Vendor, Category, Product, Order, Review, Coupon, CouponRedemption, Payout, Cart, Notification, DailyStat) |

---

*Document version: 1.0 — March 2026*
*Frontend: Next.js 14 · TypeScript · Tailwind CSS (already built)*
*Backend: Node.js · Express · TypeScript · Mongoose · MongoDB · Amazon S3 · Anthropic Claude*
