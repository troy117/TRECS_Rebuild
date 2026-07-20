import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.RenderingHints;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import javax.imageio.ImageIO;
import org.json.JSONObject;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.oned.Code128Writer;

public class IdCardSheetRenderer {
  private static final int SHEET_WIDTH = 3600;
  private static final int SHEET_HEIGHT = 5400;
  private static final int CARD_WIDTH = 1128;
  private static final int CARD_HEIGHT = 702;
  private static final int[][] POSITIONS = {
    {112, 244}, {1240, 244}, {2368, 244},
    {112, 946}, {1240, 946}, {2368, 946},
    {112, 1648}, {1240, 1648}, {2368, 1648},
    {112, 2350}, {1240, 2350}, {2368, 2350},
    {112, 3052}, {1240, 3052}, {2368, 3052},
    {112, 3754}, {1240, 3754}, {2368, 3754},
    {112, 4456}, {1240, 4456}, {2368, 4456}
  };

  public static void main(String[] args) throws Exception {
    if (args.length < 6) {
      throw new IllegalArgumentException("Usage: IdCardSheetRenderer <jobRoot> <outputFile> <studentTemplateJson> <staffTemplateJson> <subjectsTsv> <schoolYear64> [overrideBackground] [individual]");
    }
    File jobRoot = new File(args[0]);
    File outputFile = new File(args[1]);
    JSONObject studentTemplate = readTemplate(args[2]);
    JSONObject staffTemplate = readTemplate(args[3]);
    ArrayList<SubjectRow> subjects = readSubjects(new File(args[4]));
    String schoolYear = new String(Base64.getDecoder().decode(args[5]), StandardCharsets.UTF_8);
    String overrideBackground = args.length > 6 ? args[6] : "";
    boolean individual = args.length > 7 && Boolean.parseBoolean(args[7]);

    IdCardSheetRenderer renderer = new IdCardSheetRenderer(jobRoot, outputFile, studentTemplate, staffTemplate, schoolYear, overrideBackground);
    if (individual) {
      renderer.renderIndividuals(subjects);
    } else {
      renderer.renderSheets(subjects);
    }
  }

  private final File jobRoot;
  private final File outputFile;
  private final File backgroundFolder;
  private final JSONObject studentTemplate;
  private final JSONObject staffTemplate;
  private final String schoolYear;
  private final String overrideBackground;

  public IdCardSheetRenderer(File jobRoot, File outputFile, JSONObject studentTemplate, JSONObject staffTemplate, String schoolYear, String overrideBackground) {
    this.jobRoot = jobRoot;
    this.outputFile = outputFile;
    this.backgroundFolder = new File(jobRoot, "ID_Templates");
    this.studentTemplate = studentTemplate;
    this.staffTemplate = staffTemplate;
    this.schoolYear = schoolYear;
    this.overrideBackground = overrideBackground == null ? "" : overrideBackground.trim();
  }

  private void renderSheets(ArrayList<SubjectRow> subjects) throws Exception {
    outputFile.getParentFile().mkdirs();
    BufferedImage sheet = createSheet();
    Graphics2D sheetGraphics = sheet.createGraphics();
    configureGraphics(sheetGraphics);
    int page = 1;
    int index = 0;
    int totalPages = Math.max(1, (int)Math.ceil(subjects.size() / 21.0));

    for (SubjectRow subject : subjects) {
      if (index > 0 && index % 21 == 0) {
        drawPageNumber(sheetGraphics, page, totalPages);
        writePage(sheet, page);
        page += 1;
        sheetGraphics.dispose();
        sheet = createSheet();
        sheetGraphics = sheet.createGraphics();
        configureGraphics(sheetGraphics);
      }
      BufferedImage card = renderCard(subject);
      int[] position = POSITIONS[index % 21];
      sheetGraphics.drawImage(card, position[0], position[1], null);
      index += 1;
    }

    if (index > 0) {
      drawPageNumber(sheetGraphics, page, totalPages);
      writePage(sheet, page);
    }
    sheetGraphics.dispose();
  }

  private void renderIndividuals(ArrayList<SubjectRow> subjects) throws Exception {
    outputFile.getParentFile().mkdirs();
    String stem = stripExtension(outputFile.getName());
    for (int i = 0; i < subjects.size(); i += 1) {
      BufferedImage card = renderCard(subjects.get(i));
      File output = new File(outputFile.getParentFile(), stem + "_" + String.format("%05d", i + 1) + ".jpg");
      ImageIO.write(card, "jpg", output);
    }
  }

  private BufferedImage renderCard(SubjectRow subject) throws Exception {
    JSONObject template = isStaff(subject) ? staffTemplate : studentTemplate;
    int cardWidth = template.optJSONObject("card") == null ? CARD_WIDTH : template.optJSONObject("card").optInt("width", CARD_WIDTH);
    int cardHeight = template.optJSONObject("card") == null ? CARD_HEIGHT : template.optJSONObject("card").optInt("height", CARD_HEIGHT);
    BufferedImage card = new BufferedImage(cardWidth, cardHeight, BufferedImage.TYPE_INT_RGB);
    Graphics2D graphics = card.createGraphics();
    configureGraphics(graphics);

    BufferedImage background = loadBackground(subject);
    graphics.setColor(Color.white);
    graphics.fillRect(0, 0, cardWidth, cardHeight);
    if (background != null) {
      graphics.drawImage(background, 0, 0, cardWidth, cardHeight, null);
    }

    JSONObject elements = template.optJSONObject("elements");
    if (elements != null) {
      for (String key : elements.keySet()) {
        JSONObject element = elements.optJSONObject(key);
        if (element == null || !element.optBoolean("enabled", true)) {
          continue;
        }
        String kind = element.optString("kind", "text");
        if ("photo".equals(kind)) {
          drawPhoto(graphics, subject, element);
        } else if ("barcode".equals(kind)) {
          drawBarcode(graphics, subject, element);
        } else if ("text".equals(kind)) {
          drawText(graphics, subject, element);
        }
      }
    }
    graphics.dispose();

    if (card.getHeight() > card.getWidth()) {
      return rotateClockwise(card);
    }
    return card;
  }

  private BufferedImage loadBackground(SubjectRow subject) {
    String backgroundName = overrideBackground.length() > 0 ? overrideBackground : backgroundNameForSubject(subject);
    if (backgroundName.length() == 0) {
      return null;
    }
    File file = new File(backgroundFolder, backgroundName);
    if (!file.exists()) {
      return null;
    }
    try {
      return ImageIO.read(file);
    } catch (Exception _error) {
      return null;
    }
  }

  private String backgroundNameForSubject(SubjectRow subject) {
    if (isStaff(subject)) {
      return "FAC.jpg";
    }
    String grade = subject.grade.trim().toUpperCase();
    if (grade.equals("TK")) {
      return "TK.jpg";
    }
    if (grade.equals("KIN") || grade.equals("K") || grade.equals("KG") || grade.equals("KINDER")) {
      return "KIN.jpg";
    }
    try {
      int gradeNumber = Integer.parseInt(grade);
      if (gradeNumber >= 1 && gradeNumber <= 9) {
        return "0" + gradeNumber + ".jpg";
      }
      if (gradeNumber >= 10 && gradeNumber <= 12) {
        return gradeNumber + ".jpg";
      }
    } catch (NumberFormatException _error) {
      // Keep checking non-numeric grade aliases below.
    }
    return grade.length() > 0 ? grade + ".jpg" : "";
  }

  private void drawPhoto(Graphics2D graphics, SubjectRow subject, JSONObject element) {
    if (subject.imagePath.length() == 0) {
      return;
    }
    File imageFile = new File(subject.imagePath);
    if (!imageFile.isAbsolute()) {
      imageFile = new File(jobRoot.getParentFile().getParentFile(), subject.imagePath);
    }
    if (!imageFile.exists()) {
      return;
    }
    try {
      BufferedImage photo = ImageIO.read(imageFile);
      if (photo == null) {
        return;
      }
      int x = element.optInt("x");
      int y = element.optInt("y");
      int w = element.optInt("w");
      int h = element.optInt("h", (int)Math.round(w * 1.25));
      graphics.setColor(Color.black);
      graphics.fillRect(x - 3, y - 3, w + 6, h + 6);
      drawCover(graphics, photo, x, y, w, h);
    } catch (Exception _error) {
      // Missing/corrupt photos should not stop a whole school render.
    }
  }

  private void drawText(Graphics2D graphics, SubjectRow subject, JSONObject element) {
    String text = fieldValue(subject, element.optString("field"));
    if (text.length() == 0) {
      return;
    }
    int x = element.optInt("x");
    int y = element.optInt("y");
    int w = Math.max(1, element.optInt("w", 200));
    int h = Math.max(1, element.optInt("h", element.optInt("size", 32) + 8));
    int size = Math.max(4, element.optInt("size", 32));
    String fontName = element.optString("font", "Arial");
    String align = element.optString("align", "left");
    graphics.setColor(parseColor(element.optString("color", "#000000")));
    Font font = new Font(fontName, Font.BOLD, size);
    graphics.setFont(font);
    FontMetrics metrics = graphics.getFontMetrics();
    while (metrics.stringWidth(text) > w && size > 4) {
      size -= 1;
      font = new Font(fontName, Font.BOLD, size);
      graphics.setFont(font);
      metrics = graphics.getFontMetrics();
    }
    int drawX = x;
    int textWidth = metrics.stringWidth(text);
    if ("center".equals(align)) {
      drawX = x + ((w - textWidth) / 2);
    } else if ("right".equals(align)) {
      drawX = x + w - textWidth;
    }
    int drawY = y + ((h - metrics.getHeight()) / 2) + metrics.getAscent();
    graphics.drawString(text, drawX, drawY);
  }

  private void drawBarcode(Graphics2D graphics, SubjectRow subject, JSONObject element) {
    String value = subject.studentId.length() > 0 ? subject.studentId : subject.ref;
    if (value.length() == 0) {
      return;
    }
    try {
      int w = Math.max(40, element.optInt("w", 240));
      int h = Math.max(20, element.optInt("size", element.optInt("h", 70)));
      BitMatrix matrix = new Code128Writer().encode(value, BarcodeFormat.CODE_128, w, h);
      BufferedImage barcode = new BufferedImage(matrix.getWidth(), matrix.getHeight(), BufferedImage.TYPE_INT_RGB);
      for (int y = 0; y < matrix.getHeight(); y += 1) {
        for (int x = 0; x < matrix.getWidth(); x += 1) {
          barcode.setRGB(x, y, matrix.get(x, y) ? Color.black.getRGB() : Color.white.getRGB());
        }
      }
      graphics.drawImage(barcode, element.optInt("x"), element.optInt("y"), w, h, null);
    } catch (Exception _error) {
      // Do not stop the full batch for one bad barcode value.
    }
  }

  private String fieldValue(SubjectRow subject, String field) {
    if ("fullName".equals(field)) return (subject.firstName + " " + subject.lastName).trim();
    if ("firstName".equals(field)) return subject.firstName;
    if ("lastName".equals(field)) return subject.lastName;
    if ("homeroom".equals(field)) return subject.homeroom.length() > 0 ? "HR: " + subject.homeroom : "";
    if ("studentId".equals(field)) return subject.studentId.length() > 0 ? "ID #: " + subject.studentId : "";
    if ("extra1".equals(field)) return subject.track;
    if ("extra2".equals(field)) return subject.team;
    if ("year".equals(field)) return schoolYear;
    return "";
  }

  private boolean isStaff(SubjectRow subject) {
    String grade = subject.grade.trim().toUpperCase();
    String type = subject.subjectType.trim().toLowerCase();
    return grade.equals("FAC") || grade.equals("STAFF") || type.contains("staff") || type.contains("faculty");
  }

  private void writePage(BufferedImage sheet, int page) throws Exception {
    File output = page == 1
      ? outputFile
      : new File(outputFile.getParentFile(), stripExtension(outputFile.getName()) + "_" + String.format("%03d", page) + ".jpg");
    ImageIO.write(sheet, "jpg", output);
  }

  private void drawPageNumber(Graphics2D graphics, int page, int totalPages) {
    String label = "Page " + page + " of " + totalPages;
    graphics.setColor(Color.black);
    graphics.setFont(new Font("Arial", Font.PLAIN, 50));
    FontMetrics metrics = graphics.getFontMetrics();
    int x = (SHEET_WIDTH - metrics.stringWidth(label)) / 2;
    graphics.drawString(label, x, 5350);
  }

  private BufferedImage createSheet() {
    BufferedImage image = new BufferedImage(SHEET_WIDTH, SHEET_HEIGHT, BufferedImage.TYPE_INT_RGB);
    Graphics2D graphics = image.createGraphics();
    graphics.setColor(Color.white);
    graphics.fillRect(0, 0, SHEET_WIDTH, SHEET_HEIGHT);
    graphics.dispose();
    return image;
  }

  private static JSONObject readTemplate(String path) throws Exception {
    return new JSONObject(new String(Files.readAllBytes(new File(path).toPath()), StandardCharsets.UTF_8));
  }

  private static ArrayList<SubjectRow> readSubjects(File file) throws Exception {
    ArrayList<SubjectRow> rows = new ArrayList<SubjectRow>();
    BufferedReader reader = new BufferedReader(new FileReader(file));
    try {
      String line;
      while ((line = reader.readLine()) != null) {
        if (line.trim().length() == 0) {
          continue;
        }
        String[] parts = line.split("\t", -1);
        rows.add(new SubjectRow(parts));
      }
    } finally {
      reader.close();
    }
    return rows;
  }

  private static void drawCover(Graphics2D graphics, BufferedImage image, int x, int y, int w, int h) {
    double scale = Math.max((double)w / image.getWidth(), (double)h / image.getHeight());
    int scaledW = (int)Math.round(image.getWidth() * scale);
    int scaledH = (int)Math.round(image.getHeight() * scale);
    int drawX = x + ((w - scaledW) / 2);
    int drawY = y + ((h - scaledH) / 2);
    Image scaled = image.getScaledInstance(scaledW, scaledH, Image.SCALE_SMOOTH);
    graphics.setClip(x, y, w, h);
    graphics.drawImage(scaled, drawX, drawY, null);
    graphics.setClip(null);
  }

  private static BufferedImage rotateClockwise(BufferedImage image) {
    BufferedImage rotated = new BufferedImage(image.getHeight(), image.getWidth(), BufferedImage.TYPE_INT_RGB);
    Graphics2D graphics = rotated.createGraphics();
    configureGraphics(graphics);
    AffineTransform transform = new AffineTransform();
    transform.translate(image.getHeight(), 0);
    transform.rotate(Math.toRadians(90));
    graphics.drawImage(image, transform, null);
    graphics.dispose();
    return rotated;
  }

  private static Color parseColor(String value) {
    try {
      return Color.decode(value);
    } catch (Exception _error) {
      String text = value == null ? "" : value.toLowerCase();
      if (text.equals("white")) return Color.white;
      if (text.equals("red")) return Color.red;
      return Color.black;
    }
  }

  private static void configureGraphics(Graphics2D graphics) {
    graphics.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
    graphics.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BICUBIC);
    graphics.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
  }

  private static String stripExtension(String name) {
    int index = name.lastIndexOf('.');
    return index > 0 ? name.substring(0, index) : name;
  }

  private static class SubjectRow {
    String ref = "";
    String firstName = "";
    String lastName = "";
    String studentId = "";
    String grade = "";
    String homeroom = "";
    String track = "";
    String team = "";
    String subjectType = "";
    String imagePath = "";

    SubjectRow(String[] parts) {
      ref = value(parts, 0);
      firstName = value(parts, 1);
      lastName = value(parts, 2);
      studentId = value(parts, 3);
      grade = value(parts, 4);
      homeroom = value(parts, 5);
      track = value(parts, 6);
      team = value(parts, 7);
      subjectType = value(parts, 8);
      imagePath = value(parts, 9);
    }

    private static String value(String[] parts, int index) {
      return index < parts.length ? parts[index].trim() : "";
    }
  }
}
