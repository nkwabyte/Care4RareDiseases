import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Patient } from '@/lib/types';

interface PatientDemographicsProps {
  patient: Patient;
}

export function PatientDemographics({ patient }: PatientDemographicsProps) {
  return (
    <Card className="p-5 bg-card border-border">
      <h3 className="mb-4 text-foreground">Patient Demographics</h3>

      <div className="space-y-4">
        <div>
          <Label htmlFor="patient-id" className="text-foreground mb-2 block">
            Patient ID
          </Label>
          <Input
            id="patient-id"
            placeholder="Enter patient ID"
            value={patient.id}
            readOnly
            className="bg-surface border-border text-foreground"
          />
        </div>

        <div>
          <Label htmlFor="age" className="text-foreground mb-2 block">
            Age
          </Label>
          <Input
            id="age"
            type="number"
            placeholder="Enter age"
            value={patient.age}
            readOnly
            className="bg-surface border-border text-foreground"
          />
        </div>

        <div>
          <Label htmlFor="sex" className="text-foreground mb-2 block">
            Sex
          </Label>
          <Select value={patient.sex}>
            <SelectTrigger className="bg-surface border-border text-foreground">
              <SelectValue placeholder="Select sex" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}
