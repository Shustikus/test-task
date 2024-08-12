<template>
  <div class="currency-converter">
    <!-- Показываем индикатор загрузки -->
    <div v-if="loading" class="loading">Loading...</div>

    <!-- Отображаем результаты только если данные загружены -->
    <div v-else>
      <h1>{{ amount }} {{ fromCurrency }} equals</h1>
      <h2>{{ convertedAmount !== null ? convertedAmount : '...' }} {{ toCurrency }}</h2>
      <p class="date">{{ date }}</p>

      <div class="form-group">
        <input
            v-model.number="amount"
            placeholder="Enter amount"
            type="number"
            @input="debouncedConvertCurrency"
        />
        <select v-model="fromCurrency">
          <option v-for="currency in currencies" :key="currency" :value="currency">
            {{ currency }}
          </option>
        </select>
        <span class="equals">=</span>
        <select v-model="toCurrency">
          <option v-for="currency in currencies" :key="currency" :value="currency">
            {{ currency }}
          </option>
        </select>
      </div>
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      amount: 1,
      fromCurrency: 'USD',
      toCurrency: 'RUB',
      currencies: [],
      convertedAmount: null,
      errorMessage: null,
      date: '',
      loading: true,
      debounceTimer: null,
    };
  },
  async created() {
    await this.fetchCurrencies();
    this.convertCurrency();
  },
  watch: {
    fromCurrency: 'convertCurrency',
    toCurrency: 'convertCurrency',
  },
  methods: {
    async fetchCurrencies() {
      this.loading = true;

      try {
        const response = await fetch("https://api.apilayer.com/exchangerates_data/latest", {
          headers: {"apikey": "raHGzQtUIzCyKZYqxm4LZbTavC8DGKdE"}
        });
        const data = await response.json();
        this.currencies = [...Object.keys(data.rates), data.base];
        this.date = new Date(data.date).toLocaleString();
        this.convertCurrency();
      } catch (error) {
        this.errorMessage = 'Failed to fetch currencies. Please try again later.';
      } finally {
        this.loading = false;
      }
    },
    async convertCurrency() {
      if (!this.amount || !this.fromCurrency || !this.toCurrency) return;

      this.loading = true;

      try {
        const response = await fetch(`https://api.apilayer.com/exchangerates_data/latest?base=${this.fromCurrency}`, {
          headers: {"apikey": "raHGzQtUIzCyKZYqxm4LZbTavC8DGKdE"}
        });
        const data = await response.json();
        const rate = data.rates[this.toCurrency];
        this.convertedAmount = (this.amount * rate).toFixed(2);
        this.errorMessage = null;
      } catch (error) {
        this.errorMessage = 'Failed to convert currency. Please try again later.';
        this.convertedAmount = null;
      } finally {
        this.loading = false;
      }
    },
    handleInput() {
      if (this.debounceTimer) clearTimeout(this.debounceTimer);

      this.debounceTimer = setTimeout(() => {
        this.convertCurrency();
      }, 500);
    }
  },
  computed: {
    debouncedConvertCurrency() {
      return this.handleInput;
    }
  }
};
</script>

<style scoped>
.currency-converter {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  background-color: #222;
  color: #fff;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

h1, h2 {
  margin: 10px 0;
  font-weight: normal;
}

h1 {
  font-size: 1.5em;
}

h2 {
  font-size: 2.5em;
  color: #f0b90b;
}

.date {
  font-size: 0.9em;
  color: #bbb;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

input,
select {
  padding: 10px;
  margin: 5px;
  border-radius: 3px;
  border: 1px solid #444;
  background-color: #333;
  color: #fff;
  font-size: 1.2em;
  width: 45%;
}

button {
  background-color: #f0b90b;
  color: #000;
  border: none;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
  font-weight: bold;
}

button:hover {
  background-color: #ffa500;
}

.equals {
  font-size: 1.5em;
  color: #bbb;
}

.error {
  color: red;
  margin-top: 20px;
}

.loading {
  font-size: 1.5em;
  color: #f0b90b;
  margin-top: 20px;
}
</style>