export const theme = {
  light: {
    primary: '#8b59a0', // https://www.colorhexa.com/9464a9
    accent: '#19d5bc',
    background: '#fdfbfd',
    card: '#e2d6e8',
    text: '#1c1c1e',
    border: '#c0a3cc',
    notification: '#d55e19',
    palette: {
      gray: {
        100: '#ECECED',
        300: '#868E96',
        600: '#3F4A55',
        900: '#11141E'
      }
    }
  },
  dark: {
    primary: '#756896', // https://www.colorhexa.com/24202e
    accent: '#16bea7',
    background: '#121017',
    card: '#3f3851',
    text: '#f1f1f1',
    border: '#2d283a',
    notification: '#d55e19',
    palette: {
      gray: {
        100: '#D9D9DB',
        300: '#B3B4B7',
        600: '#707278',
        900: '#3F4A55'
      }
    }
  }
} as const
