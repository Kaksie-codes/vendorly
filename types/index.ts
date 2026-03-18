// ─────────────────────────────────────────────────────────────────────────────
// File: index.ts
// Path: types/index.ts
// ─────────────────────────────────────────────────────────────────────────────
// VENDORLY — Core TypeScript Types
// ─────────────────────────────────────────────────────────────────────────────

// ─── Shared primitives ───────────────────────────────────────────────────────

export type ID = string

export type Currency = {
  amount: number
  code: 'USD' | 'EUR' | 'GBP' | 'NGN'
  symbol: string
}

export type Image = {
  url: string
  alt: string
  width?: number
  height?: number
}

export type Address = {
  id: ID
  label?: string           // "Home", "Office", etc.
  firstName: string
  lastName: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault?: boolean
}

export type PaginationMeta = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

// ─── User / Auth ─────────────────────────────────────────────────────────────

export type UserRole = 'customer' | 'vendor' | 'admin'

export type UserStatus = 'active' | 'suspended' | 'pending_verification'

export type User = {
  id: ID
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatar?: string
  role: UserRole
  status: UserStatus
  addresses: Address[]
  createdAt: string
  updatedAt: string
}

export type Customer = User & {
  role: 'customer'
  wishlist: ID[]              // product IDs
  savedPaymentMethods: PaymentMethod[]
  totalOrders: number
  totalSpent: number
}

// ─── Vendor ───────────────────────────────────────────────────────────────────

export type VendorStatus = 'active' | 'pending' | 'suspended' | 'rejected'

export type VendorPlan = 'free' | 'starter' | 'growth'

export type Vendor = {
  id: ID
  userId: ID
  storeName: string
  storeSlug: string
  tagline?: string
  description: string
  logo?: string
  banner?: string
  email: string
  phone?: string
  website?: string
  address: Address
  status: VendorStatus
  plan: VendorPlan
  rating: number              // 0–5
  reviewCount: number
  productCount: number
  totalSales: number
  totalRevenue: number
  joinedAt: string
  categories: ID[]            // category IDs this vendor sells in
  shippingPolicy?: string
  returnPolicy?: string
  socialLinks?: {
    instagram?: string
    twitter?: string
    facebook?: string
  }
}

// ─── Category ────────────────────────────────────────────────────────────────

export type Category = {
  id: ID
  name: string
  slug: string
  description?: string
  image?: string
  icon?: string               // emoji or icon name
  parentId?: ID               // null = top-level
  children?: Category[]
  productCount: number
  featured: boolean
}

// ─── Product ─────────────────────────────────────────────────────────────────

export type ProductStatus = 'active' | 'draft' | 'archived' | 'out_of_stock'

export type ProductCondition = 'new' | 'like_new' | 'good' | 'fair'

export type ProductVariantOption = {
  name: string                // e.g. "Size", "Color"
  values: string[]            // e.g. ["S", "M", "L", "XL"]
}

export type ProductVariant = {
  id: ID
  sku: string
  options: Record<string, string>  // { Size: "M", Color: "Red" }
  price: number
  compareAtPrice?: number
  stock: number
  image?: string
}

export type Product = {
  id: ID
  vendorId: ID
  categoryId: ID
  name: string
  slug: string
  description: string
  shortDescription?: string
  images: Image[]
  price: number               // base price
  compareAtPrice?: number     // original / strike-through price
  currency: string            // "USD"
  variants?: ProductVariant[]
  variantOptions?: ProductVariantOption[]
  sku: string
  stock: number
  status: ProductStatus
  condition: ProductCondition
  tags: string[]
  rating: number              // 0–5
  reviewCount: number
  soldCount: number
  featured: boolean
  isBestseller: boolean
  isNew: boolean
  weight?: number             // grams
  dimensions?: {
    length: number
    width: number
    height: number
    unit: 'cm' | 'in'
  }
  shippingInfo?: string
  returnPolicy?: string
  createdAt: string
  updatedAt: string
}

// ─── Review ───────────────────────────────────────────────────────────────────

export type ReviewStatus = 'published' | 'pending' | 'rejected'

export type Review = {
  id: ID
  productId: ID
  vendorId: ID
  userId: ID
  orderId: ID
  rating: number              // 1–5
  title?: string
  body: string
  images?: Image[]
  status: ReviewStatus
  helpfulCount: number
  verifiedPurchase: boolean
  createdAt: string
  updatedAt: string
  // populated fields
  user?: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatar'>
  product?: Pick<Product, 'id' | 'name' | 'slug' | 'images'>
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export type CartItem = {
  id: ID
  productId: ID
  vendorId: ID
  variantId?: ID
  quantity: number
  price: number               // price at time of adding
  selectedOptions?: Record<string, string>
  // populated
  product?: Product
  variant?: ProductVariant
}

export type Cart = {
  id: ID
  userId?: ID                 // null = guest cart
  items: CartItem[]
  subtotal: number
  discountAmount: number
  shippingAmount: number
  taxAmount: number
  total: number
  couponCode?: string
  createdAt: string
  updatedAt: string
}

// ─── Order ────────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded'
  | 'return_requested'
  | 'returned'

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded'

export type OrderItem = {
  id: ID
  productId: ID
  vendorId: ID
  variantId?: ID
  name: string                // snapshot at time of order
  image: string
  sku: string
  selectedOptions?: Record<string, string>
  quantity: number
  unitPrice: number
  totalPrice: number
}

export type TrackingEvent = {
  status: string
  description: string
  location?: string
  timestamp: string
}

export type Order = {
  id: ID
  orderNumber: string         // human-readable e.g. "VND-20240115-0042"
  userId: ID
  items: OrderItem[]
  shippingAddress: Address
  billingAddress: Address
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: string
  subtotal: number
  discountAmount: number
  shippingAmount: number
  taxAmount: number
  total: number
  couponCode?: string
  notes?: string
  trackingNumber?: string
  trackingCarrier?: string
  trackingEvents?: TrackingEvent[]
  estimatedDelivery?: string
  deliveredAt?: string
  createdAt: string
  updatedAt: string
  // populated
  customer?: Pick<User, 'id' | 'firstName' | 'lastName' | 'email'>
}

// ─── Payment ──────────────────────────────────────────────────────────────────

export type PaymentMethodType = 'card' | 'paypal' | 'bank_transfer' | 'crypto'

export type PaymentMethod = {
  id: ID
  type: PaymentMethodType
  label: string               // "Visa •••• 4242"
  isDefault: boolean
  // card specific
  cardBrand?: 'visa' | 'mastercard' | 'amex' | 'discover'
  last4?: string
  expiryMonth?: number
  expiryYear?: number
}

// ─── Payout ───────────────────────────────────────────────────────────────────

export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed'

export type Payout = {
  id: ID
  vendorId: ID
  amount: number
  currency: string
  status: PayoutStatus
  method: string
  reference: string
  period: {
    from: string
    to: string
  }
  ordersCount: number
  createdAt: string
  processedAt?: string
}

// ─── Coupon ───────────────────────────────────────────────────────────────────

export type CouponType = 'percentage' | 'fixed_amount' | 'free_shipping'

export type Coupon = {
  id: ID
  code: string
  type: CouponType
  value: number               // % or fixed amount
  minOrderAmount?: number
  maxDiscountAmount?: number
  usageLimit?: number
  usageCount: number
  vendorId?: ID               // null = platform-wide
  applicableCategories?: ID[]
  applicableProducts?: ID[]
  startsAt: string
  expiresAt?: string
  isActive: boolean
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export type AnalyticsPeriod = '7d' | '30d' | '90d' | '12m' | 'all'

export type RevenueDataPoint = {
  date: string
  revenue: number
  orders: number
}

export type VendorAnalytics = {
  vendorId: ID
  period: AnalyticsPeriod
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  totalProductViews: number
  conversionRate: number
  topProducts: Array<{
    productId: ID
    name: string
    revenue: number
    unitsSold: number
  }>
  revenueByDay: RevenueDataPoint[]
  ordersByStatus: Record<OrderStatus, number>
}

export type AdminAnalytics = {
  period: AnalyticsPeriod
  totalRevenue: number
  platformFees: number
  totalOrders: number
  totalUsers: number
  newUsers: number
  totalVendors: number
  newVendors: number
  activeProducts: number
  revenueByDay: RevenueDataPoint[]
  topVendors: Array<{
    vendorId: ID
    storeName: string
    revenue: number
    orders: number
  }>
  topCategories: Array<{
    categoryId: ID
    name: string
    revenue: number
    orders: number
  }>
}

// ─── Notification ────────────────────────────────────────────────────────────

export type NotificationType =
  | 'order_placed'
  | 'order_shipped'
  | 'order_delivered'
  | 'order_cancelled'
  | 'new_review'
  | 'payout_processed'
  | 'product_low_stock'
  | 'account_update'
  | 'promotion'

export type Notification = {
  id: ID
  userId: ID
  type: NotificationType
  title: string
  message: string
  read: boolean
  actionUrl?: string
  createdAt: string
}