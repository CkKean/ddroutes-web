import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export function openPDF(data, fileName: string, dimension: { width: number, height: number }): void {
  html2canvas(data, {
    width: dimension.width - (dimension.width * (22 / 100)),
  }).then(canvas => {
    let fileWidth = 208;
    let fileHeight = canvas.height * fileWidth / canvas.width;

    const img = canvas.toDataURL('image/png', 0.7);
    let PDF = new jsPDF('p', 'mm', [297, 210], true);
    let position = 5;
    PDF.addImage(img, 'PNG', 0, position, fileWidth, fileHeight)
    PDF.save(fileName + '.pdf');
  });
}
