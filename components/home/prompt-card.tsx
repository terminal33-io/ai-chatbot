import Image from 'next/image'

export default function PromptCard({
  text,
  onClick,
  imageUrl
}: {
  text?: string
  onClick?: () => void
  imageUrl?: string
}) {
  return (
    <div
      className="rounded-2xl border border-gray-200 flex space-x-2 p-2 bg-white shadow-sm hover:shadow-md transition cursor-pointer"
      onClick={onClick}
    >
      {/* Image */}
      <div className="shrink-0">
        <Image
          alt="content image"
          src={imageUrl || ''}
          height={80}
          width={80}
          className="rounded-lg object-cover"
        />
      </div>

      {/* Text */}
      <p className="text-base text-gray-800 p-4">{text}</p>
    </div>
  )
}
