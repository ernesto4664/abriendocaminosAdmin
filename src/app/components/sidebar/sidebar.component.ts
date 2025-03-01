import { Component, HostListener, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [CommonModule, RouterModule]
})
export class SidebarComponent implements OnInit, OnDestroy {
  menuState: { [key: string]: boolean } = {
    territorios: false,
    lineas: false,
    plandeintervencion:false,
    institucionesejecutoras:false,
  };

  isSidebarOpen = false;
  private sidebarSubscription: Subscription | null = null;

  constructor(
    private eRef: ElementRef,
    private sidebarService: SidebarService
  ) {}

  ngOnInit(): void {
    this.sidebarSubscription = this.sidebarService.sidebarStatus$.subscribe(isOpen => {
      this.isSidebarOpen = isOpen;
    });
  }

  ngOnDestroy(): void {
    if (this.sidebarSubscription) {
      this.sidebarSubscription.unsubscribe();
    }
  }

  toggleMenu(menu: string): void {
    this.menuState[menu] = !this.menuState[menu];
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedElement = event.target as HTMLElement;

    if (!this.eRef.nativeElement.contains(clickedElement) && 
        !clickedElement.closest('.navbar-menu') && 
        this.isSidebarOpen) {
      this.closeSidebar();
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth > 1024) {
      this.closeSidebar();
    }
  }

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }

  closeSidebar(): void {
    this.sidebarService.closeSidebar();
  }
}
