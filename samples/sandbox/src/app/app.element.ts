import './app.element.css';
import "packages/ui-native/src/themes/light.css";
import { RevealSdkSettings, RvDashboardViewer } from '@revealbi/ui-native';
import { registerChartRenderers } from './chart-renderers';

RevealSdkSettings.serverUrl = "https://samples.revealbi.io/upmedia-backend/reveal-api/";
//registerChartRenderers();

export class AppElement extends HTMLElement {
  public static observedAttributes = [];


  connectedCallback() {
    const title = 'sandbox';
    this.innerHTML = `
      <div style="height: 40px;">
        <select id="dashboard-select">
          <option value="Campaigns">Campaigns</option>
          <option value="Sales">Sales</option>      
          <option value="Marketing">Marketing</option>
        </select>
      </div>

      <div style="height: calc(100% - 40px);">
        <rv-dashboard-viewer id="dashboard-viewer" dashboard="Campaigns"></rv-dashboard-viewer>
      </div>     
    `;

    const selectElement = this.querySelector('#dashboard-select') as HTMLSelectElement;
    const dashboardViewer = this.querySelector('#dashboard-viewer') as RvDashboardViewer;    

    selectElement.addEventListener('change', (event: Event) => {
      const selectedDashboard = (event.target as HTMLSelectElement).value;
      dashboardViewer.dashboard = selectedDashboard;
    });
  }
}
customElements.define('app-root', AppElement);
