import { createApp } from 'vue'
import App from './App.vue'
import router from './router' 

import PrimeVue from 'primevue/config';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row'; 
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';

import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';       
import '/node_modules/primeflex/primeflex.css';

const app = createApp(App);
app.use(router)
app.use(PrimeVue);
app.component('Button', Button);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('ColumnGroup', ColumnGroup);
app.component('Row', Row);
app.component('Accordion', Accordion);
app.component('AccordionTab', AccordionTab);

app.mount('#app');
