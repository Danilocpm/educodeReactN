export const lightTheme = {
  // --- Fundo ---
  // Um cinza muito claro para o fundo principal, em vez de branco puro
  background: '#f0f2f5', 
  // Fundo dos cards e componentes de interface (ex: ícone de perfil)
  cardBackground: '#ffffff', 
  
  // --- Texto ---
  // Cor de texto primária (títulos, nomes), usando o azul escuro do tema dark
  textPrimary: 'rgba(10, 15, 33, 1)', 
  // Cor de texto secundária (legendas, texto "Bem Vindo")
  textSecondary: '#666666', 
  
  // --- Ícones ---
  // Cor dos ícones, alinhada com o texto primário
  iconColor: 'rgba(10, 15, 33, 1)', 
  
  // --- Cores de Destaque ---
  // Cor primária do aplicativo (botões, ícones de ação)
  primary: '#007aff',
  // Cor de texto sobre elementos com cor primária
  primaryText: '#ffffff',
  
  // --- Bordas e Sombras ---
  // Borda para divisores e contêineres
  border: 'rgba(0, 0, 0, 0.15)',
  borderColor: 'rgba(0, 0, 0, 0.15)',
  // Cor da sombra (geralmente preto, a opacidade é controlada no estilo)
  shadowColor: '#000000',
  // Opacidade da sombra (0 = sem sombra)
  shadowOpacity: 0.3,
  // Elevação (Android) (0 = sem elevação)
  elevation: 0,
  
  // --- Barra de Status ---
  // Define o estilo dos ícones da barra de status (ex: bateria, relógio)
  statusBar: 'dark-content', 
};

export const darkTheme = {
  // --- Fundo ---
  // O fundo principal da aplicação (azul bem escuro)
  background: 'rgba(10, 15, 33, 1)', 
  // Fundo de componentes (ex: ícone de perfil)
  cardBackground: '#1c1f3a', 
  
  // --- Texto ---
  // Cor de texto primária (títulos, nomes)
  textPrimary: '#ffffff', 
  // Cor de texto secundária (legendas, texto "Bem Vindo")
  textSecondary: '#aaa', 
  
  // --- Ícones ---
  // Cor dos ícones (ex: ícone de usuário)
  iconColor: '#ffffff', 
  
  // --- Cores de Destaque ---
  // Cor primária do aplicativo (botões, ícones de ação)
  primary: '#007aff',
  // Cor de texto sobre elementos com cor primária
  primaryText: '#ffffff',
  
  // --- Bordas e Sombras ---
  // Borda para divisores (branco com transparência)
  border: 'rgba(255, 255, 255, 0.1)',
  borderColor: 'rgba(255, 255, 255, 0.1)', 
  // Cor da sombra
  shadowColor: '#000000',
  // Opacidade da sombra
  shadowOpacity: 0.3,
  // Elevação (Android)
  elevation: 5,
  
  // --- Barra de Status ---
  // Define o estilo dos ícones da barra de status
  statusBar: 'light-content', 
};
