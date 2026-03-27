import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, Timestamp, addDoc } from 'firebase/firestore'

const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
]

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.warn(`Missing environment variable: ${varName}`)
  }
})

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyAbhUYAHUYPAA8nQXorSkFuMjuSUUjR6GQ',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)

export interface Voucher {
  id?: string
  code: string
  discountPercent: number
  applicableItems: string[]
  applicableCustomers: string[] | 'all'
  isActive: boolean
  createdAt: Timestamp
  validUntil?: Timestamp
}

export interface VoucherUsage {
  voucherId: string
  orderId: string
  customerId: string
  discountAmount: number
  usedAt: Timestamp
}

export const createVoucher = async (voucherData: Omit<Voucher, 'id' | 'createdAt'>) => {
  const voucherRef = doc(collection(db, 'vouchers'))
  const newVoucher: Voucher = {
    ...voucherData,
    id: voucherRef.id,
    createdAt: Timestamp.now()
  }
  await setDoc(voucherRef, newVoucher)
  return newVoucher
}

export const getVouchers = async () => {
  const vouchersRef = collection(db, 'vouchers')
  const snapshot = await getDocs(vouchersRef)
  return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Voucher))
}

export const getActiveVouchers = async () => {
  const vouchersRef = collection(db, 'vouchers')
  const q = query(vouchersRef, where('isActive', '==', true))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Voucher))
}

export const updateVoucher = async (voucherId: string, updates: Partial<Voucher>) => {
  const voucherRef = doc(db, 'vouchers', voucherId)
  await updateDoc(voucherRef, updates)
}

export const deleteVoucher = async (voucherId: string) => {
  const voucherRef = doc(db, 'vouchers', voucherId)
  await deleteDoc(voucherRef)
}

export const getApplicableVouchers = async (customerId: string, itemIds: string[]) => {
  const allVouchers = await getActiveVouchers()
  const now = Timestamp.now()
  
  return allVouchers.filter(voucher => {
    if (voucher.validUntil && voucher.validUntil.toMillis() < now.toMillis()) {
      return false
    }
    
    const isCustomerApplicable = voucher.applicableCustomers === 'all' || 
      (Array.isArray(voucher.applicableCustomers) && voucher.applicableCustomers.includes(customerId))
    
    const hasApplicableItems = voucher.applicableItems.length === 0 || 
      itemIds.some(itemId => voucher.applicableItems.includes(itemId))
    
    return isCustomerApplicable && hasApplicableItems
  })
}

export const calculateDiscount = (originalPrice: number, discountPercent: number) => {
  return Math.round(originalPrice * (discountPercent / 100))
}

export const applyVoucherToOrder = async (
  voucherId: string, 
  orderId: string, 
  customerId: string, 
  discountAmount: number
) => {
  const usageRef = doc(collection(db, 'voucherUsages'))
  const usage: VoucherUsage = {
    voucherId,
    orderId,
    customerId,
    discountAmount,
    usedAt: Timestamp.now()
  }
  await setDoc(usageRef, usage)
  return usage
}

export const saveProfilePhotoToFirestore = async (userId: string, photoBase64: string) => {
  const userRef = doc(db, 'users', userId)
  await updateDoc(userRef, { photoURL: photoBase64 })
}

export const getProfilePhotoFromFirestore = async (userId: string) => {
  const userRef = doc(db, 'users', userId)
  const snapshot = await getDoc(userRef)
  return snapshot.exists() ? snapshot.data().photoURL : null
}

export default app