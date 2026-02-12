import { Card } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Patient } from '../lib/data/patientData';

interface PatientDemographicsProps {
  patient: Patient;
}

export function PatientDemographics({ patient }: PatientDemographicsProps) {
  return (
    <Card className="p-5 bg-card border-border">
      <h3 className="mb-4 text-slate-100">Patient Demographics</h3>

      <div className="space-y-4">
        <div>
          <Label htmlFor="patient-id" className="text-slate-200 mb-2 block">
            Patient ID
          </Label>
          <Input
            id="patient-id"
            placeholder="Enter patient ID"
            value={patient.id}
            readOnly
            className="bg-[#2d1b4e] border-purple-900/20 text-slate-200"
          />
        </div>

        <div>
          <Label htmlFor="age" className="text-slate-200 mb-2 block">
            Age
          </Label>
          <Input
            id="age"
            type="number"
            placeholder="Enter age"
            value={patient.age}
            readOnly
            className="bg-[#2d1b4e] border-purple-900/20 text-slate-200"
          />
        </div>

        <div>
          <Label htmlFor="sex" className="text-slate-200 mb-2 block">
            Sex
          </Label>
          <Select value={patient.sex}>
            <SelectTrigger className="bg-[#2d1b4e] border-purple-900/20 text-slate-200">
              <SelectValue placeholder="Select sex" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a0f2e] border-purple-900/20">
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
