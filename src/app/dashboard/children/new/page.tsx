import { ChildProfileForm } from '@/components/children/ChildProfileForm'

export default function NewChildPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add a child</h1>
        <p className="text-gray-500">
          Fill in the profile details to enable personalized AI learning plans
        </p>
      </div>
      <ChildProfileForm />
    </div>
  )
}
