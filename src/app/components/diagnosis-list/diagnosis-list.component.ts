import { Component, OnInit } from '@angular/core';
import { Diagnosis } from '../../models/diagnosis';
import { Patient } from '../../models/patient';
import { Doctor } from '../../models/doctor';
import { DiagnosisService } from '../../services/diagnosis.service';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-diagnosis-list',
  templateUrl: './diagnosis-list.component.html',
  styleUrls: ['./diagnosis-list.component.css']
})
export class DiagnosisListComponent implements OnInit {

  doctor: Doctor = {
    _id: '', medical_number: '', password: '', full_name: '',
    specialization: '', phone: '', location: '', grading_points: 0, grade: 0, private_key: "", public_key: ''
  };
  patient: Patient = {
    _id: '', medical_number: '', password: '',
    full_name: '', phone: '', location: '', grading_points: 0, grade: 0, private_key: "", public_key: ''
  };

  diagnoses: Diagnosis[];
  patients: Patient[];
  goToPatient: string;
  constructor(private diagnosisServise: DiagnosisService, private patientServise: PatientService) { }

  getAllDiagnosis(): void {
    if (localStorage.getItem('mode') == 'patient') {
      this.patient = JSON.parse(window.localStorage.getItem('currentUser'));
      this.diagnosisServise.getDiagnosisPatient(this.patient.public_key).subscribe(diagnoses => {
        if (diagnoses != null && diagnoses.length > 0) {
          this.diagnoses = diagnoses;
          console.log("patient " + diagnoses);
        } else {
          console.log("patient has not been diagnosed!");
        }
      },
        error => {
          window.alert("Error getting data");
          console.log(error);
        });
    } else {
      this.doctor = JSON.parse(window.localStorage.getItem('currentUser'));
      this.diagnosisServise.getDiagnosisDoctor(this.doctor.private_key).subscribe(diagnoses => {
        if (diagnoses != null && diagnoses.length > 0) {
          this.diagnoses = diagnoses;
          console.log("doctor" + diagnoses);
        } else {
          console.log("patient has not been diagnosed!");
        }
      },
        error => {
          window.alert("Error getting data");
          console.log(error);
        });
    }

  }

  getPatient(diagnosis : Diagnosis) : void {
    this.patientServise.getPatients().subscribe( patients => {
      this.patients = patients;
      for (var i = 0; i < this.patients.length; i++) {
        if (this.patients[i].public_key == diagnosis.patientPublicKey) {
         diagnosis.userId = this.patients[i]._id;
        }
      }
    },
    error => {
      window.alert("Error getting data");
      console.log(error);
    });
  }


  ngOnInit(): void {
    var patientId = window.location.href.split('/')[4];
    //called when u e a doctore n u click on patient list user
    if (patientId != null && patientId != "") {
      this.patientServise.getPatient(patientId)
        .subscribe(patient => {
          this.patient = patient;
          this.diagnosisServise.getDiagnosisPatient(this.patient.public_key).subscribe(diagnoses => {
            if (diagnoses != null) {
              this.diagnoses = diagnoses;
              for (var i = 0; i < this.diagnoses.length; i++) {
                this.getPatient(diagnoses[i]);
              }
              console.log("patient personal " + JSON.stringify(diagnoses, null, "\t"));
            } else {
              console.log("patient has not been diagnosed!");
            }
          },
            error => {
              window.alert("Error getting data");
              console.log(error);
            });
        });
    } else {
      //this is from status bar clicked
      this.getAllDiagnosis();
    }

  }

}
