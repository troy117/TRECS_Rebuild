import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.File;
import javax.imageio.ImageIO;

public class DeliveryEnvelopeCoverRenderer {
  public static void main(String[] args) throws Exception {
    if (args.length < 3) {
      throw new IllegalArgumentException("Usage: DeliveryEnvelopeCoverRenderer <template> <output> <schoolName>");
    }

    File template = new File(args[0]);
    File output = new File(args[1]);
    String schoolName = args[2] == null ? "" : args[2];

    BufferedImage envelope = ImageIO.read(template);
    if (envelope == null) {
      throw new IllegalArgumentException("Could not read template: " + template.getAbsolutePath());
    }

    Graphics2D graphics = envelope.createGraphics();
    try {
      graphics.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
      graphics.setColor(Color.black);
      int fontSize = 200;
      Font font = new Font("Myriad Pro", Font.PLAIN, fontSize);
      graphics.setFont(font);
      FontMetrics metrics = graphics.getFontMetrics();
      int width = metrics.stringWidth(schoolName);
      while (width > 2400 && fontSize > 20) {
        fontSize -= 1;
        font = new Font("Myriad Pro", Font.PLAIN, fontSize);
        graphics.setFont(font);
        metrics = graphics.getFontMetrics();
        width = metrics.stringWidth(schoolName);
      }
      graphics.drawString(schoolName, 300, 1000);
    } finally {
      graphics.dispose();
    }

    File parent = output.getParentFile();
    if (parent != null) {
      parent.mkdirs();
    }
    ImageIO.write(envelope, "jpg", output);
    envelope.flush();
  }
}
