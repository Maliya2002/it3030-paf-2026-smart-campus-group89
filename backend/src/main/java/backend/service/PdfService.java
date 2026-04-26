package backend.service;

import backend.model.Resource;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.List;

public class PdfService {

    public static ByteArrayInputStream generate(List<Resource> list) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Paragraph title = new Paragraph("Resources Report", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);

            table.addCell("ID");
            table.addCell("Name");
            table.addCell("Type");
            table.addCell("Location");
            table.addCell("Capacity");

            for (Resource r : list) {
                table.addCell(String.valueOf(r.getId()));
                table.addCell(r.getName());
                table.addCell(r.getType());
                table.addCell(r.getLocation());
                table.addCell(String.valueOf(r.getCapacity()));
            }

            document.add(table);
            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }
}
