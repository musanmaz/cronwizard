import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { injectSpeedInsights } from '@vercel/speed-insights';

injectSpeedInsights();

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
