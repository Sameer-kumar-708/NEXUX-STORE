'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { products } from '@/lib/products'
import { imageDefaults } from '@/lib/images'
import { useAdmin } from '@/lib/admin-store'
import { Plus, Edit2, Trash2, X } from 'lucide-react'
import { fadeInUp, staggerContainer } from '@/lib/animations'

interface FormData {
  name: string
  description: string
  price: string
  originalPrice: string
  image: string
  category: string
  stock: string
  rating: string
  reviews: string
}

export default function AdminPage() {
  const [adminProducts, setAdminProducts] = useState(products)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    image: '',
    category: '',
    stock: '',
    rating: '',
    reviews: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingId) {
      setAdminProducts((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
                image: formData.image,
                category: formData.category,
                stock: parseInt(formData.stock),
                rating: parseFloat(formData.rating),
                reviews: parseInt(formData.reviews),
              }
            : p
        )
      )
      setEditingId(null)
    } else {
      const newProduct = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        image: formData.image,
        category: formData.category,
        stock: parseInt(formData.stock),
        rating: parseFloat(formData.rating),
        reviews: parseInt(formData.reviews),
      }
      setAdminProducts((prev) => [...prev, newProduct as any])
    }

    setFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      image: '',
      category: '',
      stock: '',
      rating: '',
      reviews: '',
    })
    setShowForm(false)
  }

  const handleEdit = (product: any) => {
    setEditingId(product.id)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      image: product.image,
      category: product.category,
      stock: product.stock.toString(),
      rating: product.rating.toString(),
      reviews: product.reviews.toString(),
    })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    setAdminProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      image: '',
      category: '',
      stock: '',
      rating: '',
      reviews: '',
    })
  }

  return (
    <main className="bg-background text-foreground min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-7xl mx-auto"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Header */}
        <motion.div className="mb-12" variants={fadeInUp}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-2">Manage your products</p>
            </div>
            <motion.button
              onClick={() => {
                setEditingId(null)
                setShowForm(!showForm)
                if (showForm) handleCloseForm()
              }}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 smooth-transition w-fit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5" />
              Add Product
            </motion.button>
          </div>
        </motion.div>

        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              className="glass p-6 sm:p-8 rounded-2xl mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              variants={fadeInUp}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editingId ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={handleCloseForm}
                  className="p-2 hover:bg-white/5 rounded-lg smooth-transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Product Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-card border border-white/10 rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                      placeholder="Enter product name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-card border border-white/10 rounded-lg px-4 py-2 text-foreground focus:border-primary focus:outline-none"
                    >
                      <option value="">Select a category</option>
                      <option value="electronics">Electronics</option>
                      <option value="laptops">Laptops</option>
                      <option value="phones">Phones</option>
                      <option value="earphones">Earphones</option>
                      <option value="cameras">Cameras</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Price</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      step="0.01"
                      className="w-full bg-card border border-white/10 rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Original Price (Optional)
                    </label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleInputChange}
                      step="0.01"
                      className="w-full bg-card border border-white/10 rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Stock</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-card border border-white/10 rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Rating</label>
                    <input
                      type="number"
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      required
                      min="0"
                      max="5"
                      step="0.1"
                      className="w-full bg-card border border-white/10 rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                      placeholder="4.5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Reviews</label>
                    <input
                      type="number"
                      name="reviews"
                      value={formData.reviews}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-card border border-white/10 rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Image URL
                    </label>
                    <input
                      type="text"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-card border border-white/10 rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                      placeholder={imageDefaults.adminImagePlaceholder}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full bg-card border border-white/10 rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none resize-none"
                    placeholder="Enter product description"
                  />
                </div>

                <div className="flex gap-4">
                  <motion.button
                    type="submit"
                    className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 smooth-transition"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {editingId ? 'Update Product' : 'Add Product'}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleCloseForm}
                    className="flex-1 glass py-3 rounded-lg font-semibold hover:border-primary/50 smooth-transition"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Table */}
        <motion.div
          className="glass rounded-2xl overflow-hidden"
          variants={fadeInUp}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/5 bg-card/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Rating
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence>
                  {adminProducts.map((product) => (
                    <motion.tr
                      key={product.id}
                      layout
                      exit={{ opacity: 0, x: -100 }}
                      className="hover:bg-card/30 smooth-transition"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <span className="font-medium line-clamp-1">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm capitalize">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 font-semibold text-primary">
                        ${product.price}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={product.stock > 10 ? 'text-green-400' : 'text-orange-400'}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        ⭐ {product.rating} ({product.reviews})
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <motion.button
                            onClick={() => handleEdit(product)}
                            className="p-2 hover:bg-blue-500/10 hover:text-blue-500 rounded-lg smooth-transition"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Edit2 className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg smooth-transition"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {[
            {
              label: 'Total Products',
              value: adminProducts.length,
            },
            {
              label: 'Low Stock',
              value: adminProducts.filter((p) => p.stock < 10).length,
            },
            {
              label: 'Avg Rating',
              value: (
                (adminProducts.reduce((sum, p) => sum + p.rating, 0) /
                  adminProducts.length) || 0
              ).toFixed(1),
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass p-6 rounded-xl"
              variants={fadeInUp}
            >
              <p className="text-muted-foreground text-sm mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </main>
  )
}
