import { Suspense } from "react"
import { UserProfileView } from "../../components/UserDetailComponent/user-profile-view"
import { UserProfileSkeleton } from "../../components/UserDetailComponent/user-profile-skeleton"

export const metadata = {
  title: "User Profile | Plant Library",
  description: "View your profile, bookmarked plants, and contributions",
}

const UserDetail = () => {
  return (
    <div className="py-8">
      <Suspense fallback={<UserProfileSkeleton />}>
        <UserProfileView />
      </Suspense>
    </div>
  )
}

export default UserDetail