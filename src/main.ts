import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { SpeedInsights } from "@vercel/speed-insights/next"

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
