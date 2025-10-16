import { useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
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
import { Edit, CheckCircle2 } from "lucide-react";
import { FamilyMember } from "@/components/FamilyTreeTypes.tsx";

interface EditFamilyMemberProps {
  member: FamilyMember;
  onSuccess: () => Promise<void>;
  buttonText?: string; // Added for dynamic button text
}

const EditFamilyMember = ({ member, onSuccess, buttonText = "Edit Member" }: EditFamilyMemberProps) => {
  const [showSpouse, setShowSpouse] = useState(!!member.spouse);
  const [alive, setAlive] = useState(!member.generation?.includes(" - "));
  const [spouseAlive, setSpouseAlive] = useState(member.spouse ? !member.spouse.generation?.includes(" - ") : true);
  const [formData, setFormData] = useState({
    birth: member.generation?.split(" - ")[0] || "",
    death: member.generation?.split(" - ")[1] || "",
    spouse: member.spouse?.name || "",
    spouse_birth: member.spouse?.generation?.split(" - ")[0] || "",
    spouse_death: member.spouse?.generation?.split(" - ")[1] || "",
    about_addition: "",
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

    const updates: Record<string, string> = {};

    // Conditional updates for missing fields
    if (!member.generation?.split(" - ")[0]) {
      updates.birth = formData.birth;
    }
    if (!alive && !member.generation?.includes(" - ")) {
      updates.death = formData.death;
    }
    if (!member.spouse && showSpouse) {
      updates.spouse = formData.spouse;
      updates.spouse_birth = formData.spouse_birth;
      if (!spouseAlive) {
        updates.spouse_death = formData.spouse_death;
      }
    }

    // Append to about if addition provided
    if (formData.about_addition) {
      const memberDoc = await getDoc(doc(db, "family_members", member.name));
      const currentAbout = memberDoc.data()?.about || "";
      updates.about = currentAbout ? `${currentAbout} ${formData.about_addition}` : formData.about_addition;
    }

    if (Object.keys(updates).length === 0) return; // No changes

    try {
      await updateDoc(doc(db, "family_members", member.name), updates);
      setSuccessMessage(`${member.name} successfully updated!`);
      setTimeout(() => setSuccessMessage(""), 3000);
      setDialogOpen(false);
      setFormData({
        birth: "",
        death: "",
        spouse: "",
        spouse_birth: "",
        spouse_death: "",
        about_addition: "",
      });
      await onSuccess();
    } catch (err) {
      console.error("Error updating family member:", err);
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
          <Button variant="outline" className="gap-2 mt-4">
            <Edit className="h-4 w-4" /> {buttonText}
          </Button>
        </DialogTrigger>

      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
            <DialogTitle>Edit {member.name}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pb-4">
            <p className="text-muted-foreground">
              Update missing information or add to the about section.
            </p>

            <div>
              <Label>Full Name (cannot edit)</Label>
              <Input value={member.name} disabled />
            </div>

            {!member.generation?.split(" - ")[0] && (
              <div>
                <Label>Birthdate (Month / Day / Year)</Label>
                <Input
                  name="birth"
                  placeholder="e.g. 1905"
                  value={formData.birth}
                  onChange={handleInputChange}
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={alive}
                onChange={() => setAlive(!alive)}
                disabled={!!member.generation?.includes(" - ")}
              />
              <Label>Still alive?</Label>
            </div>

            {!alive && !member.generation?.includes(" - ") && (
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
              <Label>Busateri Parent (cannot edit)</Label>
              <Input value={"" /* Fetch if needed */} disabled />
            </div>

            {!member.spouse && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showSpouse}
                  onChange={() => setShowSpouse(!showSpouse)}
                />
                <Label>Married?</Label>
              </div>
            )}

            {showSpouse && !member.spouse && (
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
              <Label>Current About (read-only)</Label>
              <Textarea value={member.information || ""} disabled />
            </div>

            <div>
              <Label>Add to About</Label>
              <Textarea
                name="about_addition"
                value={formData.about_addition}
                onChange={handleInputChange}
                placeholder="Add new information or memory..."
              />
            </div>

            <Button type="submit" className="w-full">
              Update
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditFamilyMember;