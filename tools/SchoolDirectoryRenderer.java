import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.RenderingHints;
import java.awt.geom.Rectangle2D;
import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import javax.imageio.ImageIO;

public class SchoolDirectoryRenderer {
  private static final int[] COLS = {125, 510, 895, 1280, 1665, 2050};
  private static final int[] ROWS = {602, 1105, 1607, 2110, 2612};

  private static class StudentRow {
    String ref = "";
    String first = "";
    String last = "";
    String grade = "";
    String homeroom = "";
    String studentId = "";
    String group = "";
    String imagePath = "";
    boolean photographed = false;
  }

  private final File templateDir;
  private final File outputDir;
  private final String schoolName;
  private final String schoolYear;
  private final String contactLine;
  private final boolean breakOnGroup;
  private final ArrayList<StudentRow> students;
  private BufferedImage pageImage;
  private Graphics2D pageGraphics;
  private BufferedImage sticker;
  private int count = 2;
  private int position = 0;
  private String currentGroup = "";
  private boolean hasPageContent = false;

  public SchoolDirectoryRenderer(File templateDir, File outputDir, String schoolName, String schoolYear, String contactLine, boolean breakOnGroup, ArrayList<StudentRow> students) {
    this.templateDir = templateDir;
    this.outputDir = outputDir;
    this.schoolName = schoolName;
    this.schoolYear = schoolYear;
    this.contactLine = contactLine;
    this.breakOnGroup = breakOnGroup;
    this.students = students;
  }

  public static void main(String[] args) throws Exception {
    if (args.length < 7) {
      throw new IllegalArgumentException("Usage: SchoolDirectoryRenderer <templateDir> <outputDir> <schoolName64> <schoolYear64> <contactLine64> <breakOnGroup> <subjectsTsv>");
    }

    File templateDir = new File(args[0]);
    File outputDir = new File(args[1]);
    String schoolName = decode(args[2]);
    String schoolYear = decode(args[3]);
    String contactLine = decode(args[4]);
    boolean breakOnGroup = Boolean.parseBoolean(args[5]);
    ArrayList<StudentRow> students = readStudents(new File(args[6]));
    outputDir.mkdirs();

    new SchoolDirectoryRenderer(templateDir, outputDir, schoolName, schoolYear, contactLine, breakOnGroup, students).render();
  }

  private static String decode(String value) {
    return new String(Base64.getDecoder().decode(value), StandardCharsets.UTF_8);
  }

  private static ArrayList<StudentRow> readStudents(File file) throws Exception {
    ArrayList<StudentRow> rows = new ArrayList<StudentRow>();
    BufferedReader reader = new BufferedReader(new FileReader(file, StandardCharsets.UTF_8));
    try {
      String line;
      while ((line = reader.readLine()) != null) {
        if (line.trim().isEmpty()) {
          continue;
        }
        String[] parts = line.split("\t", -1);
        StudentRow row = new StudentRow();
        row.ref = parts.length > 0 ? parts[0] : "";
        row.first = parts.length > 1 ? parts[1] : "";
        row.last = parts.length > 2 ? parts[2] : "";
        row.grade = parts.length > 3 ? parts[3] : "";
        row.homeroom = parts.length > 4 ? parts[4] : "";
        row.studentId = parts.length > 5 ? parts[5] : "";
        row.group = parts.length > 6 ? parts[6] : "";
        row.imagePath = parts.length > 7 ? parts[7] : "";
        row.photographed = parts.length > 8 && "true".equalsIgnoreCase(parts[8]);
        rows.add(row);
      }
    } finally {
      reader.close();
    }
    return rows;
  }

  private void render() throws Exception {
    renderCover();
    renderBlankInsidePage();
    newBlankPage();

    for (StudentRow student : students) {
      if (position > 0 && breakOnGroup && !student.group.equals(currentGroup)) {
        renderPage();
      } else if (position == 30) {
        renderPage();
      }
      if (position == 0) {
        currentGroup = student.group;
      }
      createCellBlock(student);
      writeToPage(position);
    }

    if (hasPageContent) {
      renderPage();
    }
    renderBlanksAndBackCover();
  }

  private void renderCover() throws Exception {
    BufferedImage cover = ImageIO.read(new File(templateDir, "Directory_Cover.jpg"));
    Graphics2D graphics = cover.createGraphics();
    try {
      graphics.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
      graphics.setColor(Color.white);
      int fontSize = 300;
      graphics.setFont(new Font("Myriad Pro", Font.PLAIN, fontSize));
      FontMetrics metrics = graphics.getFontMetrics();
      int width = metrics.stringWidth(schoolName);
      while (width > 2100 && fontSize > 20) {
        fontSize -= 1;
        graphics.setFont(new Font("Myriad Pro", Font.PLAIN, fontSize));
        metrics = graphics.getFontMetrics();
        width = metrics.stringWidth(schoolName);
      }
      graphics.drawString(schoolName, 1300 - (width / 2), 600);
    } finally {
      graphics.dispose();
    }
    writeImage(cover, "MugBook_" + schoolName + "_0.jpg");
  }

  private void renderBlankInsidePage() throws Exception {
    BufferedImage blank = new BufferedImage(2550, 3300, BufferedImage.TYPE_INT_RGB);
    Graphics2D graphics = blank.createGraphics();
    try {
      graphics.setColor(Color.white);
      graphics.fillRect(0, 0, 2550, 3300);
    } finally {
      graphics.dispose();
    }
    writeImage(blank, "MugBook_" + schoolName + "_1.jpg");
  }

  private void newBlankPage() {
    pageImage = new BufferedImage(2550, 3300, BufferedImage.TYPE_INT_RGB);
    pageGraphics = pageImage.createGraphics();
    pageGraphics.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
    pageGraphics.setColor(Color.white);
    pageGraphics.fillRect(0, 0, 2550, 3300);
    position = 0;
    hasPageContent = false;
  }

  private void createCellBlock(StudentRow student) {
    sticker = new BufferedImage(375, 489, BufferedImage.TYPE_INT_RGB);
    Graphics2D graphics = sticker.createGraphics();
    try {
      graphics.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
      graphics.setColor(Color.white);
      graphics.fillRect(0, 0, 375, 489);
      graphics.setFont(new Font("Arial", Font.PLAIN, 24));
      graphics.setColor(Color.black);
      graphics.drawRect(0, 0, 374, 488);
      graphics.drawString("Last: " + student.last, 27, 428);
      graphics.drawString("First: " + student.first, 27, 458);
      graphics.drawString(student.grade + " " + student.homeroom + "  " + student.studentId, 27, 487);

      if (student.photographed && student.imagePath != null && !student.imagePath.isEmpty()) {
        BufferedImage photo = ImageIO.read(new File(student.imagePath));
        if (photo != null) {
          if (photo.getWidth() > 320) {
            graphics.drawImage(photo.getScaledInstance(320, -1, Image.SCALE_SMOOTH), 27, 0, null);
          } else {
            graphics.drawImage(photo, 27, 0, null);
          }
          photo.flush();
        }
      } else {
        graphics.setFont(new Font("Arial", Font.PLAIN, 40));
        FontMetrics metrics = graphics.getFontMetrics();
        Rectangle2D rect = metrics.getStringBounds("NOT", graphics);
        graphics.drawString("NOT", 187 - ((int) rect.getWidth() / 2), 220);
        rect = metrics.getStringBounds("PHOTOGRAPHED", graphics);
        graphics.drawString("PHOTOGRAPHED", 187 - ((int) rect.getWidth() / 2), 270);
      }
    } catch (Exception error) {
      graphics.setFont(new Font("Arial", Font.PLAIN, 40));
      graphics.setColor(Color.black);
      graphics.drawString("NOT", 150, 220);
      graphics.drawString("PHOTOGRAPHED", 45, 270);
    } finally {
      graphics.dispose();
    }
  }

  private void writeToPage(int index) {
    hasPageContent = true;
    pageGraphics.drawImage(sticker, COLS[index % 6], ROWS[index / 6], null);
    position += 1;
  }

  private void renderPage() throws Exception {
    pageGraphics.setColor(Color.black);
    pageGraphics.setFont(new Font("Arial", Font.PLAIN, 100));
    FontMetrics metrics = pageGraphics.getFontMetrics();
    Rectangle2D rect = metrics.getStringBounds(schoolName, pageGraphics);
    pageGraphics.drawString(schoolName, 1275 - ((int) rect.getWidth() / 2), 200);

    pageGraphics.setFont(new Font("Arial", Font.PLAIN, 50));
    metrics = pageGraphics.getFontMetrics();
    rect = metrics.getStringBounds(schoolYear, pageGraphics);
    pageGraphics.drawString(schoolYear, 1275 - ((int) rect.getWidth() / 2), 270);
    rect = metrics.getStringBounds(currentGroup, pageGraphics);
    pageGraphics.drawString(currentGroup, 1275 - ((int) rect.getWidth() / 2), 340);
    rect = metrics.getStringBounds(contactLine, pageGraphics);
    pageGraphics.drawString(contactLine, 1275 - ((int) rect.getWidth() / 2), 3200);

    if (count % 2 != 0) {
      pageGraphics.drawString("Page: " + count, 100, 100);
    } else {
      rect = metrics.getStringBounds("Page: " + count, pageGraphics);
      pageGraphics.drawString("Page: " + count, 2450 - (int) rect.getWidth(), 100);
    }

    writeImage(pageImage, "MugBook_" + schoolName + "_" + count + ".jpg");
    count += 1;
    pageGraphics.dispose();
    pageImage.flush();
    newBlankPage();
  }

  private void renderBlanksAndBackCover() throws Exception {
    while ((count - 2) % 4 != 0) {
      writeImage(pageImage, "MugBook_" + schoolName + "_" + count + ".jpg");
      count += 1;
    }
    writeImage(pageImage, "MugBook_" + schoolName + "_" + count + ".jpg");
    count += 1;
    BufferedImage back = ImageIO.read(new File(templateDir, "Directory_Cover_BACK.jpg"));
    writeImage(back, "MugBook_" + schoolName + "_" + count + "LAST.jpg");
  }

  private void writeImage(BufferedImage image, String filename) throws Exception {
    ImageIO.write(image, "jpg", new File(outputDir, filename));
  }
}
