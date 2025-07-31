'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

interface Location {
    id: number
    name: string
}

export function LocationSelector({
    onSelect
}: {
    onSelect: (location: Location) => void
}) {
    const [search, setSearch] = useState('')
    const [locations, setLocations] = useState<Location[]>([])
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const stored = localStorage.getItem('selectedLocation')
        if (stored) {
            try {
                const parsed = JSON.parse(stored)
                setSelectedLocation(parsed)
            } catch (e) {
                console.warn('Failed to parse saved location:', e)
            }
        }
    }, [])

    useEffect(() => {
        const fetchLocations = async () => {
            if (!search) return

            const token = localStorage.getItem('accessToken')
            if (!token) {
                console.warn('No access token found')
            }

            setLoading(true)
            try {
                const res = await fetch('/api/location', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ keyword: search })
                })

                if (!res.ok) {
                    console.error('Failed to fetch locations:', res.status)
                    setLocations([])
                    return
                }

                const data = await res.json()
                setLocations(data)
            } catch (error) {
                console.error('Error fetching locations:', error)
                setLocations([])
            } finally {
                setLoading(false)
            }
        }

        const timeout = setTimeout(fetchLocations, 300)
        return () => clearTimeout(timeout)
    }, [search])

    const handleSelect = (location: Location) => {
        setSelectedLocation(location)
        localStorage.setItem('selectedLocation', JSON.stringify(location))
        onSelect(location)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    {selectedLocation ? `${selectedLocation.id} / ${selectedLocation.name}` : 'Select Location'}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64">
                <div className="px-2 py-2">
                    <Input
                        placeholder="Search location..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                {loading ? (
                    <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
                ) : locations.length > 0 ? (
                    locations.map((location) => (
                        <DropdownMenuItem
                            key={location.id}
                            onClick={() => handleSelect(location)}
                        >
                            {location.name}
                        </DropdownMenuItem>
                    ))
                ) : (
                    <DropdownMenuItem disabled>No results</DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
