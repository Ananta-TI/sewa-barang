import { createContext, useContext, useMemo, useState, useEffect } from 'react'
import { DEFAULT_LOCATION } from '../data/locations'
import { supabase } from '../lib/supabase' // Sesuaikan path ini
import { daysBetween, slugify } from '../utils/format'

const DemoContext = createContext(null)
const SESSION_KEY = 'sbs-demo-session-v1'

export function DemoProvider({ children }) {
  // State untuk menyimpan semua data dari Supabase
  const [db, setDb] = useState({
    users: [], items: [], categories: [], rentals: [], favorites: [], reviews: [], reports: [], notifications: []
  })
  const [sessionuser_id, setSessionuser_id] = useState(() => Number(localStorage.getItem(SESSION_KEY)) || null)
  const [loading, setLoading] = useState(true)

  const currentUser = db.users.find((user) => user.id === sessionuser_id) || null

  const setSession = (id) => {
    setSessionuser_id(id)
    if (id) localStorage.setItem(SESSION_KEY, String(id))
    else localStorage.removeItem(SESSION_KEY)
  }
// 1. Fungsi penanganan string snake_case ke camelCase
const snakeToCamel = (str) => 
  str.replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''));

// 2. Fungsi konversi rekursif yang lebih aman untuk array dan objek database
const convertKeysToCamel = (data) => {
  if (Array.isArray(data)) {
    return data.map(v => convertKeysToCamel(v));
  } else if (data !== null && data !== undefined && data.constructor === Object) {
    return Object.keys(data).reduce((result, key) => {
      const camelKey = snakeToCamel(key);
      result[camelKey] = convertKeysToCamel(data[key]);
      return result;
    }, {});
  }
  return data;
};
  // Fetch semua data dari database saat aplikasi dimuat
  const fetchDatabase = async () => {
    setLoading(true)
    try {
      const [
        { data: users }, { data: items }, { data: categories },
        { data: rentals }, { data: favorites }, { data: reviews },
        { data: reports }, { data: notifications }
      ] = await Promise.all([
        supabase.from('users').select('*'),
        supabase.from('items').select('*'),
        supabase.from('categories').select('*'),
        supabase.from('rentals').select('*'),
        supabase.from('favorites').select('*'),
        supabase.from('reviews').select('*'),
        supabase.from('reports').select('*'),
        supabase.from('notifications').select('*')
      ])

      setDb({
        users: users || [], items: items || [], categories: categories || [],
        rentals: rentals || [], favorites: favorites || [], reviews: reviews || [],
        reports: reports || [], notifications: notifications || []
      })
    } catch (error) {
      console.error("Gagal memuat database:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDatabase()
  }, [])

  // --- AUTHENTICATION ---
  const login = async (email, password) => {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single()

    if (error || !user) throw new Error('Email atau password tidak sesuai.')
    if (user.status === 'diblokir') throw new Error('Akun sedang diblokir oleh administrator.')
    
    setSession(user.id)
    await fetchDatabase() // Refresh state
    return user
  }

  const register = async ({ name, email, phone, password }) => {
    const { data: existingUser } = await supabase.from('users').select('id').eq('email', email).single()
    if (existingUser) throw new Error('Email sudah digunakan.')

    const newUser = {
      name, email, phone, password, role: 'user', status: 'aktif',
      address: 'Pekanbaru, Riau', avatar: '/items/avatar-user.svg', rating: 0,
      joined_at: new Date().toISOString().slice(0, 10),
      latitude: DEFAULT_LOCATION.latitude, longitude: DEFAULT_LOCATION.longitude,
    }

    const { data, error } = await supabase.from('users').insert(newUser).select().single()
    if (error) throw new Error('Gagal mendaftar: ' + error.message)

    setSession(data.id)
    await fetchDatabase()
    return data
  }

  const logout = () => setSession(null)

  // --- ITEMS ---
  const saveItem = async (payload, item_id = null) => {
    if (!currentUser) throw new Error('Silakan login terlebih dahulu.')

    const imageUrl = String(payload.image || '').trim() || '/items/default.svg'
    const rules = Array.isArray(payload.rules) ? payload.rules : String(payload.rules || '').split('\n').map(r => r.trim()).filter(Boolean)

    const itemData = {
      category_id: Number(payload.category_id || payload.categoryId),
      name: payload.name,
      description: payload.description,
      condition: payload.condition,
      price_per_day: Number(payload.price_per_day || payload.pricePerDay),
      deposit: Number(payload.deposit || 0),
      address: payload.address,
      latitude: payload.latitude || currentUser.latitude || DEFAULT_LOCATION.latitude,
      longitude: payload.longitude || currentUser.longitude || DEFAULT_LOCATION.longitude,
      image: imageUrl,
      images: [imageUrl],
      status: payload.status || 'tersedia',
      rules: rules.length ? rules : ['Gunakan barang dengan bertanggung jawab'],
    }

    let resultId
    if (item_id) {
      const { error } = await supabase.from('items').update(itemData).eq('id', item_id)
      if (error) throw new Error('Gagal memperbarui barang.')
      resultId = item_id
    } else {
      itemData.owner_id = currentUser.id
      itemData.slug = slugify(payload.name) + '-' + String(Date.now()).slice(-5)
      itemData.created_at = new Date().toISOString().slice(0, 10)
      
      const { data, error } = await supabase.from('items').insert(itemData).select().single()
      if (error) throw new Error('Gagal menyimpan barang.')
      resultId = data.id
    }

    await fetchDatabase()
    return resultId
  }

  const deleteItem = async (item_id) => {
    if (!currentUser) throw new Error('Silakan login terlebih dahulu.')
    const { error } = await supabase.from('items').delete().eq('id', item_id)
    if (error) throw new Error('Gagal menghapus barang.')
    await fetchDatabase()
  }

  const toggleFavorite = async (item_id) => {
    if (!currentUser) throw new Error('Silakan login untuk menyimpan barang.')
    
    const exists = db.favorites.find((entry) => entry.user_id === currentUser.id && entry.item_id === Number(item_id))
    
    if (exists) {
      await supabase.from('favorites').delete().eq('id', exists.id)
    } else {
      await supabase.from('favorites').insert({ user_id: currentUser.id, item_id: Number(item_id) })
    }
    await fetchDatabase()
  }

  // --- RENTALS ---
  const createRental = async ({ item_id, start_date, end_date, note }) => {
    if (!currentUser) throw new Error('Silakan login terlebih dahulu.')
    
    const item = db.items.find((entry) => entry.id === Number(item_id))
    if (!item) throw new Error('Barang tidak ditemukan.')
    if (item.owner_id === currentUser.id) throw new Error('Anda tidak dapat menyewa barang milik sendiri.')

    const days = daysBetween(start_date, end_date)
    const rentalData = {
      item_id: item.id,
      renter_id: currentUser.id,
      start_date: start_date,
      end_date: end_date,
      days,
      subtotal: days * item.price_per_day,
      deposit: item.deposit,
      total: (days * item.price_per_day) + item.deposit,
      status: 'menunggu',
      payment_status: 'belum_dibayar',
      pickup_status: 'belum_diambil',
      return_status: 'belum_dikembalikan',
      note,
      created_at: new Date().toISOString().slice(0, 10),
    }

    const { data: rental, error } = await supabase.from('rentals').insert(rentalData).select().single()
    if (error) throw new Error('Gagal membuat pesanan.')

    // Kirim notifikasi ke pemilik
    await supabase.from('notifications').insert({
      user_id: item.owner_id,
      title: 'Permintaan sewa baru',
      message: `${currentUser.name} ingin menyewa ${item.name}.`,
      type: 'rental',
      created_at: new Date().toISOString()
    })

    await fetchDatabase()
    return rental
  }

  const updateRental = async (rental_id, changes) => {
    const { error } = await supabase.from('rentals').update(changes).eq('id', rental_id)
    if (error) throw new Error('Gagal memperbarui status sewa.')
    await fetchDatabase()
  }

  const addReview = async (reviewPayload) => {
    if (!currentUser) throw new Error('Silakan login terlebih dahulu.')
    const payload = {
      rental_id: reviewPayload.rental_id,
      author_id: currentUser.id,
      target_user_id: reviewPayload.target_user_id,
      item_id: reviewPayload.item_id,
      rating: reviewPayload.rating,
      comment: reviewPayload.comment,
      created_at: new Date().toISOString().slice(0, 10)
    }
    
    const { error } = await supabase.from('reviews').insert(payload)
    if (error) throw new Error('Gagal mengirim ulasan.')
    await fetchDatabase()
  }

  // --- MISC ---
  const updateProfile = async (changes) => {
    if (!currentUser) throw new Error('Silakan login terlebih dahulu.')
    const { error } = await supabase.from('users').update(changes).eq('id', currentUser.id)
    if (error) throw new Error('Gagal memperbarui profil.')
    await fetchDatabase()
  }

  const markNotificationRead = async (id) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id)
    await fetchDatabase()
  }

  const markAllRead = async () => {
    if (!currentUser) return
    await supabase.from('notifications').update({ read: true }).eq('user_id', currentUser.id)
    await fetchDatabase()
  }

  const value = useMemo(() => ({
    db, currentUser, loading, 
    login, register, logout, 
    saveItem, deleteItem, toggleFavorite, 
    createRental, updateRental, addReview, 
    updateProfile, markNotificationRead, markAllRead,
    refreshData: fetchDatabase // Method tambahan jika sewaktu-waktu ingin refresh manual
  }), [db, currentUser, loading])

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export const useDemo = () => useContext(DemoContext)