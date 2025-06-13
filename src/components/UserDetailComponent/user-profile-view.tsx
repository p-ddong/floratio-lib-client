"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { CloudImage } from "../Common/CloudImage"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Heart, Bookmark, Eye, Edit, Calendar, Settings } from "lucide-react"
import { MarkPlant } from "@/types/mark.types"
// import { getUserBookmarkedPlants, getUserFavoritePlants, getUserContributions } from "@/lib/user-data"
// import type { Plant, Contribution } from "@/lib/types"

import { useAppSelector, useAppDispatch } from "@/store"
import { Contribution } from "@/types"


export interface Plant {
  id: string
  scientificName: string
  commonName: string
  family: string
  image: string
  attributes: string[]
  careLevel: string
  contributor: string
  description: string
}



export function UserProfileView() {
  const [activeTab, setActiveTab] = useState("bookmarks")

    
  const dispatch = useAppDispatch()
//   const router   = useRouter();  
  const token = useAppSelector((state) => state.auth.token)
  const user = useAppSelector((state) => state.auth.user)
  const markList = useAppSelector((state) => state.mark.list)
  const contributionList = useAppSelector((state) => state.contribute.list)

  const userContributionList = contributionList.filter((c)=>c.c_user._id == user?._id)


  console.log('token:',token )
  console.log('user:',user)
  console.log('contribution:',contributionList)
  console.log('mark:',markList)


    useEffect(()=>{

    },[dispatch])


  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Please log in to view your profile</h2>
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    )
  }

  const avatarFallback = user?.username.charAt(0).toUpperCase()

  return (
    <div className="space-y-8 px-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {avatarFallback}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div>
                  <h1 className="text-3xl font-bold">{user?.username}</h1>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>
                {/* {userData.bio && <p className="text-sm">{userData.bio}</p>} */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {user?.createdAt && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {formatDistanceToNow(new Date(user?.createdAt), { addSuffix: true })}</span>
                    </div>
                  )}
                  {/* {userData.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{userData.location}</span>
                    </div>
                  )} */}
                </div>
              </div>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary">{markList.length}</div>
            <div className="text-sm text-muted-foreground">Bookmarked Plants</div>
          </CardContent>
        </Card>
        {/* <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-red-600">{favoritePlants.length}</div>
            <div className="text-sm text-muted-foreground">Favorite Plants</div>
          </CardContent>
        </Card> */}
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">{userContributionList.length}</div>
            <div className="text-sm text-muted-foreground">Contributions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {userContributionList.filter((c) => c.status === "approved").length}
            </div>
            <div className="text-sm text-muted-foreground">Approved</div>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="bookmarks" className="flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            Bookmarks ({markList.length})
          </TabsTrigger>
          <TabsTrigger value="contributions" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Contributions ({userContributionList.length})
          </TabsTrigger>
        </TabsList>

        {/* Bookmarked Plants Tab */}
        <TabsContent value="bookmarks" className="mt-6">
          {markList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {markList.map((mark) => (
                <PlantCard key={mark._id} plant={mark.plant} showBookmarkBadge />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Bookmark className="h-12 w-12" />}
              title="No bookmarked plants"
              description="Start bookmarking plants you want to remember!"
              actionLabel="Browse Plants"
              actionHref="/species"
            />
          )}
        </TabsContent>

        {/* Contributions Tab */}
        <TabsContent value="contributions" className="mt-6">
          {userContributionList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userContributionList.map((contribution) => (
                <ContributionCard key={contribution._id} contribution={contribution} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Edit className="h-12 w-12" />}
              title="No contributions yet"
              description="Share your plant knowledge with the community!"
              actionLabel="Create Contribution"
              actionHref="/contribute/new"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// UI cho PlantCard Mark
function PlantCard({
  plant,
  showBookmarkBadge = false,
  showFavoriteBadge = false,
}: {
  plant: MarkPlant
  showBookmarkBadge?: boolean
  showFavoriteBadge?: boolean
}) {
  return (
    <Link href={`/plants/${plant._id}`}>
      <Card className="overflow-hidden h-full transition-all hover:shadow-md">
        <div className="aspect-square relative">
          <CloudImage
            alt={plant.scientific_name }
            src={plant.image || "/placeholder.svg"}
            
            className="object-cover"
          />
          {showBookmarkBadge && (
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                <Bookmark className="h-3 w-3 mr-1 fill-current" />
                Bookmarked
              </Badge>
            </div>
          )}
          {showFavoriteBadge && (
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200">
                <Heart className="h-3 w-3 mr-1 fill-current" />
                Favorite
              </Badge>
            </div>
          )}
        </div>
        <CardHeader className="p-4 pb-2">
          <div>
            <h2 className="font-bold text-lg">{plant.scientific_name}</h2>
            <p className="text-sm text-muted-foreground italic">{plant.common_name[0] ? plant.common_name[0] : 'No common name yet' }</p>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex flex-wrap gap-2 mt-2">
            {plant.attributes.slice(0, 3).map((attribute) => (
              <Badge key={attribute._id} variant="outline" className="bg-primary/10">
                {attribute.name}
              </Badge>
            ))}
            {plant.attributes.length > 3 && (
              <Badge variant="outline" className="bg-primary/10">
                +{plant.attributes.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

// Component ContributionCard
function ContributionCard({ contribution }: { contribution: Contribution }) {
  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="relative h-48 w-full overflow-hidden">
        <CloudImage
          alt={contribution.data.plant.scientific_name}
          src={contribution.data.plant.images[0] || contribution.data.new_images[0]}
          
          className="object-cover"
          
        />
        <div className="absolute top-2 right-2">
          <StatusBadge status={contribution.status} />
        </div>
        {contribution.type && (
          <div className="absolute top-2 left-2">
            <Badge variant="outline" className="bg-background/80">
              {contribution.type === "create" ? "New Plant" : "Update"}
            </Badge>
          </div>
        )}
      </div>
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-lg font-bold italic">{contribution.data.plant.scientific_name}</CardTitle>
        <CardDescription>
          {contribution.data.plant.common_name.slice(0, 2).join(", ")}
          {contribution.data.plant.common_name.length > 2 && "..."}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-2 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">{contribution.data.plant.description}</p>
        <div className="flex flex-wrap gap-1 mt-3">
          {contribution.data.plant.attributes.slice(0, 3).map((attr, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {attr}
            </Badge>
          ))}
          {contribution.data.plant.attributes.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{contribution.data.plant.attributes.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      <div className="p-4 pt-0 flex justify-between items-center text-sm border-t mt-auto">
        <div className="text-muted-foreground">
          {formatDistanceToNow(new Date(contribution.createdAt), { addSuffix: true })}
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/contribute/${contribution._id}`} className="flex items-center">
            <Eye className="mr-1 h-4 w-4" />
            View
          </Link>
        </Button>
      </div>
    </Card>
  )
}

// Componet StatusBadge (UI cho contribute card)
function StatusBadge({ status }: { status: "pending" | "approved" | "rejected" }) {
  const variants = {
    pending: "bg-yellow-500/20 text-yellow-700 border-yellow-500/50",
    approved: "bg-green-500/20 text-green-700 border-green-500/50",
    rejected: "bg-red-500/20 text-red-700 border-red-500/50",
  }

  const labels = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
  }

  return (
    <Badge variant="outline" className={`${variants[status]} capitalize`}>
      {labels[status]}
    </Badge>
  )
}

// Component EmtyState (UI chung cho các state rỗng)
function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: React.ReactNode
  title: string
  description: string
  actionLabel: string
  actionHref: string
}) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto mb-4 text-muted-foreground">{icon}</div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>
      <Button asChild>
        <Link href={actionHref}>{actionLabel}</Link>
      </Button>
    </div>
  )
}
