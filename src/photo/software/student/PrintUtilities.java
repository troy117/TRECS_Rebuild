package photo.software.student;

import java.awt.*;
import javax.swing.*;
import java.awt.print.*;

public class PrintUtilities implements Printable {
  private Component componentToBePrinted;

  public static void printComponent(Component c) {
    new PrintUtilities(c).print();
  }

  public PrintUtilities(Component componentToBePrinted) {
    this.componentToBePrinted = componentToBePrinted;
  }

  public void print() {
    PrinterJob printJob = PrinterJob.getPrinterJob();
    PageFormat pf = new PageFormat();
    Paper paper = new Paper();
    double margin = 5;
    paper.setImageableArea(margin, margin, paper.getWidth()-margin*2, paper.getHeight()-margin*2);
    pf.setPaper(paper);
    pf.setOrientation(PageFormat.LANDSCAPE);
    printJob.setPrintable(this, pf);
    if (printJob.printDialog())
      try {
        printJob.print();
      } catch(PrinterException pe) {
        System.out.println("Error printing: " + pe);
      }
  }

  public int print(Graphics g, PageFormat pageFormat, int pageIndex) {
    if (pageIndex > 0) {
      return(NO_SUCH_PAGE);
    } else {


      try {
        Graphics2D g2d = (Graphics2D)g;
        g2d.translate(pageFormat.getImageableX(), pageFormat.getImageableY());
        disableDoubleBuffering(componentToBePrinted);
        componentToBePrinted.paint(g2d);
        enableDoubleBuffering(componentToBePrinted);
        return(PAGE_EXISTS);
      } catch(Exception ex) {
        System.out.println("Error printing: " + ex);
        return(NO_SUCH_PAGE);
      }
    }
  }
  public static void disableDoubleBuffering(Component c) {
    RepaintManager currentManager = RepaintManager.currentManager(c);
    currentManager.setDoubleBufferingEnabled(false);
  }

  public static void enableDoubleBuffering(Component c) {
    RepaintManager currentManager = RepaintManager.currentManager(c);
    currentManager.setDoubleBufferingEnabled(true);
  }
}