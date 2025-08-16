import PDFDocument from 'pdfkit';
import fs from 'fs';

export async function generateInvoice({ auction, buyer, seller, amount }) {
  const file = `/tmp/invoice-${auction.id}.pdf`;
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(file);
    doc.pipe(stream);
    doc.fontSize(20).text('Auction Invoice', { align: 'center' });
    doc.moveDown();
    doc.text(`Auction: ${auction.title}`);
    doc.text(`Seller: ${seller.name} <${seller.email}>`);
    doc.text(`Buyer: ${buyer.name} <${buyer.email}>`);
    doc.text(`Amount: $${amount / 100}`);
    doc.text(`Auction ID: ${auction.id}`);
    doc.end();
    stream.on('finish', () => resolve(file));
  });
}