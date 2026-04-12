// Re-exports of @clasing/ui components used throughout Sesame HR.
// Import from this file ONLY when you need multiple from the same module.
// Otherwise import directly: import { Button } from '@clasing/ui/button'
//
// NOTE: Always use per-component imports for tree-shaking.
// This file is a convenience reference, not a barrel.

export { Button } from '@clasing/ui/button'
export { Badge, badgeVariants } from '@clasing/ui/badge'
export { Input } from '@clasing/ui/input'
export { Textarea } from '@clasing/ui/textarea'
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from '@clasing/ui/card'
export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@clasing/ui/dialog'
export {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@clasing/ui/select'
export { Tabs, TabsList, TabsTrigger, TabsContent } from '@clasing/ui/tabs'
export { Alert, AlertTitle, AlertDescription } from '@clasing/ui/alert'
export { Tooltip, TooltipContent, TooltipTrigger } from '@clasing/ui/tooltip'
export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@clasing/ui/form'
export {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from '@clasing/ui/sidebar'
export { cn } from '@/lib/utils'
