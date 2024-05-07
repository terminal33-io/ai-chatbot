'use client'

export default function Error({
  error
}: {
  error: Error & { digest?: string }
}) {
  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center py-10 ">
      <h2 className="text-2xl bg-red-400 rounded-sm p-12 ">Some error occured. Kindly contact the tech support!</h2>
    </div>
  )
}
