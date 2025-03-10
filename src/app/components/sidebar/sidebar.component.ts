import { Component, HostListener, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { Subscription } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [CommonModule, RouterModule, MatSidenavModule, MatExpansionModule, MatIconModule, MatButtonModule]
})
export class SidebarComponent implements OnInit, OnDestroy {
  // ... tu código de menú
  isSidebarOpen = false;
  isMobile = false;
  private sidebarSubscription: Subscription | null = null;
  private breakpointSubscription: Subscription | null = null;

  constructor(
    private eRef: ElementRef,
    private sidebarService: SidebarService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.sidebarSubscription = this.sidebarService.sidebarStatus$.subscribe(isOpen => {
      console.log('SidebarComponent: isSidebarOpen =', isOpen);
      this.isSidebarOpen = isOpen;
    });

    this.breakpointSubscription = this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
        if (!this.isMobile) {
          this.isSidebarOpen = true; // En escritorio, siempre abierto
        }
      });
  }

  ngOnDestroy(): void {
    this.sidebarSubscription?.unsubscribe();
    this.breakpointSubscription?.unsubscribe();
  }

  // Otros métodos (toggleMenu, closeSidebar, etc.)...
  closeSidebar(): void {
    this.sidebarService.closeSidebar();
  }
}
