import { Component, OnInit, Input } from '@angular/core';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

@Component({
  selector: 'app-adsense',
  templateUrl: './adsense.component.html',
  styleUrls: ['./adsense.component.css']
})
export class AdSenseComponent implements OnInit {
  @Input() adSlot: string = '';
  @Input() adFormat: string = 'auto';
  @Input() adStyle: string = 'display:block';
  @Input() adClient: string = 'ca-pub-YOUR_PUBLISHER_ID';

  constructor() { }

  ngOnInit(): void {
    // AdSense script'inin yüklendiğinden emin ol
    this.loadAdSense();
  }

  private loadAdSense(): void {
    // AdSense script'inin yüklenip yüklenmediğini kontrol et
    if (typeof window !== 'undefined' && !window.adsbygoogle) {
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }
  }

  ngAfterViewInit(): void {
    // AdSense reklamını yükle
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense yüklenirken hata oluştu:', e);
    }
  }
} 