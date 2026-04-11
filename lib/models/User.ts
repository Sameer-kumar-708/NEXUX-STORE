import mongoose, { Schema, models, model } from 'mongoose'

/** Every new account is a normal customer until promoted to admin in the database. */
export const DEFAULT_USER_ROLE = 'user' as const
export const USER_ROLES = ['user', 'admin'] as const
export type UserRoleValue = (typeof USER_ROLES)[number]

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: DEFAULT_USER_ROLE,
    },
  },
  { timestamps: true }
)

if (process.env.NODE_ENV === 'development' && mongoose.models.User) {
  delete mongoose.models.User
}

export const User = models.User ?? model('User', UserSchema)

/**
 * Writes `role: "user"` to MongoDB when the field is missing or invalid
 * (e.g. users created before `role` existed). Admins are left unchanged.
 */
export async function persistUserRoleIfMissing(
  doc: mongoose.Document
): Promise<UserRoleValue> {
  const r = doc.get('role') as string | undefined | null
  if (r === 'admin') return 'admin'
  if (r === 'user') return 'user'
  doc.set('role', DEFAULT_USER_ROLE)
  await doc.save()
  return DEFAULT_USER_ROLE
}
