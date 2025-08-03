import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Classified, Property, Event } from '@/types/database'

export function useClassifieds() {
  const [classifieds, setClassifieds] = useState<Classified[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchClassifieds()
  }, [])

  const fetchClassifieds = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('classifieds')
        .select('*')
        .eq('status', 'ACTIVE')
        .order('created_at', { ascending: false })

      if (error) throw error
      setClassifieds(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar classificados')
    } finally {
      setLoading(false)
    }
  }

  return { classifieds, loading, error, refetch: fetchClassifieds }
}

export function useClassifiedsByCategory(category?: string) {
  const [classifieds, setClassifieds] = useState<Classified[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchClassifiedsByCategory()
  }, [category])

  const fetchClassifiedsByCategory = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('classifieds')
        .select('*')
        .eq('status', 'ACTIVE')

      if (category) {
        query = query.eq('category', category)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      setClassifieds(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar classificados')
    } finally {
      setLoading(false)
    }
  }

  return { classifieds, loading, error, refetch: fetchClassifiedsByCategory }
}

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'AVAILABLE')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProperties(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar imóveis')
    } finally {
      setLoading(false)
    }
  }

  return { properties, loading, error, refetch: fetchProperties }
}

export function usePropertiesByType(type?: 'RENT' | 'SALE') {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPropertiesByType()
  }, [type])

  const fetchPropertiesByType = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('properties')
        .select('*')
        .eq('status', 'AVAILABLE')

      if (type) {
        query = query.eq('type', type)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      setProperties(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar imóveis')
    } finally {
      setLoading(false)
    }
  }

  return { properties, loading, error, refetch: fetchPropertiesByType }
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .in('status', ['UPCOMING', 'ONGOING'])
        .order('event_date', { ascending: true })

      if (error) throw error
      setEvents(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar eventos')
    } finally {
      setLoading(false)
    }
  }

  return { events, loading, error, refetch: fetchEvents }
}