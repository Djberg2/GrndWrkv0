"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Calendar, Phone, Mail, MoreHorizontal, ImageIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function LeadsTable() {
  const [leads] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@email.com",
      phone: "(555) 123-4567",
      service: "Landscaping Design",
      sqft: "2,500",
      estimate: "$2,450",
      status: "New",
      date: "2024-01-15",
      photos: 3,
      address: "123 Oak Street, Springfield",
    },
    {
      id: 2,
      name: "Mike Chen",
      email: "mike@email.com",
      phone: "(555) 234-5678",
      service: "Lawn Mowing",
      sqft: "1,200",
      estimate: "$85",
      status: "Scheduled",
      date: "2024-01-14",
      photos: 2,
      address: "456 Pine Avenue, Springfield",
    },
    {
      id: 3,
      name: "Emily Davis",
      email: "emily@email.com",
      phone: "(555) 345-6789",
      service: "Tree Removal",
      sqft: "800",
      estimate: "$1,200",
      status: "Contacted",
      date: "2024-01-13",
      photos: 4,
      address: "789 Maple Drive, Springfield",
    },
    {
      id: 4,
      name: "Robert Wilson",
      email: "robert@email.com",
      phone: "(555) 456-7890",
      service: "Hardscaping",
      sqft: "3,200",
      estimate: "$3,800",
      status: "Quote Sent",
      date: "2024-01-12",
      photos: 6,
      address: "321 Elm Street, Springfield",
    },
    {
      id: 5,
      name: "Lisa Anderson",
      email: "lisa@email.com",
      phone: "(555) 567-8901",
      service: "Garden Design",
      sqft: "1,800",
      estimate: "$1,650",
      status: "New",
      date: "2024-01-11",
      photos: 5,
      address: "654 Cedar Lane, Springfield",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-800"
      case "Scheduled":
        return "bg-green-100 text-green-800"
      case "Contacted":
        return "bg-yellow-100 text-yellow-800"
      case "Quote Sent":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Estimate</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        {lead.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{lead.name}</div>
                      <div className="text-sm text-gray-500">{lead.email}</div>
                      <div className="text-sm text-gray-500">{lead.phone}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{lead.service}</div>
                    <div className="text-sm text-gray-500">{lead.sqft} sq ft</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="flex items-center space-x-1 mb-1">
                      <ImageIcon className="w-3 h-3" />
                      <span>{lead.photos} photos</span>
                    </div>
                    <div className="text-gray-500 max-w-48 truncate">{lead.address}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-semibold">{lead.estimate}</div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{new Date(lead.date).toLocaleDateString()}</div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Calendar className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Mail className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Schedule Quote</DropdownMenuItem>
                        <DropdownMenuItem>Send Email</DropdownMenuItem>
                        <DropdownMenuItem>Mark as Contacted</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
