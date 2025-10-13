// AddFamilyForm.tsx
import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Plus, CheckCircle2 } from "lucide-react";
import { FirestoreMember } from "@/components/FamilyTreeTypes.tsx"; // Assume shared types

interface AddFamilyFormProps {
  familyList: FirestoreMember[];
  onSuccess: () => Promise<void>;
}

const AddFamilyForm = ({ familyList, onSuccess }: AddFamilyFormProps) => {
  const [showSpouse, setShowSpouse] = useState(false);
  const [alive, setAlive] = useState(false);
  const [spouseAlive, setSpouseAlive] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    birth: "",
    death: "",
    spouse: "",
    spouse_birth: "",
    spouse_death: "",
    parent: "",
    about: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.parent) return;

    const newMember = {
      name: formData.name,
      birth: formData.birth,
      death: alive ? "" : formData.death,
      spouse: showSpouse ? formData.spouse : "",
      spouse_birth: showSpouse ? formData.spouse_birth : "",
      spouse_death: showSpouse && !spouseAlive ? formData.spouse_death : "",
      parent: formData.parent || "",
      about: formData.about,
    };

    try {
      await setDoc(doc(db, "family_members", formData.name), newMember);
      setSuccessMessage(`${formData.name} successfully added!`);
      setTimeout(() => setSuccessMessage(""), 3000);
      setDialogOpen(false);
      setFormData({
        name: "",
        birth: "",
        death: "",
        spouse: "",
        spouse_birth: "",
        spouse_death: "",
        parent: "",
        about: "",
      });
      await onSuccess();
    } catch (err) {
      console.error("Error adding family member:", err);
    }
  };

  return (
    <>
      {successMessage && (
        <div className="mb-4 bg-green-100 text-green-800 border border-green-300 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <span>{successMessage}</span>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button size="lg" className="gap-2">
            <Plus className="h-4 w-4" /> Add More Family
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add a New Family Member</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-muted-foreground">
              Need to add any more family members? Fill out the form below
              and hit submit when done.
            </p>

            <div>
              <Label>Full Name of Busateri *</Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label>Birthdate (Month / Day / Year)</Label>
              <Input
                name="birth"
                placeholder="e.g. 1905"
                value={formData.birth}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={alive}
                onChange={() => setAlive(!alive)}
              />
              <Label>Still alive?</Label>
            </div>

            {!alive && (
              <div>
                <Label>Deathdate (Month / Day / Year)</Label>
                <Input
                  name="death"
                  placeholder="e.g. 1992"
                  value={formData.death}
                  onChange={handleInputChange}
                />
              </div>
            )}

            <div>
              <Label>Busateri Parent *</Label>
              <select
                name="parent"
                value={formData.parent}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select parent</option>
                {familyList.map((f) => (
                  <option key={f.id} value={f.name}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showSpouse}
                onChange={() => setShowSpouse(!showSpouse)}
              />
              <Label>Married?</Label>
            </div>

            {showSpouse && (
              <>
                <div>
                  <Label>Spouse Full Name</Label>
                  <Input
                    name="spouse"
                    value={formData.spouse}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label>Spouse Birthdate (Month / Day / Year)</Label>
                  <Input
                    name="spouse_birth"
                    placeholder="e.g. 1907"
                    value={formData.spouse_birth}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={spouseAlive}
                    onChange={() => setSpouseAlive(!spouseAlive)}
                  />
                  <Label>Spouse Still alive?</Label>
                </div>

                {!spouseAlive && (
                  <div>
                    <Label>Spouse Deathdate (Month / Day / Year)</Label>
                    <Input
                      name="spouse_death"
                      placeholder="e.g. 1982"
                      value={formData.spouse_death}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
              </>
            )}
            <div>
              <Label>About Member</Label>
              <Textarea
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                placeholder="Write a short bio or memory..."
              />
            </div>

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddFamilyForm;