'use client'

import { LocationSelector } from "./location-dropdown";



export default function ClientLocationSelector({
    onSelect
}: {
    onSelect: (location: { id: number; name: string }) => void
}) {
    return <LocationSelector onSelect={onSelect} />
}
