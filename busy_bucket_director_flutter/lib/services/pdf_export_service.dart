import 'dart:typed_data';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';

/// Generates the Busy Bucket project documentation PDF from inside the app
/// (e.g. a "Download docs" button on the Director Profile/Reports screen).
class PdfExportService {
  static const PdfColor pineDark = PdfColor.fromInt(0xFF0F3D33);

  static Future<Uint8List> buildDocumentationPdf() async {
    final doc = pw.Document();

    doc.addPage(
      pw.MultiPage(
        pageFormat: PdfPageFormat.a4,
        margin: const pw.EdgeInsets.all(36),
        build: (context) => [
          pw.Text('Busy Bucket — Director Panel',
              style: pw.TextStyle(fontSize: 22, color: pineDark, fontWeight: pw.FontWeight.bold)),
          pw.SizedBox(height: 10),
          pw.Text(
            'Yeh PDF Director app ke andar se generate hui hai — pending Manager approvals, '
            'active Managers aur dashboard stats ka snapshot record rakhne ke liye.',
            style: const pw.TextStyle(fontSize: 11),
          ),
          // TODO: pull live stats/pending requests here and render as a table,
          // similar to busy_bucket_docs.dart's BusyBucketDocsPdf.build()
        ],
      ),
    );

    return doc.save();
  }

  /// Opens the system print/share sheet with the generated PDF.
  static Future<void> exportAndShare() async {
    final bytes = await buildDocumentationPdf();
    await Printing.layoutPdf(onLayout: (format) async => bytes);
  }
}
