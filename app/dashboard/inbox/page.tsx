import { redirect } from "next/navigation"

export default function InboxRedirectPage() {
  redirect("/dashboard/leads")
}

