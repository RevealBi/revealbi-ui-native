import { css } from 'lit';

export default css`
  :host {
    box-sizing: border-box;

    font-family: var(--rv-font-family);
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }

  [hidden] {
    display: none !important;
  }
`;