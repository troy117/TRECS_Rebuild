import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.Hashtable;

import javax.imageio.ImageIO;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;

public class QrCodePngTool {
  @SuppressWarnings({ "rawtypes", "unchecked" })
  public static void main(String[] args) throws Exception {
    if (args.length < 3) {
      throw new IllegalArgumentException("Usage: QrCodePngTool <text> <size> <output-path>");
    }

    String text = args[0];
    int size = Integer.parseInt(args[1]);
    File output = new File(args[2]);
    File parent = output.getParentFile();
    if (parent != null) {
      parent.mkdirs();
    }

    Hashtable hints = new Hashtable();
    hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.L);
    BitMatrix matrix = new QRCodeWriter().encode(text, BarcodeFormat.QR_CODE, size, size, hints);
    BufferedImage image = new BufferedImage(size, size, BufferedImage.TYPE_INT_RGB);
    Graphics2D graphics = image.createGraphics();
    graphics.setColor(Color.WHITE);
    graphics.fillRect(0, 0, size, size);
    graphics.setColor(Color.BLACK);
    for (int x = 0; x < size; x += 1) {
      for (int y = 0; y < size; y += 1) {
        if (matrix.get(x, y)) {
          graphics.fillRect(x, y, 1, 1);
        }
      }
    }
    graphics.dispose();
    ImageIO.write(image, "png", output);
  }
}
