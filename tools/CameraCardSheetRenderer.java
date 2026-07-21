import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import javax.imageio.ImageIO;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.oned.Code128Writer;

public class CameraCardSheetRenderer {
  private static final int SHEET_WIDTH = 5100;
  private static final int SHEET_HEIGHT = 3300;
  private static final int CARD_WIDTH = 1275;
  private static final int CARD_HEIGHT = 825;
  private static final int CARDS_PER_SHEET = 16;

  private static class SubjectRow {
    String ref = "";
    String first = "";
    String last = "";
    String grade = "";
    String homeroom = "";
    String track = "";
    String studentId = "";
  }

  public static void main(String[] args) throws Exception {
    if (args.length < 4) {
      throw new IllegalArgumentException("Usage: CameraCardSheetRenderer <outputFile> <schoolName64> <subjectsTsv> <pageLabel64>");
    }

    File outputFile = new File(args[0]);
    String schoolName = decode(args[1]);
    ArrayList<SubjectRow> subjects = readSubjects(new File(args[2]));
    String pageLabel = decode(args[3]);

    new CameraCardSheetRenderer(outputFile, schoolName, subjects, pageLabel).render();
  }

  private static String decode(String value) {
    return new String(Base64.getDecoder().decode(value), StandardCharsets.UTF_8);
  }

  private static ArrayList<SubjectRow> readSubjects(File file) throws Exception {
    ArrayList<SubjectRow> rows = new ArrayList<SubjectRow>();
    BufferedReader reader = new BufferedReader(new FileReader(file, StandardCharsets.UTF_8));
    try {
      String line;
      while ((line = reader.readLine()) != null) {
        if (line.trim().isEmpty()) {
          continue;
        }
        String[] parts = line.split("\t", -1);
        SubjectRow row = new SubjectRow();
        row.ref = parts.length > 0 ? parts[0] : "";
        row.first = parts.length > 1 ? parts[1] : "";
        row.last = parts.length > 2 ? parts[2] : "";
        row.grade = parts.length > 3 ? parts[3] : "";
        row.homeroom = parts.length > 4 ? parts[4] : "";
        row.track = parts.length > 5 ? parts[5] : "";
        row.studentId = parts.length > 6 ? parts[6] : "";
        rows.add(row);
      }
    } finally {
      reader.close();
    }
    return rows;
  }

  private final File outputFile;
  private final String schoolName;
  private final ArrayList<SubjectRow> subjects;
  private final String pageLabel;

  public CameraCardSheetRenderer(File outputFile, String schoolName, ArrayList<SubjectRow> subjects, String pageLabel) {
    this.outputFile = outputFile;
    this.schoolName = schoolName == null ? "" : schoolName;
    this.subjects = subjects;
    this.pageLabel = pageLabel == null || pageLabel.trim().isEmpty() ? "CCPage" : pageLabel.trim();
  }

  private void render() throws Exception {
    if (subjects.isEmpty()) {
      throw new IllegalArgumentException("No camera card subjects were provided");
    }

    File parent = outputFile.getParentFile();
    if (parent != null) {
      parent.mkdirs();
    }

    int pageCount = subjects.size() / CARDS_PER_SHEET;
    if (subjects.size() % CARDS_PER_SHEET != 0) {
      pageCount += 1;
    }

    String stem = outputStem(outputFile);
    for (int page = 0; page < pageCount; page += 1) {
      BufferedImage sheet = createSheet();
      Graphics2D graphics = sheet.createGraphics();
      try {
        graphics.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
        graphics.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BICUBIC);
        for (int card = 0; card < CARDS_PER_SHEET; card += 1) {
          int subjectIndex = (card * pageCount) + page;
          if (subjectIndex >= subjects.size()) {
            continue;
          }
          BufferedImage cardImage = createStudentCard(subjects.get(subjectIndex));
          graphics.drawImage(cardImage, (card % 4) * CARD_WIDTH, (card / 4) * CARD_HEIGHT, null);
          cardImage.flush();
        }

        graphics.setColor(Color.black);
        graphics.setFont(new Font("Arial", Font.PLAIN, 25));
        graphics.drawString(pageLabel + "_" + (page + 1) + "_STACK CUT", 2180, 75);
        graphics.drawString("Page " + (page + 1) + " of " + pageCount, 2400, 3260);
      } finally {
        graphics.dispose();
      }

      File pageFile = page == 0
        ? outputFile
        : new File(outputFile.getParentFile(), stem + "_" + (page + 1) + "_StackCut.jpg");
      ImageIO.write(sheet, "jpg", pageFile);
      sheet.flush();
    }
  }

  private BufferedImage createSheet() {
    BufferedImage image = new BufferedImage(SHEET_WIDTH, SHEET_HEIGHT, BufferedImage.TYPE_INT_RGB);
    Graphics2D graphics = image.createGraphics();
    try {
      graphics.setColor(Color.white);
      graphics.fillRect(0, 0, SHEET_WIDTH, SHEET_HEIGHT);
    } finally {
      graphics.dispose();
    }
    return image;
  }

  private BufferedImage createStudentCard(SubjectRow subject) {
    BufferedImage card = new BufferedImage(CARD_WIDTH, CARD_HEIGHT, BufferedImage.TYPE_INT_RGB);
    Graphics2D graphics = card.createGraphics();
    try {
      graphics.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
      graphics.setColor(Color.white);
      graphics.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
      graphics.setColor(Color.black);

      BufferedImage strip = createSideStrip(subject);
      graphics.drawImage(rotateCounterClockwise(strip), 0, 0, null);
      strip.flush();

      graphics.setFont(new Font("Arial", Font.PLAIN, 50));
      drawFittingText(graphics, displayName(subject), 250, 140, 930, 50);
      graphics.drawString("Grade: " + subject.grade, 250, 400);
      graphics.drawString("Homeroom: " + subject.homeroom, 250, 460);
      graphics.drawString("Track: " + subject.track, 250, 520);
      graphics.drawString(subject.studentId, 250, 580);
      drawBarcode(graphics, subject.ref, 250, 635, 850, 100);
      graphics.setFont(new Font("Arial", Font.PLAIN, 32));
      graphics.drawString(subject.ref, 250, 775);
    } finally {
      graphics.dispose();
    }
    return card;
  }

  private BufferedImage createSideStrip(SubjectRow subject) {
    BufferedImage strip = new BufferedImage(825, 200, BufferedImage.TYPE_INT_RGB);
    Graphics2D graphics = strip.createGraphics();
    try {
      graphics.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
      graphics.setColor(Color.white);
      graphics.fillRect(0, 0, 825, 200);
      graphics.setColor(Color.black);
      graphics.setFont(new Font("Arial", Font.PLAIN, 50));
      drawFittingText(graphics, subject.grade + "     " + displayName(subject), 70, 120, 700, 50);
      drawFittingText(graphics, subject.ref + " - " + schoolName, 70, 180, 700, 50);
    } finally {
      graphics.dispose();
    }
    return strip;
  }

  private BufferedImage rotateCounterClockwise(BufferedImage image) {
    BufferedImage rotated = new BufferedImage(image.getHeight(), image.getWidth(), BufferedImage.TYPE_INT_RGB);
    Graphics2D graphics = rotated.createGraphics();
    try {
      graphics.setColor(Color.white);
      graphics.fillRect(0, 0, rotated.getWidth(), rotated.getHeight());
      AffineTransform transform = new AffineTransform();
      transform.translate(0, image.getWidth());
      transform.rotate(Math.toRadians(-90));
      graphics.drawImage(image, transform, null);
    } finally {
      graphics.dispose();
    }
    return rotated;
  }

  private void drawBarcode(Graphics2D graphics, String value, int x, int y, int width, int height) {
    String text = value == null ? "" : value.trim();
    if (text.isEmpty()) {
      return;
    }
    try {
      BitMatrix matrix = new Code128Writer().encode(text, BarcodeFormat.CODE_128, width, height);
      graphics.setColor(Color.white);
      graphics.fillRect(x, y, width, height);
      graphics.setColor(Color.black);
      for (int px = 0; px < width; px += 1) {
        for (int py = 0; py < height; py += 1) {
          if (matrix.get(px, py)) {
            graphics.fillRect(x + px, y + py, 1, 1);
          }
        }
      }
    } catch (Exception _error) {
      graphics.setFont(new Font("Arial", Font.PLAIN, 50));
      graphics.drawString(text, x, y + 70);
    }
  }

  private void drawFittingText(Graphics2D graphics, String text, int x, int y, int maxWidth, int initialSize) {
    String value = text == null ? "" : text;
    Font base = graphics.getFont();
    int size = initialSize;
    Font font = new Font(base.getName(), base.getStyle(), size);
    graphics.setFont(font);
    FontMetrics metrics = graphics.getFontMetrics();
    while (metrics.stringWidth(value) > maxWidth && size > 18) {
      size -= 2;
      font = new Font(base.getName(), base.getStyle(), size);
      graphics.setFont(font);
      metrics = graphics.getFontMetrics();
    }
    graphics.drawString(value, x, y);
    graphics.setFont(base);
  }

  private String displayName(SubjectRow subject) {
    String last = subject.last == null ? "" : subject.last.trim();
    String first = subject.first == null ? "" : subject.first.trim();
    if (!last.isEmpty() && !first.isEmpty()) {
      return last + ", " + first;
    }
    return (last + " " + first).trim();
  }

  private String outputStem(File file) {
    String name = file.getName();
    int dot = name.lastIndexOf('.');
    return dot > 0 ? name.substring(0, dot) : name;
  }
}
