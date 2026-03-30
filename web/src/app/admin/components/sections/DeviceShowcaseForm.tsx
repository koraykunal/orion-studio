"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import ImageUpload from "../ImageUpload";
import type { DeviceShowcaseData, DeviceType } from "@/lib/project-types";

const DEVICE_LABELS: Record<DeviceType, string> = {
    phone: "Phone",
    tablet: "Tablet",
    laptop: "Laptop",
    desktop: "Desktop Monitor",
};

export default function DeviceShowcaseForm({
    data,
    onChange,
}: {
    data: DeviceShowcaseData;
    onChange: (data: DeviceShowcaseData) => void;
}) {
    const updateDevice = (index: number, field: string, value: string) => {
        const devices = [...data.devices];
        devices[index] = { ...devices[index], [field]: value };
        onChange({ ...data, devices });
    };

    const addDevice = () => {
        if (data.devices.length >= 4) return;
        onChange({
            ...data,
            devices: [...data.devices, { type: "phone" as DeviceType, image: "", alt: "" }],
        });
    };

    const removeDevice = (index: number) => {
        onChange({
            ...data,
            devices: data.devices.filter((_, i) => i !== index),
        });
    };

    return (
        <div className="space-y-6">
            <p className="text-xs text-foreground-muted">
                Add up to 4 devices. Layout adapts automatically based on device types and count.
            </p>

            <div className="space-y-4">
                <Label>Devices ({data.devices.length}/4)</Label>
                {data.devices.map((device, i) => (
                    <div key={i} className="p-4 border border-border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-foreground-muted">Device {i + 1}</span>
                            {data.devices.length > 1 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeDevice(i)}
                                    className="text-red-400 hover:text-red-300"
                                >
                                    Remove
                                </Button>
                            )}
                        </div>
                        <Select
                            value={device.type}
                            onValueChange={(v) => updateDevice(i, "type", v)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(DEVICE_LABELS).map(([key, label]) => (
                                    <SelectItem key={key} value={key}>{label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <ImageUpload
                            value={device.image}
                            onChange={(url) => updateDevice(i, "image", url)}
                            label="Screenshot"
                        />
                        <Input
                            value={device.alt}
                            onChange={(e) => updateDevice(i, "alt", e.target.value)}
                            placeholder="Alt text"
                        />
                    </div>
                ))}
                {data.devices.length < 4 && (
                    <Button variant="outline" size="sm" onClick={addDevice} className="w-full">
                        Add Device
                    </Button>
                )}
            </div>
        </div>
    );
}
