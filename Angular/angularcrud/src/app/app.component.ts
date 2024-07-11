import { Component, OnInit } from '@angular/core';
import { EmployeeService } from './service/employee.service';
import { Employee } from './models/employee';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslationService } from './translation.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
 
  Employeeary: Employee[] = [];
  FilteredEmployeeary: Employee[] = [];
  Employeeformgroup: FormGroup;
  selectedLanguage: string = 'en';
  darkMode = false;

  constructor(private empservice: EmployeeService, private fb: FormBuilder,private translationService: TranslationService) {
    this.Employeeformgroup = this.fb.group({
      id: [""],
      name: [""],
      mobileNo: [""],
      emailID: [""],
    });
  }

  ngOnInit(): void {
    this.getemployees();
    this.translationService.init()?.then(() => {
    });
  }
  
  exportToExcel() {
    const excelData = [];
    const headers = ["Name", "Mobile Number", "Email"];
  
    excelData.push(headers);
  
    this.FilteredEmployeeary.forEach(emp => {
      const rowData = [emp.name, emp.mobileNo, emp.emailID];
      excelData.push(rowData);
    });
  
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(excelData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts');
  
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    FileSaver.saveAs(data, 'contacts.xlsx');
  }
  
  
  getemployees() {
    this.empservice.GetEmployee().subscribe(response => {
      this.Employeeary = response;
      this.Employeeary.sort((a, b) => a.name.localeCompare(b.name));
      this.FilteredEmployeeary = this.Employeeary;
      this.sortAndFilter();
    });
  }

  updateFilteredEmployees(searchTerm: string) {
    this.FilteredEmployeeary = this.Employeeary.filter(emp =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  sortAndFilter(searchTerm: string = '') {
    this.FilteredEmployeeary = this.Employeeary.filter(emp =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    this.FilteredEmployeeary.sort((a, b) => a.name.localeCompare(b.name));
  }

  applyFilter(searchTerm: string) {
    this.sortAndFilter(searchTerm);
  }

  Onsubmit() {
    if (this.Employeeformgroup.value?.id != null && this.Employeeformgroup.value.id != "") {
      this.empservice.UpdateEmployee(this.Employeeformgroup.value).subscribe(response => {
        this.getemployees();
        this.Employeeformgroup.setValue({
          id: "",
          name: "",
          mobileNo: "",
          emailID: "",
        });
        alert('Kişi güncellendi!');
      });
    } else {
      this.empservice.CreateEmployee(this.Employeeformgroup.value).subscribe(response => {
        this.getemployees();
        this.Employeeformgroup.setValue({
          id: "",
          name: "",
          mobileNo: "",
          emailID: "",
        });
        alert('Kişi eklendi!');
      });
    }
  }

  Fillform(emp: Employee) {
    this.Employeeformgroup.setValue({
      id: emp.id,
      name: emp.name,
      mobileNo: emp.mobileNo,
      emailID: emp.emailID,
    });
  }

  DeleteEmp(id: string) {
    if (confirm('Bu kişiyi silmek istediğinizden emin misiniz?')) {
      this.empservice.DeleteEmployee(id).subscribe(res => {
        this.getemployees();
        alert('Kişi silindi!');
      });
    }
  }

  changeLanguage(event: any): void {
    const selectedLanguage = event.target.value;
    this.translationService.setLanguage(selectedLanguage);
    this.translationService.init().then(() => {
      this.sortAndFilter();
    });
  }

  getTranslation(key: string): string {
    return this.translationService.getTranslation(key);
  }

  resetEmployeeForm(formgroup: FormGroup) {
    formgroup.setValue({
      id: "",
      name: "",
      mobileNo: "",
      emailID: ""
    });
  }

  toggleDarkMode() {
    this.updateStyles();
  }

  updateStyles() {
    const root = document.documentElement;
    if (this.darkMode) {
      root.style.setProperty('--background-color', '#1a1a1a');
      root.style.setProperty('--text-color', '#ffffff');
    } else {
      root.style.setProperty('--background-color', '#ffffff');
      root.style.setProperty('--text-color', '#000000');
    }
  }
  
  title = 'angularcrud';
}
