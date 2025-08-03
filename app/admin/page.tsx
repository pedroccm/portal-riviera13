'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Building, TrendingUp, Calendar, Lock, Eye, EyeOff, Upload, X, Image } from 'lucide-react'

const ADMIN_PASSWORD = 'q1w2e3r4t5'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState('imoveis')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Property form state
  const [propertyForm, setPropertyForm] = useState({
    title: '',
    description: '',
    type: 'RENT',
    price: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    contact_name: '',
    contact_phone: '',
    apartment: '',
    block: ''
  })
  const [propertyImages, setPropertyImages] = useState<File[]>([])
  const [propertyImagePreviews, setPropertyImagePreviews] = useState<string[]>([])

  // Classified form state
  const [classifiedForm, setClassifiedForm] = useState({
    title: '',
    description: '',
    category: 'GERAL',
    price: '',
    contact_name: '',
    contact_phone: '',
    apartment: '',
    block: ''
  })
  const [classifiedImages, setClassifiedImages] = useState<File[]>([])
  const [classifiedImagePreviews, setClassifiedImagePreviews] = useState<string[]>([])

  // Event form state
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    max_guests: '',
    contact_name: '',
    contact_phone: ''
  })
  const [eventImages, setEventImages] = useState<File[]>([])
  const [eventImagePreviews, setEventImagePreviews] = useState<string[]>([])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setMessage('')
    } else {
      setMessage('Senha incorreta!')
    }
  }

  const showMessage = (msg: string, isError = false) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  const uploadImages = async (files: File[], folder: string): Promise<string[]> => {
    const urls: string[] = []
    
    for (const file of files) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${folder}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file)

      if (uploadError) {
        throw new Error(`Erro ao fazer upload da imagem: ${uploadError.message}`)
      }

      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      urls.push(data.publicUrl)
    }
    
    return urls
  }

  const handleImageSelect = (files: FileList | null, type: 'property' | 'classified' | 'event') => {
    if (!files) return
    
    const fileArray = Array.from(files)
    const previews: string[] = []
    
    fileArray.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        previews.push(e.target?.result as string)
        if (previews.length === fileArray.length) {
          if (type === 'property') {
            setPropertyImages(prev => [...prev, ...fileArray])
            setPropertyImagePreviews(prev => [...prev, ...previews])
          } else if (type === 'classified') {
            setClassifiedImages(prev => [...prev, ...fileArray])
            setClassifiedImagePreviews(prev => [...prev, ...previews])
          } else if (type === 'event') {
            setEventImages(prev => [...prev, ...fileArray])
            setEventImagePreviews(prev => [...prev, ...previews])
          }
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number, type: 'property' | 'classified' | 'event') => {
    if (type === 'property') {
      setPropertyImages(prev => prev.filter((_, i) => i !== index))
      setPropertyImagePreviews(prev => prev.filter((_, i) => i !== index))
    } else if (type === 'classified') {
      setClassifiedImages(prev => prev.filter((_, i) => i !== index))
      setClassifiedImagePreviews(prev => prev.filter((_, i) => i !== index))
    } else if (type === 'event') {
      setEventImages(prev => prev.filter((_, i) => i !== index))
      setEventImagePreviews(prev => prev.filter((_, i) => i !== index))
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent, type: 'property' | 'classified' | 'event') => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleImageSelect(files, type)
    }
  }

  const handlePropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      let imageUrls: string[] = []
      
      if (propertyImages.length > 0) {
        imageUrls = await uploadImages(propertyImages, 'properties')
      }
      
      const { error } = await supabase.from('properties').insert({
        title: propertyForm.title,
        description: propertyForm.description,
        type: propertyForm.type,
        price: parseFloat(propertyForm.price),
        bedrooms: parseInt(propertyForm.bedrooms),
        bathrooms: parseInt(propertyForm.bathrooms),
        area: propertyForm.area ? parseFloat(propertyForm.area) : null,
        images: imageUrls,
        contact_name: propertyForm.contact_name,
        contact_phone: propertyForm.contact_phone || null,
        apartment: propertyForm.apartment || null,
        block: propertyForm.block || null
      })

      if (error) throw error
      
      showMessage('Imóvel cadastrado com sucesso!')
      setPropertyForm({
        title: '', description: '', type: 'RENT', price: '', bedrooms: '', bathrooms: '',
        area: '', contact_name: '', contact_phone: '', apartment: '', block: ''
      })
      setPropertyImages([])
      setPropertyImagePreviews([])
    } catch (err) {
      showMessage('Erro ao cadastrar imóvel: ' + (err as Error).message, true)
    } finally {
      setLoading(false)
    }
  }

  const handleClassifiedSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      let imageUrls: string[] = []
      
      if (classifiedImages.length > 0) {
        imageUrls = await uploadImages(classifiedImages, 'classifieds')
      }
      
      const { error } = await supabase.from('classifieds').insert({
        title: classifiedForm.title,
        description: classifiedForm.description,
        category: classifiedForm.category,
        price: classifiedForm.price ? parseFloat(classifiedForm.price) : null,
        images: imageUrls,
        contact_name: classifiedForm.contact_name,
        contact_phone: classifiedForm.contact_phone || null,
        apartment: classifiedForm.apartment || null,
        block: classifiedForm.block || null
      })

      if (error) throw error
      
      showMessage('Classificado cadastrado com sucesso!')
      setClassifiedForm({
        title: '', description: '', category: 'GERAL', price: '',
        contact_name: '', contact_phone: '', apartment: '', block: ''
      })
      setClassifiedImages([])
      setClassifiedImagePreviews([])
    } catch (err) {
      showMessage('Erro ao cadastrar classificado: ' + (err as Error).message, true)
    } finally {
      setLoading(false)
    }
  }

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      let imageUrls: string[] = []
      
      if (eventImages.length > 0) {
        imageUrls = await uploadImages(eventImages, 'events')
      }
      
      const { error } = await supabase.from('events').insert({
        title: eventForm.title,
        description: eventForm.description,
        event_date: eventForm.event_date,
        location: eventForm.location || null,
        images: imageUrls,
        max_guests: eventForm.max_guests ? parseInt(eventForm.max_guests) : null,
        contact_name: eventForm.contact_name,
        contact_phone: eventForm.contact_phone || null
      })

      if (error) throw error
      
      showMessage('Evento cadastrado com sucesso!')
      setEventForm({
        title: '', description: '', event_date: '', location: '',
        max_guests: '', contact_name: '', contact_phone: ''
      })
      setEventImages([])
      setEventImagePreviews([])
    } catch (err) {
      showMessage('Erro ao cadastrar evento: ' + (err as Error).message, true)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <Lock className="mx-auto mb-4 text-gray-400" size={48} />
              <h1 className="text-2xl font-bold text-gray-800">Área Restrita</h1>
              <p className="text-gray-600 mt-2">Digite a senha para acessar</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha de acesso"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {message && (
                <div className="text-red-500 text-sm text-center">{message}</div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Entrar
              </button>
            </form>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Painel Administrativo</h1>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('imoveis')}
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === 'imoveis'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Building className="mx-auto mb-1" size={20} />
            Imóveis
          </button>
          <button
            onClick={() => setActiveTab('classificados')}
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === 'classificados'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <TrendingUp className="mx-auto mb-1" size={20} />
            Classificados
          </button>
          <button
            onClick={() => setActiveTab('eventos')}
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === 'eventos'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Calendar className="mx-auto mb-1" size={20} />
            Eventos
          </button>
        </div>
      </div>

      <div className="px-4 py-6">
        {message && (
          <div className={`mb-4 p-4 rounded-lg ${
            message.includes('sucesso') 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}

        {/* Property Form */}
        {activeTab === 'imoveis' && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Cadastrar Imóvel</h2>
            <form onSubmit={handlePropertySubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Título"
                  value={propertyForm.title}
                  onChange={(e) => setPropertyForm({...propertyForm, title: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                <select
                  value={propertyForm.type}
                  onChange={(e) => setPropertyForm({...propertyForm, type: e.target.value as 'RENT' | 'SALE'})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="RENT">Aluguel</option>
                  <option value="SALE">Venda</option>
                </select>
              </div>

              <textarea
                placeholder="Descrição"
                value={propertyForm.description}
                onChange={(e) => setPropertyForm({...propertyForm, description: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
              />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <input
                  type="number"
                  placeholder="Preço"
                  value={propertyForm.price}
                  onChange={(e) => setPropertyForm({...propertyForm, price: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Quartos"
                  value={propertyForm.bedrooms}
                  onChange={(e) => setPropertyForm({...propertyForm, bedrooms: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Banheiros"
                  value={propertyForm.bathrooms}
                  onChange={(e) => setPropertyForm({...propertyForm, bathrooms: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Área (m²)"
                  value={propertyForm.area}
                  onChange={(e) => setPropertyForm({...propertyForm, area: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nome do contato"
                  value={propertyForm.contact_name}
                  onChange={(e) => setPropertyForm({...propertyForm, contact_name: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="tel"
                  placeholder="Telefone"
                  value={propertyForm.contact_phone}
                  onChange={(e) => setPropertyForm({...propertyForm, contact_phone: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Apartamento"
                  value={propertyForm.apartment}
                  onChange={(e) => setPropertyForm({...propertyForm, apartment: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Bloco"
                  value={propertyForm.block}
                  onChange={(e) => setPropertyForm({...propertyForm, block: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">Imagens</label>
                  <label className="cursor-pointer bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2">
                    <Upload size={16} />
                    Adicionar Imagens
                    <input
                      id="property-file-input"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageSelect(e.target.files, 'property')}
                      className="hidden"
                    />
                  </label>
                </div>
                
                {propertyImagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {propertyImagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index, 'property')}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {propertyImagePreviews.length === 0 && (
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, 'property')}
                    onClick={() => document.getElementById('property-file-input')?.click()}
                  >
                    <Image className="mx-auto mb-2 text-gray-400" size={48} />
                    <p className="text-gray-500 mb-2">Arraste imagens aqui ou clique para selecionar</p>
                    <p className="text-gray-400 text-sm">Suporte para múltiplas imagens</p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Cadastrando...' : 'Cadastrar Imóvel'}
              </button>
            </form>
          </div>
        )}

        {/* Classified Form */}
        {activeTab === 'classificados' && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Cadastrar Classificado</h2>
            <form onSubmit={handleClassifiedSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Título"
                  value={classifiedForm.title}
                  onChange={(e) => setClassifiedForm({...classifiedForm, title: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                <select
                  value={classifiedForm.category}
                  onChange={(e) => setClassifiedForm({...classifiedForm, category: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="IFOOD">iFood</option>
                  <option value="ELETRICA">Elétrica</option>
                  <option value="PISCINA">Piscina</option>
                  <option value="GERAL">Geral</option>
                  <option value="AR_CONDICIONADO">Ar Condicionado</option>
                  <option value="JARDIM">Jardim</option>
                  <option value="JET_QUADRI">Jet/Quadri</option>
                </select>
              </div>

              <textarea
                placeholder="Descrição"
                value={classifiedForm.description}
                onChange={(e) => setClassifiedForm({...classifiedForm, description: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="number"
                  placeholder="Preço (opcional)"
                  value={classifiedForm.price}
                  onChange={(e) => setClassifiedForm({...classifiedForm, price: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Nome do contato"
                  value={classifiedForm.contact_name}
                  onChange={(e) => setClassifiedForm({...classifiedForm, contact_name: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="tel"
                  placeholder="Telefone"
                  value={classifiedForm.contact_phone}
                  onChange={(e) => setClassifiedForm({...classifiedForm, contact_phone: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Apartamento"
                  value={classifiedForm.apartment}
                  onChange={(e) => setClassifiedForm({...classifiedForm, apartment: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Bloco"
                  value={classifiedForm.block}
                  onChange={(e) => setClassifiedForm({...classifiedForm, block: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">Imagens</label>
                  <label className="cursor-pointer bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2">
                    <Upload size={16} />
                    Adicionar Imagens
                    <input
                      id="classified-file-input"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageSelect(e.target.files, 'classified')}
                      className="hidden"
                    />
                  </label>
                </div>
                
                {classifiedImagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {classifiedImagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index, 'classified')}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {classifiedImagePreviews.length === 0 && (
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, 'classified')}
                    onClick={() => document.getElementById('classified-file-input')?.click()}
                  >
                    <Image className="mx-auto mb-2 text-gray-400" size={48} />
                    <p className="text-gray-500 mb-2">Arraste imagens aqui ou clique para selecionar</p>
                    <p className="text-gray-400 text-sm">Suporte para múltiplas imagens</p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Cadastrando...' : 'Cadastrar Classificado'}
              </button>
            </form>
          </div>
        )}

        {/* Event Form */}
        {activeTab === 'eventos' && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Cadastrar Evento</h2>
            <form onSubmit={handleEventSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Título do evento"
                value={eventForm.title}
                onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />

              <textarea
                placeholder="Descrição do evento"
                value={eventForm.description}
                onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="datetime-local"
                  placeholder="Data e hora do evento"
                  value={eventForm.event_date}
                  onChange={(e) => setEventForm({...eventForm, event_date: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Local do evento"
                  value={eventForm.location}
                  onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="number"
                  placeholder="Máximo de convidados"
                  value={eventForm.max_guests}
                  onChange={(e) => setEventForm({...eventForm, max_guests: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Nome do contato"
                  value={eventForm.contact_name}
                  onChange={(e) => setEventForm({...eventForm, contact_name: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="tel"
                  placeholder="Telefone"
                  value={eventForm.contact_phone}
                  onChange={(e) => setEventForm({...eventForm, contact_phone: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">Imagens</label>
                  <label className="cursor-pointer bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2">
                    <Upload size={16} />
                    Adicionar Imagens
                    <input
                      id="event-file-input"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageSelect(e.target.files, 'event')}
                      className="hidden"
                    />
                  </label>
                </div>
                
                {eventImagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {eventImagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index, 'event')}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {eventImagePreviews.length === 0 && (
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, 'event')}
                    onClick={() => document.getElementById('event-file-input')?.click()}
                  >
                    <Image className="mx-auto mb-2 text-gray-400" size={48} />
                    <p className="text-gray-500 mb-2">Arraste imagens aqui ou clique para selecionar</p>
                    <p className="text-gray-400 text-sm">Suporte para múltiplas imagens</p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Cadastrando...' : 'Cadastrar Evento'}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  )
}