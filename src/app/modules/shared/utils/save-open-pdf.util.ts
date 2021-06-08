import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export function openPDF(data, fileName: string): void {
  html2canvas(data,{
    width:1054
  }).then(canvas => {

    let fileWidth = 208;
    let fileHeight = canvas.height * fileWidth / canvas.width;

    const img = canvas.toDataURL('image/png', 0.7);
    let PDF = new jsPDF('p', 'mm', [210, 297], true);
    let position = 5;
    PDF.addImage(img, 'PNG', 0, position, fileWidth, fileHeight)
    PDF.save(fileName + '.pdf');
  });
}
