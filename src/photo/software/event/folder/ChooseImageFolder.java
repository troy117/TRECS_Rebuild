package photo.software.event.folder;

import java.io.File;
import java.io.FileFilter;
import java.io.FileOutputStream;

import javax.swing.JFileChooser;
import javax.swing.JOptionPane;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;

public class ChooseImageFolder 
{
	File imageFolder;
	Workbook wb;
	Sheet sheet;
	Row row;
	int lastRef;
	
	public ChooseImageFolder(boolean event, int lastRef)
	{
		this.lastRef = lastRef;
		JFileChooser fc = new JFileChooser();
		fc.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
		int returnVal = fc.showOpenDialog(null);
		if(returnVal ==JFileChooser.APPROVE_OPTION)
		{
			imageFolder = fc.getSelectedFile();
			if(event) prepEventExcel();
			else prepSportExcel();
		}
	}

	private void prepSportExcel()
	{
		File[] images = null;
		if(imageFolder.isDirectory())
		{
			images = imageFolder.listFiles(new FileFilter(){
				public boolean accept(File arg0) {
					if(arg0.getName().toUpperCase().endsWith(".JPG")) return true;
					return false;
				}
			});
		}
		if(images!=null)
		{
			try
			{
				wb = new HSSFWorkbook();
				sheet = wb.createSheet("Sheet1");
				int i=0;
				row = sheet.createRow(i);
				row.createCell(0).setCellValue("RefNum");
				row.createCell(1).setCellValue("First");
				row.createCell(2).setCellValue("Last");
				row.createCell(3).setCellValue("StuID");
				row.createCell(4).setCellValue("Grade");
				row.createCell(5).setCellValue("Homeroom");
				row.createCell(6).setCellValue("Track");
				row.createCell(7).setCellValue("Photo");
				row.createCell(8).setCellValue("Field1");
				row.createCell(9).setCellValue("Field2");
				row.createCell(10).setCellValue("Notes");
				row.createCell(11).setCellValue("Order1");
				row.createCell(12).setCellValue("Order1Pay");
				row.createCell(13).setCellValue("Order2");
				row.createCell(14).setCellValue("Order2Pay");
				
				i++;
				row = sheet.createRow(i);
				row.createCell(0).setCellValue(lastRef);
				row = sheet.createRow(++i);
				for(File image:images)
				{
					row.createCell(0).setCellValue(image.getName());
					row = sheet.createRow(++i);
				}
				sheet.setColumnWidth(0, 4000);
				sheet.setColumnWidth(1, 5000);
				sheet.setColumnWidth(2, 5000);
				sheet.setColumnWidth(3, 2500);
				sheet.setColumnWidth(4, 2500);
				sheet.setColumnWidth(5, 5000);
				sheet.setColumnWidth(6, 2500);
				
				FileOutputStream fileOut = new FileOutputStream(imageFolder+"\\_Images.xls");
				wb.write(fileOut);
				fileOut.close();
			}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Outputing Excel File: "+e);}
		}
	}
	private void prepEventExcel()
	{
		File[] images = null;
		if(imageFolder.isDirectory())
		{
			images = imageFolder.listFiles(new FileFilter(){
				public boolean accept(File arg0) {
					if(arg0.getName().toUpperCase().endsWith(".JPG")) return true;
					return false;
				}
			});
		}
		if(images!=null)
		{
			try
			{
				wb = new HSSFWorkbook();
				sheet = wb.createSheet("Sheet1");
				int i=0;
				row = sheet.createRow(i);
				row.createCell(0).setCellValue("Ref #");
				row.createCell(1).setCellValue("Img #");
				row.createCell(2).setCellValue("First");
				row.createCell(3).setCellValue("Last");
				row.createCell(4).setCellValue("Homeroom");
				row.createCell(5).setCellValue("Order");
				i++;
				row = sheet.createRow(i);
				for(File image:images)
				{
					row.createCell(0).setCellValue(++lastRef);
					row.createCell(1).setCellValue(image.getName());
					row = sheet.createRow(++i);
				}
				sheet.setColumnWidth(1, 7680);
				FileOutputStream fileOut = new FileOutputStream(imageFolder+"\\_Images.xls");
				wb.write(fileOut);
				fileOut.close();
			}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Outputing Excel File: "+e);}
		}
	}
}
