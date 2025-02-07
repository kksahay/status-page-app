import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Calendar, CalendarIcon } from "lucide-react"
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select"
import { format } from "date-fns"
import { setMinutes, setHours, isValid } from "date-fns"
import type { Service } from "./service-list"

interface NewServiceFormProps {
    services: Service[]
    onSuccess?: () => void
}

export function NewMaintenanceForm({ onSuccess, services }: NewServiceFormProps) {
    const [startDate, setStartDate] = React.useState<Date | null>(null)
    const [endDate, setEndDate] = React.useState<Date | null>(null)
    const [startTime, setStartTime] = React.useState<string>("")
    const [endTime, setEndTime] = React.useState<string>("")
    const [service, setService] = React.useState("")
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

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        console.log({ service, startDate, startTime, endDate, endTime })
        // setOpen(false) // Close dialog after submission
        onSuccess?.();
    }

    const isFormValid =
        service.trim() !== "" &&
        startDate !== null &&
        endDate !== null &&
        startTime !== "" &&
        endTime !== "" &&
        isValid(startDate) &&
        isValid(endDate)

    return (
        <>
            <h2 className="text-2xl font-semibold mb-4">Schedule Maintenance</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Service Selection */}
                <div>
                    <Label htmlFor="service">Service</Label>
                    <Select onValueChange={setService}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                            {services.map((item) => (
                                <SelectItem key={item.title} value={item.title}>
                                    {item.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Start Date & Time */}
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <Label>Start Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full flex items-center justify-between">
                                    {startDate ? format(startDate, "PPP") : "Select start date"}
                                    <CalendarIcon className="ml-2 h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div>
                        <Label>Start Time</Label>
                        <Input type="time" className="w-full" value={startTime} onChange={(e) => handleTimeChange("start", e.target.value)} />
                    </div>
                </div>

                {/* End Date & Time */}
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <Label>End Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full flex items-center justify-between">
                                    {endDate ? format(endDate, "PPP") : "Select end date"}
                                    <CalendarIcon className="ml-2 h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div>
                        <Label>End Time</Label>
                        <Input type="time" className="w-full" value={endTime} onChange={(e) => handleTimeChange("end", e.target.value)} />
                    </div>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full py-3 text-lg font-semibold" disabled={!isFormValid}>
                    Schedule Maintenance
                </Button>
            </form>
        </>
    )
}

