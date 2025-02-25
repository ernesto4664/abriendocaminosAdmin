import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private isSidebarOpen$ = new BehaviorSubject<boolean>(false);

  get sidebarStatus$() {
    return this.isSidebarOpen$.asObservable();
  }

  toggleSidebar(): void {
    this.isSidebarOpen$.next(!this.isSidebarOpen$.getValue());
   // console.log('Sidebar status changed:', this.isSidebarOpen$.getValue());
  }

  closeSidebar(): void {
    this.isSidebarOpen$.next(false);
  }
}
