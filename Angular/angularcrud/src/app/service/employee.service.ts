import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from '../models/employee';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private httpclient:HttpClient) { }

  baseurl="http://localhost:5007/api/Employee";

  GetEmployee():Observable<Employee[]>{
    return this.httpclient.get<Employee[]>(this.baseurl);
  }
  
  CreateEmployee(emp:Employee):Observable<Employee>{
    emp.id="00000000-0000-0000-0000-000000000000";
    return this.httpclient.post<Employee>(this.baseurl,emp);
  }

  UpdateEmployee(emp:Employee):Observable<Employee>{
    return this.httpclient.put<Employee>(this.baseurl+'/'+emp.id,emp);
  }

  DeleteEmployee(id:string):Observable<Employee>{
    return this.httpclient.delete<Employee>(this.baseurl+'/'+id);
  }
  
} 