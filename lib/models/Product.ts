import mongoose, { Schema, models, model } from 'mongoose'

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    image: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    badge: {
      type: String,
      trim: true,
      default: null,
    },
    specs: {
      type: Map,
      of: String,
      default: {},
    },
  },
  { timestamps: true }
)

// Prevent OverwriteModelError in development with hot-reload
if (process.env.NODE_ENV === 'development' && mongoose.models.Product) {
  delete mongoose.models.Product
}

export const Product = models.Product ?? model('Product', ProductSchema)
