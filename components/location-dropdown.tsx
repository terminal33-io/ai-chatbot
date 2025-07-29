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
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchLocations = async () => {
            if (!search) return

            const token = localStorage.getItem('accessToken')
            if (!token) {
                console.warn('No access token found')
                return
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
                    setLocations([]) // optional: clear on failure
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

        const timeout = setTimeout(fetchLocations, 300) // debounce input
        return () => clearTimeout(timeout)
    }, [search])


    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">Select Location</Button>
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
                            onClick={() => onSelect(location)}
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
