import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Plus, History, User, Home, BarChart2 } from 'lucide-angular';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <nav class="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 bg-white/90 backdrop-blur-xl rounded-t-[24px] ambient-shadow z-50">
      <a routerLink="/" class="flex flex-col items-center justify-center px-5 py-2 rounded-2xl transition-all active:scale-90" [ngClass]="active === 'home' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant/50'">
        <lucide-icon name="Home" class="w-6 h-6 flex"></lucide-icon>
        <span class="text-[10px] font-medium tracking-widest uppercase mt-1">Home</span>
      </a>
      <a routerLink="/meals" class="flex flex-col items-center justify-center px-5 py-2 rounded-2xl transition-all active:scale-90" [ngClass]="active === 'meals' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant/50'">
        <lucide-icon name="Plus" class="w-6 h-6 flex"></lucide-icon>
        <span class="text-[10px] font-medium tracking-widest uppercase mt-1">Log</span>
      </a>
      <a routerLink="/reports" class="flex flex-col items-center justify-center px-5 py-2 rounded-2xl transition-all active:scale-90" [ngClass]="active === 'reports' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant/50'">
        <lucide-icon name="BarChart2" class="w-6 h-6 flex"></lucide-icon>
        <span class="text-[10px] font-medium tracking-widest uppercase mt-1">History</span>
      </a>
      <a routerLink="/profile" class="flex flex-col items-center justify-center px-5 py-2 rounded-2xl transition-all active:scale-90" [ngClass]="active === 'profile' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant/50'">
        <lucide-icon name="User" class="w-6 h-6 flex"></lucide-icon>
        <span class="text-[10px] font-medium tracking-widest uppercase mt-1">Profile</span>
      </a>
    </nav>
  `
})
export class BottomNavComponent {
  @Input() active: string = 'home';

  // Inject Icons for setup
  HomeIcon = Home;
  PlusIcon = Plus;
  HistoryIcon = History;
  UserIcon = User;
  BarChart2Icon = BarChart2;
}
