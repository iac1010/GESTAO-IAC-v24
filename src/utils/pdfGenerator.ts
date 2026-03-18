import { jsPDF } from 'jspdf';
import { toCanvas } from 'html-to-image';

export async function generatePdf(element: HTMLElement, fileName: string, format: string = 'a4') {
  try {
    console.log(`Iniciando geração de PDF (Motor: html-to-image + jsPDF, Formato: ${format}) para:`, fileName);
    
    // Garantir que as imagens estão carregadas
    const images = Array.from(element.getElementsByTagName('img'));
    await Promise.all(images.map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    }));

    // Pequeno delay para estabilização e renderização completa
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Captura o elemento como canvas usando html-to-image (mais robusto que html2canvas para CSS moderno)
    const canvas = await toCanvas(element, {
      backgroundColor: '#ffffff',
      pixelRatio: 2,
      skipFonts: false,
      fontEmbedCSS: '',
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left',
      }
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF('p', 'mm', format as any);
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgProps = pdf.getImageProperties(imgData);
    const margin = 10; // 10mm de margem
    const contentWidth = pdfWidth - (margin * 2);
    const contentHeight = (imgProps.height * contentWidth) / imgProps.width;
    
    let heightLeft = contentHeight;
    let position = margin;

    // Adiciona a primeira página
    pdf.addImage(imgData, 'JPEG', margin, position, contentWidth, contentHeight);
    heightLeft -= (pdfHeight - (margin * 2));

    // Adiciona páginas subsequentes se o conteúdo for maior que uma página
    while (heightLeft > 0) {
      position = heightLeft - contentHeight + margin;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', margin, position, contentWidth, contentHeight);
      heightLeft -= (pdfHeight - (margin * 2));
    }

    pdf.save(fileName);
    console.log('PDF gerado com sucesso via html-to-image + jsPDF');
    return true;
  } catch (error) {
    console.error('Erro crítico na geração do PDF:', error);
    throw new Error(error instanceof Error ? error.message : 'Falha na geração do PDF');
  }
}
