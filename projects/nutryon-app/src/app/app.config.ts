import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { routes } from './app.routes';
import { LucideAngularModule, Eye, EyeOff, ArrowRight, ChevronLeft, User, CheckCircle2, Calendar, Plus, Search, Edit2, Trash2, X, Check, LogOut, Save, TrendingUp, Target, History, Home, BarChart2 } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(LucideAngularModule.pick({
      Eye, EyeOff, ArrowRight, ChevronLeft, User, CheckCircle2, 
      Calendar, Plus, Search, Edit2, Trash2, X, Check, LogOut, 
      Save, TrendingUp, Target, History, Home, BarChart2
    }))
  ]
};
