import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getMe, updateMe } from '../../api/users'
import { createLocation } from '../../api/locations'

export default function ProfilePage() {
  const [profile, setProfile] = useState({ username: '', email: '', phone_number: '' })
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingLocation, setSavingLocation] = useState(false)

  useEffect(() => {
    getMe()
      .then((res) => {
        setProfile({
          username: res.username || '',
          email: res.email || '',
          phone_number: res.phone_number || ''
        })
      })
      .catch((err) => toast.error('Failed to load profile'))
      .finally(() => setLoading(false))
  }, [])

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setSavingProfile(true)
    try {
      await updateMe(profile)
      toast.success('Profile updated successfully')
    } catch (err) {
      toast.error('Failed to update profile')
    } finally {
      setSavingProfile(false)
    }
  }

  const handleAddLocation = async (e) => {
    e.preventDefault()
    if (!address.trim()) return
    setSavingLocation(true)
    try {
      await createLocation({ address, is_default: false })
      toast.success('Address saved successfully')
      setAddress('')
    } catch (err) {
      toast.error('Failed to save address')
    } finally {
      setSavingLocation(false)
    }
  }

  if (loading) return <p className="text-center py-16 text-gray-400">Loading...</p>

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-extrabold text-sky-900 mb-4 border-b pb-2">Hồ Sơ Của Tôi</h2>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Username</label>
            <input
              className="w-full border rounded-lg px-4 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={profile.username}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input
              className="w-full border rounded-lg px-4 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
            <input
              className="w-full border rounded-lg px-4 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={profile.phone_number}
              onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
            />
          </div>
          <button
            type="submit"
            disabled={savingProfile}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold px-4 py-2 rounded-lg transition-colors"
          >
            {savingProfile ? 'Saving...' : 'Cập Nhật Hồ Sơ'}
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-extrabold text-sky-900 mb-4 border-b pb-2">Thêm Địa Chỉ Mới</h2>
        <form onSubmit={handleAddLocation} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Địa Chỉ</label>
            <textarea
              className="w-full border rounded-lg px-4 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              rows={3}
              placeholder="Nhập địa chỉ giao hàng của bạn..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={savingLocation}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-lg transition-colors"
          >
            {savingLocation ? 'Saving...' : 'Lưu Địa Chỉ'}
          </button>
        </form>
      </div>
    </div>
  )
}
