import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { CalendarIcon, PlusCircle, Loader2 } from "lucide-react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { format, setMinutes, setHours, isValid } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import type { Service } from "./service-list"
import { createMaintenanceApi } from "@/api/maintenanceApi"

interface NewServiceFormProps {
    services: Service[]
    onSuccess?: () => void
}

export function NewMaintenanceForm({ onSuccess, services }: NewServiceFormProps) {
    const [startDate, setStartDate] = React.useState<Date | undefined>(undefined)
    const [endDate, setEndDate] = React.useState<Date | undefined>(undefined)
    const [startTime, setStartTime] = React.useState<string>("")
    const [endTime, setEndTime] = React.useState<string>("")
    const [service, setService] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)
    const { toast } = useToast()

    const handleTimeChange = (type: "start" | "end", value: string) => {
        const [hour, minute] = value.split(":").map(Number)
        if (type === "start") {
            setStartTime(value)
            if (startDate) setStartDate(setMinutes(setHours(startDate, hour), minute))
        }
        if (type === "end") {
            setEndTime(value)
            if (endDate) setEndDate(setMinutes(setHours(endDate, hour), minute))
        }
    }

    const formatDateTimeForPostgres = (date: Date, time: string): string => {
        const [hours, minutes] = time.split(":").map(Number)
        const dateWithTime = setMinutes(setHours(date, hours), minutes)
        return format(dateWithTime, "yyyy-MM-dd'T'HH:mm:ssXXX")
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (startDate && endDate && startTime && endTime) {
            const formattedStartDate = formatDateTimeForPostgres(startDate, startTime)
            const formattedEndDate = formatDateTimeForPostgres(endDate, endTime)
            setIsLoading(true);
            try {
                const response = await createMaintenanceApi(parseInt(service), formattedStartDate, formattedEndDate);
                toast({
                    title: "Service Created",
                    description: response.message,
                    variant: "default",
                })
            } catch (error: any) {
                toast({
                    title: "Error",
                    description: error.response || "An error occurred",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false);
            }
            onSuccess?.()
        } else {
            console.error("Invalid form data")
        }
    }

    const isFormValid =
        service.trim() !== "" &&
        startDate !== undefined &&
        endDate !== undefined &&
        startTime !== "" &&
        endTime !== "" &&
        isValid(startDate) &&
        isValid(endDate)

    return (
        <>
            <h2 className="text-2xl font-semibold mb-4">Schedule Maintenance</h2>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-gray-200 space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <PlusCircle className="size-5 text-gray-900" />
                    Add New Maintenance
                </h2>
                <div>
                    <Select onValueChange={setService}>
                        <SelectTrigger className="border border-gray-500 rounded-md px-4 py-2 text-gray-800 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                            <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent className="border border-gray-500 rounded-md shadow-lg bg-white">
                            {services.map((item) => (
                                <SelectItem
                                    key={item.service_id}
                                    value={item.service_id.toString()}
                                    className="px-4 py-2 hover:bg-gray-100 transition-all cursor-pointer"
                                >
                                    {item.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <Label>Start Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full flex items-center justify-between border border-gray-500 rounded-md px-4 py-2"
                                >
                                    {startDate ? format(startDate, "PPP") : "Select start date"}
                                    <CalendarIcon className="ml-2 h-4 w-2" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent align="start" className="w-auto p-0 bg-white">
                                <Calendar
                                    mode="single"
                                    selected={startDate}
                                    onSelect={setStartDate}
                                    initialFocus
                                    className="rounded-md border bg-white shadow-md"
                                    classNames={{
                                        day_selected:
                                            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                                        day_today: "bg-accent text-accent-foreground",
                                        day_outside: "text-muted-foreground opacity-50",
                                        day_disabled: "text-muted-foreground opacity-50",
                                        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                                        day_hidden: "invisible",
                                        nav_button: "hover:bg-accent hover:text-accent-foreground",
                                        nav_button_previous: "absolute left-1",
                                        nav_button_next: "absolute right-1",
                                        table: "w-full border-collapse space-y-1",
                                        head_row: "flex",
                                        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                                        row: "flex w-full mt-2",
                                        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                        day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div>
                        <Label>Start Time</Label>
                        <Input
                            type="time"
                            className="w-full border border-gray-500 rounded-md px-4 py-2"
                            value={startTime}
                            onChange={(e) => handleTimeChange("start", e.target.value)}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <Label>End Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full flex items-center justify-between border border-gray-500 rounded-md px-4 py-2"
                                >
                                    {endDate ? format(endDate, "PPP") : "Select end date"}
                                    <CalendarIcon className="ml-2 h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent align="start" className="w-auto p-0 bg-white">
                                <Calendar
                                    mode="single"
                                    selected={endDate}
                                    onSelect={setEndDate}
                                    initialFocus
                                    className="rounded-md border bg-white shadow-md"
                                    classNames={{
                                        day_selected:
                                            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                                        day_today: "bg-accent text-accent-foreground",
                                        day_outside: "text-muted-foreground opacity-50",
                                        day_disabled: "text-muted-foreground opacity-50",
                                        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                                        day_hidden: "invisible",
                                        nav_button: "hover:bg-accent hover:text-accent-foreground",
                                        nav_button_previous: "absolute left-1",
                                        nav_button_next: "absolute right-1",
                                        table: "w-full border-collapse space-y-1",
                                        head_row: "flex",
                                        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                                        row: "flex w-full mt-2",
                                        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                        day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div>
                        <Label>End Time</Label>
                        <Input
                            type="time"
                            className="w-full border border-gray-500 rounded-md px-4 py-2"
                            value={endTime}
                            onChange={(e) => handleTimeChange("end", e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    className={`w-full px-4 py-2 rounded-md transition-all flex items-center justify-center gap-2 
                    ${isFormValid ? "bg-gray-700 hover:bg-black text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                    disabled={!isFormValid || isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin size-4" />
                            Adding Maintenance...
                        </>
                    ) : (
                        "Add Service"
                    )}
                </Button>
            </form>
        </>
    )
}

