/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Config as BackstageConfig } from '@backstage/config';
import { Currency, EngineerThreshold, Icon } from '../types';
import { Metric, Product } from '@backstage/plugin-cost-insights-common';
import { getIcon } from '../utils/navigation';
import { validateCurrencies, validateMetrics } from '../utils/config';
import { createCurrencyFormat, defaultCurrencies } from '../utils/currency';
import { configApiRef, useApi } from '@backstage/core-plugin-api';

/*
 * Config schema 2021-08-05
 *
 * costInsights:
 *   engineerCost: 200000
 *   products:
 *     productA:
 *       name: Product A
 *       icon: storage
 *     productB:
 *       name: Product B
 *       icon: data
 *   metrics:
 *     metricA:
 *       name: Metric A
 *       default: true
 *     metricB:
 *       name: Metric B
 *   baseCurrency:
 *     locale: nl-NL
 *     options:
 *       currency: EUR
 *       minimumFractionDigits: 3
 *   currencies:
 *     currencyA:
 *       label: Currency A
 *       unit: Unit A
 *     currencyB:
 *       label: Currency B
 *       kind: CURRENCY_B
 *       unit: Unit B
 *       prefix: B
 *       rate: 3.5
 */

/** @public */
export type ConfigContextProps = {
  baseCurrency: Intl.NumberFormat;
  metrics: Metric[];
  products: Product[];
  icons: Icon[];
  engineerCost: number;
  engineerThreshold: number;
  currencies: Currency[];
};

export const ConfigContext = createContext<ConfigContextProps | undefined>(
  undefined,
);

const defaultState: ConfigContextProps = {
  baseCurrency: createCurrencyFormat(),
  metrics: [],
  products: [],
  icons: [],
  engineerCost: 0,
  engineerThreshold: EngineerThreshold,
  currencies: defaultCurrencies,
};

export const ConfigProvider = ({ children }: PropsWithChildren<{}>) => {
  const c: BackstageConfig = useApi(configApiRef);
  const [config, setConfig] = useState(defaultState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function getProducts(): Product[] {
      const products = c.getOptionalConfig('costInsights.products');
      if (products) {
        return products.keys().map(key => ({
          kind: key,
          name: products.getString(`${key}.name`),
          aggregation: [0, 0],
        }));
      }
      return [];
    }

    function getMetrics(): Metric[] {
      const metrics = c.getOptionalConfig('costInsights.metrics');
      if (metrics) {
        return metrics.keys().map(key => ({
          kind: key,
          name: metrics.getString(`${key}.name`),
          default: metrics.getOptionalBoolean(`${key}.default`) ?? false,
        }));
      }

      return [];
    }

    function getBaseCurrency(): Intl.NumberFormat {
      const baseCurrency = c.getOptionalConfig('costInsights.baseCurrency');
      if (baseCurrency) {
        const options = baseCurrency.getOptionalConfig('options');
        return new Intl.NumberFormat(
          baseCurrency.getOptionalString('locale'),
          options
            ? {
                localeMatcher: options.getOptionalString('localeMatcher'),
                style: 'currency',
                currency: options.getOptionalString('currency'),
                currencySign: options.getOptionalString('currencySign'),
                useGrouping: options.getOptionalBoolean('useGrouping'),
                minimumIntegerDigits: options.getOptionalNumber(
                  'minimumIntegerDigits',
                ),
                minimumFractionDigits: options.getOptionalNumber(
                  'minimumFractionDigits',
                ),
                maximumFractionDigits: options.getOptionalNumber(
                  'maximumFractionDigits',
                ),
                minimumSignificantDigits: options.getOptionalNumber(
                  'minimumSignificantDigits',
                ),
                maximumSignificantDigits: options.getOptionalNumber(
                  'maximumSignificantDigits',
                ),
              }
            : undefined,
        );
      }

      return defaultState.baseCurrency;
    }

    function getCurrencies(): Currency[] {
      const currencies = c.getOptionalConfig('costInsights.currencies');
      if (currencies) {
        return currencies.keys().map(key => ({
          label: currencies.getString(`${key}.label`),
          unit: currencies.getString(`${key}.unit`),
          kind: currencies.getOptionalString(`${key}.kind`) || null,
          prefix: currencies.getOptionalString(`${key}.prefix`),
          rate: currencies.getOptionalNumber(`${key}.rate`),
        }));
      }

      return defaultCurrencies;
    }

    function getIcons(): Icon[] {
      const products = c.getOptionalConfig('costInsights.products');
      if (products) {
        return products.keys().map(k => ({
          kind: k,
          component: getIcon(products.getOptionalString(`${k}.icon`)),
        }));
      }
      return [];
    }

    function getEngineerCost(): number {
      return c.getNumber('costInsights.engineerCost');
    }

    function getEngineerThreshold(): number {
      return (
        c.getOptionalNumber('costInsights.engineerThreshold') ??
        defaultState.engineerThreshold
      );
    }

    function getConfig() {
      const baseCurrency = getBaseCurrency();
      const products = getProducts();
      const metrics = getMetrics();
      const engineerCost = getEngineerCost();
      const engineerThreshold = getEngineerThreshold();
      const icons = getIcons();
      const currencies = getCurrencies();

      validateMetrics(metrics);
      validateCurrencies(currencies);

      setConfig(prevState => ({
        ...prevState,
        baseCurrency,
        metrics,
        products,
        engineerCost,
        engineerThreshold,
        icons,
        currencies,
      }));

      setLoading(false);
    }

    getConfig();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return null;
  }

  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
};

export function useConfig(): ConfigContextProps {
  const config = useContext(ConfigContext);
  return config ? config : assertNever();
}

function assertNever(): never {
  throw new Error('Cannot use useConfig outside of ConfigProvider');
}
