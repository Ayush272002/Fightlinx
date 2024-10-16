import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui';
import { Input } from '@repo/ui';

interface EditProfilePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: FighterProfile) => void;
  initialProfile: FighterProfile;
}

interface FighterProfile {
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  reach: number;
  style: string;
  gym: string;
}

export function EditProfilePopup({
  isOpen,
  onClose,
  onSave,
  initialProfile,
}: EditProfilePopupProps) {
  const [profile, setProfile] = useState<FighterProfile>(initialProfile);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setProfile((prev) => ({ ...prev, gender: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(profile);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-white border border-red-600">
        <DialogHeader>
          <DialogTitle className="text-red-400">Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                className="bg-gray-800 text-white border-red-600 rounded"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                value={profile.age}
                onChange={handleInputChange}
                className="bg-gray-800 text-white border-red-600 rounded"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                name="gender"
                value={profile.gender}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger className="bg-gray-800 text-white border-red-600 rounded">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-red-600 rounded">
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                name="height"
                type="number"
                value={profile.height}
                onChange={handleInputChange}
                className="bg-gray-800 text-white border-red-600 rounded"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                value={profile.weight}
                onChange={handleInputChange}
                className="bg-gray-800 text-white border-red-600 rounded"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reach">Reach (cm)</Label>
              <Input
                id="reach"
                name="reach"
                type="number"
                value={profile.reach}
                onChange={handleInputChange}
                className="bg-gray-800 text-white border-red-600 rounded"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="style">Fighting Style</Label>
              <Input
                id="style"
                name="style"
                value={profile.style}
                onChange={handleInputChange}
                className="bg-gray-800 text-white border-red-600 rounded"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gym">Gym</Label>
              <Input
                id="gym"
                name="gym"
                value={profile.gym}
                onChange={handleInputChange}
                className="bg-gray-800 text-white border-red-600 rounded"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-red-600 hover:bg-red-700 rounded"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
