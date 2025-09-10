"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { Package, Users, Gift, TrendingUp } from "lucide-react"
import { getProducts, getAssignments, getUsers, getAvailableQuantity } from "@/lib/supabase-functions"
import type { Product, Assignment, User } from "@/lib/types"

export function AdminStats() {
  const [products, setProducts] = useState<Product[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [productsData, assignmentsData, usersData] = await Promise.all([
          getProducts(),
          getAssignments(),
          getUsers(),
        ])
        setProducts(productsData)
        setAssignments(assignmentsData)
        setUsers(usersData)
      } catch (error) {
        console.error("Error fetching admin stats:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const stats = useMemo(() => {
    const totalProducts = products.length
    const totalUsers = users.filter((u) => !u.is_admin).length
    const totalAssignments = assignments.length

    const productsWithAssignments = products.filter((p) => assignments.some((a) => a.product_id === p.id)).length

    const usersWithAssignments = new Set(assignments.map((a) => a.user_id)).size

    const totalUnitsAssigned = assignments.reduce((total, a) => total + a.quantity_assigned, 0)

    const totalUnitsAvailable = products.reduce((total, p) => total + p.quantity, 0) - totalUnitsAssigned

    return {
      totalProducts,
      totalUsers,
      totalAssignments,
      productsWithAssignments,
      usersWithAssignments,
      totalUnitsAssigned,
      totalUnitsAvailable,
      percentageAssigned: totalProducts > 0 ? (productsWithAssignments / totalProducts) * 100 : 0,
    }
  }, [products, users, assignments])

  const popularProducts = useMemo(() => {
    const assignmentCounts = assignments.reduce(
      (acc, assignment) => {
        acc[assignment.product_id] = (acc[assignment.product_id] || 0) + assignment.quantity_assigned
        return acc
      },
      {} as Record<string, number>,
    )

    return products
      .map((product) => ({
        ...product,
        totalAssigned: assignmentCounts[product.id] || 0,
      }))
      .sort((a, b) => b.totalAssigned - a.totalAssigned)
      .slice(0, 5)
  }, [products, assignments])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="slide-in-up hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground float" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedCounter value={stats.totalProducts} />
            </div>
            <p className="text-xs text-muted-foreground">{stats.productsWithAssignments} with assignments</p>
          </CardContent>
        </Card>

        <Card className="slide-in-up hover-lift stagger-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground float" style={{ animationDelay: "0.5s" }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedCounter value={stats.totalUsers} />
            </div>
            <p className="text-xs text-muted-foreground">{stats.usersWithAssignments} with gifts</p>
          </CardContent>
        </Card>

        <Card className="slide-in-up hover-lift stagger-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground float" style={{ animationDelay: "1s" }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedCounter value={stats.totalAssignments} />
            </div>
            <p className="text-xs text-muted-foreground">
              <AnimatedCounter value={stats.totalUnitsAssigned} /> units
            </p>
          </CardContent>
        </Card>

        <Card className="slide-in-up hover-lift stagger-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground float" style={{ animationDelay: "1.5s" }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedCounter value={stats.totalUnitsAvailable} />
            </div>
            <p className="text-xs text-muted-foreground">
              <AnimatedCounter value={Math.round(stats.percentageAssigned * 10) / 10} />% assigned
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Popular Products */}
      <Card className="slide-in-up hover-lift stagger-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 float" />
            Most Popular Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          {popularProducts.length > 0 ? (
            <div className="space-y-4">
              {popularProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover-glow slide-in-right"
                  style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                >
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className="w-8 h-8 rounded-full p-0 flex items-center justify-center scale-in"
                    >
                      {index + 1}
                    </Badge>
                    <div>
                      <h4 className="font-medium">{product.name}</h4>
                      {product.description && <p className="text-sm text-muted-foreground">{product.description}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      <AnimatedCounter value={product.totalAssigned} />
                    </div>
                    <div className="text-xs text-muted-foreground">assigned</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground fade-in">No assignment data yet</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
