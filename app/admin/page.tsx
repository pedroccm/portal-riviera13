'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Building, TrendingUp, Calendar, Lock, Eye, EyeOff, Upload, X, Image, Edit, Trash2, Plus, List, Info } from 'lucide-react'
import { Classified, Property, Event, Info as InfoType, CLASSIFIED_CATEGORIES, PROPERTY_TYPES, PROPERTY_SUBTYPES, INFO_CATEGORIES } from '@/types/database'

const ADMIN_PASSWORD = 'q1w2e3r4t5'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState('imoveis')
  const [viewMode, setViewMode] = useState<'create' | 'list'>('create')
  const [editingItem, setEditingItem] = useState<any>(null)
  
  // Data lists
  const [properties, setProperties] = useState<Property[]>([])
  const [classifieds, setClassifieds] = useState<Classified[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [infos, setInfos] = useState<InfoType[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Property form state
  const [propertyForm, setPropertyForm] = useState({
    title: '',
    description: '',
    type: 'RENT',
    property_subtype: 'APARTMENT',
    price: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    contact_name: '',
    contact_phone: '',
    instagram: '',
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
    instagram: '',
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

  // Info form state
  const [infoForm, setInfoForm] = useState({
    title: '',
    description: '',
    detailed_description: '',
    category: 'RIVIERA',
    phone: '',
    address: '',
    location: '',
    observations: '',
    website: '',
    email: '',
    color: '#0066cc',
    icon: ''
  })
  const [infoImages, setInfoImages] = useState<File[]>([])
  const [infoImagePreviews, setInfoImagePreviews] = useState<string[]>([])
  const [infoHours, setInfoHours] = useState<Record<string, string>>({
    monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: ''
  })
  const [infoServices, setInfoServices] = useState<string[]>([''])

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated])

  const fetchData = async () => {
    try {
      const [propertiesRes, classifiedsRes, eventsRes, infosRes] = await Promise.all([
        supabase.from('properties').select('*').order('created_at', { ascending: false }),
        supabase.from('classifieds').select('*').order('created_at', { ascending: false }),
        supabase.from('events').select('*').order('created_at', { ascending: false }),
        supabase.from('infos').select('*').order('created_at', { ascending: false })
      ])
      
      if (propertiesRes.data) setProperties(propertiesRes.data)
      if (classifiedsRes.data) setClassifieds(classifiedsRes.data)
      if (eventsRes.data) setEvents(eventsRes.data)
      if (infosRes.data) setInfos(infosRes.data)
    } catch (err) {
      showMessage('Erro ao carregar dados: ' + (err as Error).message, true)
    }
  }

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

  const handleImageSelect = (files: FileList | null, type: 'property' | 'classified' | 'event' | 'info') => {
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
          } else if (type === 'info') {
            setInfoImages(prev => [...prev, ...fileArray])
            setInfoImagePreviews(prev => [...prev, ...previews])
          }
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number, type: 'property' | 'classified' | 'event' | 'info') => {
    if (type === 'property') {
      setPropertyImages(prev => prev.filter((_, i) => i !== index))
      setPropertyImagePreviews(prev => prev.filter((_, i) => i !== index))
    } else if (type === 'classified') {
      setClassifiedImages(prev => prev.filter((_, i) => i !== index))
      setClassifiedImagePreviews(prev => prev.filter((_, i) => i !== index))
    } else if (type === 'event') {
      setEventImages(prev => prev.filter((_, i) => i !== index))
      setEventImagePreviews(prev => prev.filter((_, i) => i !== index))
    } else if (type === 'info') {
      setInfoImages(prev => prev.filter((_, i) => i !== index))
      setInfoImagePreviews(prev => prev.filter((_, i) => i !== index))
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

  const handleDrop = (e: React.DragEvent, type: 'property' | 'classified' | 'event' | 'info') => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleImageSelect(files, type)
    }
  }

  const handleDelete = async (id: string, type: 'property' | 'classified' | 'event' | 'info') => {
    if (!confirm('Tem certeza que deseja excluir este item?')) return
    
    setLoading(true)
    try {
      let table = ''
      if (type === 'property') table = 'properties'
      else if (type === 'classified') table = 'classifieds'  
      else if (type === 'event') table = 'events'
      else table = 'infos'
      
      const { error } = await supabase.from(table).delete().eq('id', id)
      if (error) throw error
      
      showMessage('Item excluído com sucesso!')
      fetchData()
    } catch (err) {
      showMessage('Erro ao excluir: ' + (err as Error).message, true)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  // Load item for editing
  useEffect(() => {
    if (editingItem) {
      if (activeTab === 'imoveis') {
        setPropertyForm({
          title: editingItem.title || '',
          description: editingItem.description || '',
          type: editingItem.type || 'RENT',
          property_subtype: editingItem.property_subtype || 'APARTMENT',
          price: editingItem.price?.toString() || '',
          bedrooms: editingItem.bedrooms?.toString() || '',
          bathrooms: editingItem.bathrooms?.toString() || '',
          area: editingItem.area?.toString() || '',
          contact_name: editingItem.contact_name || '',
          contact_phone: editingItem.contact_phone || '',
          instagram: editingItem.instagram || '',
          apartment: editingItem.apartment || '',
          block: editingItem.block || ''
        })
      } else if (activeTab === 'classificados') {
        setClassifiedForm({
          title: editingItem.title || '',
          description: editingItem.description || '',
          category: editingItem.category || 'GERAL',
          price: editingItem.price?.toString() || '',
          contact_name: editingItem.contact_name || '',
          contact_phone: editingItem.contact_phone || '',
          instagram: editingItem.instagram || '',
          apartment: editingItem.apartment || '',
          block: editingItem.block || ''
        })
      } else if (activeTab === 'eventos') {
        const eventDate = editingItem.event_date ? new Date(editingItem.event_date).toISOString().slice(0, 16) : ''
        setEventForm({
          title: editingItem.title || '',
          description: editingItem.description || '',
          event_date: eventDate,
          location: editingItem.location || '',
          max_guests: editingItem.max_guests?.toString() || '',
          contact_name: editingItem.contact_name || '',
          contact_phone: editingItem.contact_phone || ''
        })
      } else if (activeTab === 'informacoes') {
        setInfoForm({
          title: editingItem.title || '',
          description: editingItem.description || '',
          detailed_description: editingItem.detailed_description || '',
          category: editingItem.category || 'RIVIERA',
          phone: editingItem.phone || '',
          address: editingItem.address || '',
          location: editingItem.location || '',
          observations: editingItem.observations || '',
          website: editingItem.website || '',
          email: editingItem.email || '',
          color: editingItem.color || '#0066cc',
          icon: editingItem.icon || ''
        })
        setInfoHours(editingItem.hours || {
          monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: ''
        })
        setInfoServices(editingItem.services || [''])
      }
    }
  }, [editingItem, activeTab])

  const handlePropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      let imageUrls: string[] = editingItem?.images || []
      
      if (propertyImages.length > 0) {
        const newImages = await uploadImages(propertyImages, 'properties')
        imageUrls = [...imageUrls, ...newImages]
      }
      
      const data = {
        title: propertyForm.title,
        description: propertyForm.description,
        type: propertyForm.type,
        property_subtype: propertyForm.property_subtype,
        price: parseFloat(propertyForm.price),
        bedrooms: parseInt(propertyForm.bedrooms),
        bathrooms: parseInt(propertyForm.bathrooms),
        area: propertyForm.area ? parseFloat(propertyForm.area) : null,
        images: imageUrls,
        contact_name: propertyForm.contact_name,
        contact_phone: propertyForm.contact_phone || null,
        instagram: propertyForm.instagram || null,
        apartment: propertyForm.apartment || null,
        block: propertyForm.block || null
      }

      let error
      if (editingItem) {
        const result = await supabase.from('properties').update(data).eq('id', editingItem.id)
        error = result.error
      } else {
        const result = await supabase.from('properties').insert(data)
        error = result.error
      }

      if (error) throw error
      
      showMessage(editingItem ? 'Imóvel atualizado com sucesso!' : 'Imóvel cadastrado com sucesso!')
      setPropertyForm({
        title: '', description: '', type: 'RENT', property_subtype: 'APARTMENT', price: '', bedrooms: '', bathrooms: '',
        area: '', contact_name: '', contact_phone: '', instagram: '', apartment: '', block: ''
      })
      setPropertyImages([])
      setPropertyImagePreviews([])
      setEditingItem(null)
      fetchData() // Refresh data
    } catch (err) {
      showMessage('Erro ao salvar imóvel: ' + (err as Error).message, true)
    } finally {
      setLoading(false)
    }
  }

  const handleClassifiedSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      let imageUrls: string[] = editingItem?.images || []
      
      if (classifiedImages.length > 0) {
        const newImages = await uploadImages(classifiedImages, 'classifieds')
        imageUrls = [...imageUrls, ...newImages]
      }
      
      const data = {
        title: classifiedForm.title,
        description: classifiedForm.description,
        category: classifiedForm.category,
        price: classifiedForm.price ? parseFloat(classifiedForm.price) : null,
        images: imageUrls,
        contact_name: classifiedForm.contact_name,
        contact_phone: classifiedForm.contact_phone || null,
        instagram: classifiedForm.instagram || null,
        apartment: classifiedForm.apartment || null,
        block: classifiedForm.block || null
      }

      let error
      if (editingItem) {
        const result = await supabase.from('classifieds').update(data).eq('id', editingItem.id)
        error = result.error
      } else {
        const result = await supabase.from('classifieds').insert(data)
        error = result.error
      }

      if (error) throw error
      
      showMessage(editingItem ? 'Classificado atualizado com sucesso!' : 'Classificado cadastrado com sucesso!')
      setClassifiedForm({
        title: '', description: '', category: 'GERAL', price: '',
        contact_name: '', contact_phone: '', instagram: '', apartment: '', block: ''
      })
      setClassifiedImages([])
      setClassifiedImagePreviews([])
      setEditingItem(null)
      fetchData() // Refresh data
    } catch (err) {
      showMessage('Erro ao salvar classificado: ' + (err as Error).message, true)
    } finally {
      setLoading(false)
    }
  }

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      let imageUrls: string[] = editingItem?.images || []
      
      if (eventImages.length > 0) {
        const newImages = await uploadImages(eventImages, 'events')
        imageUrls = [...imageUrls, ...newImages]
      }
      
      const data = {
        title: eventForm.title,
        description: eventForm.description,
        event_date: eventForm.event_date,
        location: eventForm.location || null,
        images: imageUrls,
        max_guests: eventForm.max_guests ? parseInt(eventForm.max_guests) : null,
        contact_name: eventForm.contact_name,
        contact_phone: eventForm.contact_phone || null
      }

      let error
      if (editingItem) {
        const result = await supabase.from('events').update(data).eq('id', editingItem.id)
        error = result.error
      } else {
        const result = await supabase.from('events').insert(data)
        error = result.error
      }

      if (error) throw error
      
      showMessage(editingItem ? 'Evento atualizado com sucesso!' : 'Evento cadastrado com sucesso!')
      setEventForm({
        title: '', description: '', event_date: '', location: '',
        max_guests: '', contact_name: '', contact_phone: ''
      })
      setEventImages([])
      setEventImagePreviews([])
      setEditingItem(null)
      fetchData() // Refresh data
    } catch (err) {
      showMessage('Erro ao salvar evento: ' + (err as Error).message, true)
    } finally {
      setLoading(false)
    }
  }

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      let imageUrls: string[] = editingItem?.images || []
      
      if (infoImages.length > 0) {
        const newImages = await uploadImages(infoImages, 'infos')
        imageUrls = [...imageUrls, ...newImages]
      }
      
      const data = {
        title: infoForm.title,
        description: infoForm.description,
        detailed_description: infoForm.detailed_description || null,
        category: infoForm.category,
        phone: infoForm.phone || null,
        address: infoForm.address || null,
        location: infoForm.location || null,
        hours: Object.keys(infoHours).some(key => infoHours[key]) ? infoHours : null,
        services: infoServices.filter(s => s.trim()).length > 0 ? infoServices.filter(s => s.trim()) : null,
        observations: infoForm.observations || null,
        website: infoForm.website || null,
        email: infoForm.email || null,
        images: imageUrls,
        color: infoForm.color || null,
        icon: infoForm.icon || null
      }

      let error
      if (editingItem) {
        const result = await supabase.from('infos').update(data).eq('id', editingItem.id)
        error = result.error
      } else {
        const result = await supabase.from('infos').insert(data)
        error = result.error
      }

      if (error) throw error
      
      showMessage(editingItem ? 'Informação atualizada com sucesso!' : 'Informação cadastrada com sucesso!')
      setInfoForm({
        title: '', description: '', detailed_description: '', category: 'RIVIERA',
        phone: '', address: '', location: '', observations: '', website: '', email: '', color: '#0066cc', icon: ''
      })
      setInfoHours({ monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '' })
      setInfoServices([''])
      setInfoImages([])
      setInfoImagePreviews([])
      setEditingItem(null)
      fetchData() // Refresh data
    } catch (err) {
      showMessage('Erro ao salvar informação: ' + (err as Error).message, true)
    } finally {
      setLoading(false)
    }
  }

  const addService = () => {
    setInfoServices([...infoServices, ''])
  }

  const removeService = (index: number) => {
    setInfoServices(infoServices.filter((_, i) => i !== index))
  }

  const updateService = (index: number, value: string) => {
    const updated = [...infoServices]
    updated[index] = value
    setInfoServices(updated)
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
          <button
            onClick={() => setActiveTab('informacoes')}
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === 'informacoes'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Info className="mx-auto mb-1" size={20} />
            Informações
          </button>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
        <div className="flex gap-2">
          <button
            onClick={() => { setViewMode('create'); setEditingItem(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
              viewMode === 'create'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Plus size={16} />
            Criar Novo
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <List size={16} />
            Listar Existentes
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

        {/* Property Content */}
        {activeTab === 'imoveis' && viewMode === 'list' && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Imóveis Cadastrados ({properties.length})</h2>
            <div className="space-y-4">
              {properties.map(item => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.type === 'RENT' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {PROPERTY_TYPES[item.type]}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {item.status === 'AVAILABLE' ? 'Disponível' : 'Indisponível'}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>R$ {item.price.toLocaleString()}</span>
                        <span>{item.bedrooms}q • {item.bathrooms}b</span>
                        {item.area && <span>{item.area}m²</span>}
                        <span>Por: {item.contact_name}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Criado em: {formatDate(item.created_at)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => { setEditingItem(item); setViewMode('create'); }}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, 'property')}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {properties.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhum imóvel cadastrado ainda
                </div>
              )}
            </div>
          </div>
        )}

        {/* Property Form */}
        {activeTab === 'imoveis' && viewMode === 'create' && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-6">
              {editingItem ? 'Editar Imóvel' : 'Cadastrar Imóvel'}
            </h2>
            {editingItem && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  📝 Editando: <strong>{editingItem.title}</strong>
                </p>
              </div>
            )}
            <form onSubmit={handlePropertySubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <select
                  value={propertyForm.property_subtype}
                  onChange={(e) => setPropertyForm({...propertyForm, property_subtype: e.target.value as 'HOUSE' | 'LAND' | 'APARTMENT'})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="APARTMENT">Apartamento</option>
                  <option value="HOUSE">Casa</option>
                  <option value="LAND">Terreno</option>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <input
                  type="text"
                  placeholder="Instagram (@usuario)"
                  value={propertyForm.instagram}
                  onChange={(e) => setPropertyForm({...propertyForm, instagram: e.target.value})}
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

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Salvando...' : (editingItem ? 'Atualizar Imóvel' : 'Cadastrar Imóvel')}
                </button>
                {editingItem && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingItem(null)
                      setPropertyForm({
                        title: '', description: '', type: 'RENT', property_subtype: 'APARTMENT', price: '', bedrooms: '', bathrooms: '',
                        area: '', contact_name: '', contact_phone: '', instagram: '', apartment: '', block: ''
                      })
                      setPropertyImages([])
                      setPropertyImagePreviews([])
                    }}
                    className="px-6 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Classified Content */}
        {activeTab === 'classificados' && viewMode === 'list' && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Classificados Cadastrados ({classifieds.length})</h2>
            <div className="space-y-4">
              {classifieds.map(item => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                          {CLASSIFIED_CATEGORIES[item.category]}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {item.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                        </span>
                        {item.price && (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                            R$ {item.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Por: {item.contact_name}</span>
                        {item.apartment && <span>Apt {item.apartment}</span>}
                        {item.block && <span>{item.block}</span>}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Criado em: {formatDate(item.created_at)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => { setEditingItem(item); setViewMode('create'); }}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, 'classified')}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {classifieds.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhum classificado cadastrado ainda
                </div>
              )}
            </div>
          </div>
        )}

        {/* Classified Form */}
        {activeTab === 'classificados' && viewMode === 'create' && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-6">
              {editingItem ? 'Editar Classificado' : 'Cadastrar Classificado'}
            </h2>
            {editingItem && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  📝 Editando: <strong>{editingItem.title}</strong>
                </p>
              </div>
            )}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="tel"
                  placeholder="Telefone"
                  value={classifiedForm.contact_phone}
                  onChange={(e) => setClassifiedForm({...classifiedForm, contact_phone: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Instagram (@usuario)"
                  value={classifiedForm.instagram}
                  onChange={(e) => setClassifiedForm({...classifiedForm, instagram: e.target.value})}
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

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Salvando...' : (editingItem ? 'Atualizar Classificado' : 'Cadastrar Classificado')}
                </button>
                {editingItem && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingItem(null)
                      setClassifiedForm({
                        title: '', description: '', category: 'GERAL', price: '',
                        contact_name: '', contact_phone: '', instagram: '', apartment: '', block: ''
                      })
                      setClassifiedImages([])
                      setClassifiedImagePreviews([])
                    }}
                    className="px-6 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Event Content */}
        {activeTab === 'eventos' && viewMode === 'list' && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Eventos Cadastrados ({events.length})</h2>
            <div className="space-y-4">
              {events.map(item => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'UPCOMING' ? 'bg-blue-100 text-blue-700' :
                          item.status === 'ONGOING' ? 'bg-yellow-100 text-yellow-700' :
                          item.status === 'FINISHED' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {item.status === 'UPCOMING' ? 'Próximo' :
                           item.status === 'ONGOING' ? 'Em Andamento' :
                           item.status === 'FINISHED' ? 'Finalizado' : 'Cancelado'}
                        </span>
                        {item.max_guests && (
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                            Máx: {item.max_guests} pessoas
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>📅 {formatDate(item.event_date)}</span>
                        {item.location && <span>📍 {item.location}</span>}
                        <span>Por: {item.contact_name}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Criado em: {formatDate(item.created_at)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => { setEditingItem(item); setViewMode('create'); }}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, 'event')}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {events.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhum evento cadastrado ainda
                </div>
              )}
            </div>
          </div>
        )}

        {/* Event Form */}
        {activeTab === 'eventos' && viewMode === 'create' && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-6">
              {editingItem ? 'Editar Evento' : 'Cadastrar Evento'}
            </h2>
            {editingItem && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  📝 Editando: <strong>{editingItem.title}</strong>
                </p>
              </div>
            )}
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

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Salvando...' : (editingItem ? 'Atualizar Evento' : 'Cadastrar Evento')}
                </button>
                {editingItem && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingItem(null)
                      setEventForm({
                        title: '', description: '', event_date: '', location: '',
                        max_guests: '', contact_name: '', contact_phone: ''
                      })
                      setEventImages([])
                      setEventImagePreviews([])
                    }}
                    className="px-6 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Info Content */}
        {activeTab === 'informacoes' && viewMode === 'list' && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Informações Cadastradas ({infos.length})</h2>
            <div className="space-y-4">
              {infos.map(item => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                          {INFO_CATEGORIES[item.category]}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {item.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                        </span>
                        {item.color && (
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-300" 
                            style={{ backgroundColor: item.color }}
                          ></div>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {item.phone && <span>📞 {item.phone}</span>}
                        {item.address && <span>📍 {item.address}</span>}
                        {item.website && <span>🌐 {item.website}</span>}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Criado em: {formatDate(item.created_at)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => { setEditingItem(item); setViewMode('create'); }}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, 'info')}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {infos.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma informação cadastrada ainda
                </div>
              )}
            </div>
          </div>
        )}

        {/* Info Form */}
        {activeTab === 'informacoes' && viewMode === 'create' && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-6">
              {editingItem ? 'Editar Informação' : 'Cadastrar Informação'}
            </h2>
            {editingItem && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  📝 Editando: <strong>{editingItem.title}</strong>
                </p>
              </div>
            )}
            <form onSubmit={handleInfoSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Título"
                  value={infoForm.title}
                  onChange={(e) => setInfoForm({...infoForm, title: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                <select
                  value={infoForm.category}
                  onChange={(e) => setInfoForm({...infoForm, category: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="RIVIERA">Riviera</option>
                  <option value="HOSPITAIS">Hospitais</option>
                  <option value="SUPERMERCADOS">Supermercados</option>
                  <option value="RESTAURANTES">Restaurantes</option>
                  <option value="HOTEIS">Hotéis</option>
                </select>
              </div>

              <textarea
                placeholder="Descrição"
                value={infoForm.description}
                onChange={(e) => setInfoForm({...infoForm, description: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
              />

              <textarea
                placeholder="Descrição detalhada (opcional)"
                value={infoForm.detailed_description}
                onChange={(e) => setInfoForm({...infoForm, detailed_description: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={4}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="tel"
                  placeholder="Telefone"
                  value={infoForm.phone}
                  onChange={(e) => setInfoForm({...infoForm, phone: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={infoForm.email}
                  onChange={(e) => setInfoForm({...infoForm, email: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="url"
                  placeholder="Website"
                  value={infoForm.website}
                  onChange={(e) => setInfoForm({...infoForm, website: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Localização"
                  value={infoForm.location}
                  onChange={(e) => setInfoForm({...infoForm, location: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <input
                type="text"
                placeholder="Endereço"
                value={infoForm.address}
                onChange={(e) => setInfoForm({...infoForm, address: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cor do tema</label>
                  <input
                    type="color"
                    value={infoForm.color}
                    onChange={(e) => setInfoForm({...infoForm, color: e.target.value})}
                    className="w-full p-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Ícone (opcional)"
                  value={infoForm.icon}
                  onChange={(e) => setInfoForm({...infoForm, icon: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Horários */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Horários de funcionamento</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.entries({
                    monday: 'Segunda', tuesday: 'Terça', wednesday: 'Quarta',
                    thursday: 'Quinta', friday: 'Sexta', saturday: 'Sábado', sunday: 'Domingo'
                  }).map(([key, label]) => (
                    <div key={key} className="flex items-center gap-2">
                      <label className="text-sm text-gray-600 w-16">{label}:</label>
                      <input
                        type="text"
                        placeholder="08:00-18:00"
                        value={infoHours[key]}
                        onChange={(e) => setInfoHours({...infoHours, [key]: e.target.value})}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Serviços */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">Serviços oferecidos</label>
                  <button
                    type="button"
                    onClick={addService}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                  >
                    <Plus size={16} /> Adicionar
                  </button>
                </div>
                {infoServices.map((service, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Nome do serviço"
                      value={service}
                      onChange={(e) => updateService(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {infoServices.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeService(index)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <textarea
                placeholder="Observações adicionais"
                value={infoForm.observations}
                onChange={(e) => setInfoForm({...infoForm, observations: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
              />

              {/* Image Upload */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">Imagens</label>
                  <label className="cursor-pointer bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2">
                    <Upload size={16} />
                    Adicionar Imagens
                    <input
                      id="info-file-input"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageSelect(e.target.files, 'info')}
                      className="hidden"
                    />
                  </label>
                </div>
                
                {infoImagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {infoImagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index, 'info')}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {infoImagePreviews.length === 0 && (
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, 'info')}
                    onClick={() => document.getElementById('info-file-input')?.click()}
                  >
                    <Image className="mx-auto mb-2 text-gray-400" size={48} />
                    <p className="text-gray-500 mb-2">Arraste imagens aqui ou clique para selecionar</p>
                    <p className="text-gray-400 text-sm">Suporte para múltiplas imagens</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Salvando...' : (editingItem ? 'Atualizar Informação' : 'Cadastrar Informação')}
                </button>
                {editingItem && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingItem(null)
                      setInfoForm({
                        title: '', description: '', detailed_description: '', category: 'RIVIERA',
                        phone: '', address: '', location: '', observations: '', website: '', email: '', color: '#0066cc', icon: ''
                      })
                      setInfoHours({ monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '' })
                      setInfoServices([''])
                      setInfoImages([])
                      setInfoImagePreviews([])
                    }}
                    className="px-6 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  )
}