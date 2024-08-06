import { css } from "lit";
import componentStyles from "../../styles/component.styles";

export default css`
    ${componentStyles}

    :host {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: auto auto 1fr;
      padding: 10px;
      height: 100%;
    }
      
    .header {
      grid-row: 1;
      font-size: var(--rv-font-size-2x-large);
      font-weight: bold;
      margin-bottom: 10px;
    }

    .filters {
      grid-row: 2;
      margin-bottom: 10px;
    }

    .layout {
      grid-row: 3;
    }
`;