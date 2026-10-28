import { Injectable, inject } from '@angular/core';
import { HiringModelKey, RegionKey, PlatformType, DesignComplexityKey } from '../models/estimate.model';
import { LocalStorageService } from './local-storage.service';

const HOURLY_RATES_KEY = 'costbuild_indian_hourly_rates_v1';

@Injectable({
  providedIn: 'root'
})
export class RateCardService {
  private readonly storage = inject(LocalStorageService);

  private readonly defaultBaseRatesInr: Record<HiringModelKey, number> = {
    freelancer: 500,
    small_agency: 700,
    established_agency: 1100,
    in_house: 650,
    mixed: 600
  };
  private baseRatesInr: Record<HiringModelKey, number> = this.loadBaseRates();

  // Region multiplier
  private readonly regionMultipliers: Record<RegionKey, number> = {
    india: 1.0,
    southeast_asia: 1.25,
    latam: 1.75,
    eastern_europe: 2.3,
    western_europe: 3.8,
    us_canada: 4.5
  };

  // Platform multipliers
  private readonly platformMultipliers: Record<PlatformType, number> = {
    web: 1.0,
    mobile: 1.1,
    desktop: 1.1,
    multi_platform: 1.25
  };

  // Design multipliers
  private readonly designMultipliers: Record<DesignComplexityKey, number> = {
    minimal: 0.9,
    standard: 1.0,
    premium_custom: 1.15
  };

  // Currency exchange rates relative to INR
  private readonly currencyRatesToInr: Record<string, number> = {
    INR: 1.0,
    USD: 86.5,
    EUR: 92.0,
    GBP: 110.0
  };

  private readonly currencySymbols: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£'
  };

  getHourlyRate(hiringModel: HiringModelKey, region: RegionKey): number {
    const base = this.baseRatesInr[hiringModel] || this.defaultBaseRatesInr.mixed;
    const regionMult = this.regionMultipliers[region] || 1.0;
    return Math.round(base * regionMult);
  }

  getBaseHourlyRates(): Record<HiringModelKey, number> {
    return { ...this.baseRatesInr };
  }

  setBaseHourlyRate(hiringModel: HiringModelKey, rateInr: number): void {
    if (!Number.isFinite(rateInr) || rateInr < 100 || rateInr > 100000) {
      throw new RangeError('Hourly rates must be between ₹100 and ₹100,000.');
    }
    this.baseRatesInr = { ...this.baseRatesInr, [hiringModel]: Math.round(rateInr) };
    this.storage.setItem(HOURLY_RATES_KEY, this.baseRatesInr);
  }

  private loadBaseRates(): Record<HiringModelKey, number> {
    const stored = this.storage.getItem<Partial<Record<HiringModelKey, number>>>(HOURLY_RATES_KEY, {});
    const rates = { ...this.defaultBaseRatesInr };
    for (const model of Object.keys(rates) as HiringModelKey[]) {
      const savedRate = stored[model];
      if (typeof savedRate === 'number' && Number.isFinite(savedRate) && savedRate >= 100 && savedRate <= 100000) {
        rates[model] = Math.round(savedRate);
      }
    }
    return rates;
  }

  getPlatformMultiplier(platform: PlatformType): number {
    return this.platformMultipliers[platform] || 1.0;
  }

  getDesignMultiplier(design: DesignComplexityKey): number {
    return this.designMultipliers[design] || 1.0;
  }

  convertFromInr(amountInInr: number, targetCurrency: string): number {
    const rate = this.currencyRatesToInr[targetCurrency] || 1.0;
    return Math.round(amountInInr / rate);
  }

  convertToInr(amountInTarget: number, sourceCurrency: string): number {
    const rate = this.currencyRatesToInr[sourceCurrency] || 1.0;
    return Math.round(amountInTarget * rate);
  }

  formatCurrency(amount: number, currency: string = 'INR'): string {
    const symbol = this.currencySymbols[currency] || '₹';
    if (currency === 'INR') {
      return `${symbol} ${amount.toLocaleString('en-IN')}`;
    }
    return `${symbol}${amount.toLocaleString('en-US')}`;
  }

  getCurrencySymbol(currency: string = 'INR'): string {
    return this.currencySymbols[currency] || '₹';
  }
}
