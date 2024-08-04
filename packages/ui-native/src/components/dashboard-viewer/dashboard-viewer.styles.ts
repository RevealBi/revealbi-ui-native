import { css } from "lit";
import componentStyles from "../../styles/component.styles";

export default css`
    ${componentStyles}

    :host {
      display: block;
      height: 100%;
    }    

    .dashboard-container {
      padding: 10px;
      height: 100%;
    }
      
    .header {
      font-size: var(--rv-font-size-2x-large);
      font-weight: bold;
      height: 50px;
      margin-bottom: 10px;
    }

    .layout {
      height: calc(100% - 60px);
    }
`;