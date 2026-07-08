package photo.software.league.folder;

import java.io.File;
import java.io.FileFilter;
import java.io.FileOutputStream;
import java.util.ArrayList;

import javax.swing.JFileChooser;
import javax.swing.JOptionPane;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;

public class ChooseLeagueImageFolder 
{
	File imageFolder;
	
	Workbook wb;
	Sheet sheet;
	Row row;
	
	int lastRef;
	
	public ChooseLeagueImageFolder(int lastRef)
	{
		this.lastRef = lastRef;
		
		if(JOptionPane.showConfirmDialog(null, "Are the images in subfolders?")==JOptionPane.YES_OPTION)
		{
			JFileChooser fc = new JFileChooser();
			fc.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
			int returnVal = fc.showOpenDialog(null);
			if(returnVal ==JFileChooser.APPROVE_OPTION)
			{
				imageFolder = fc.getSelectedFile();
				prepExcelTeams();
			}
		}
		else
		{
			JFileChooser fc = new JFileChooser();
			fc.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
			int returnVal = fc.showOpenDialog(null);
			if(returnVal ==JFileChooser.APPROVE_OPTION)
			{
				imageFolder = fc.getSelectedFile();
				prepExcel();
			}
		}
		
	}
	private void prepExcelTeams()
	{
		ArrayList<ImageTeam> imageTeam = new ArrayList<ImageTeam>();
		File[] folders = null;
		if(imageFolder.isDirectory())
		{
			folders = imageFolder.listFiles(new FileFilter(){
				public boolean accept(File arg0){
					if(arg0.isDirectory()) return true;
					return false;
				}
			});
			File[] images = null;
			for(File f:folders)
			{
				images = f.listFiles(new FileFilter(){
					public boolean accept(File arg0){
						if(arg0.getName().toUpperCase().endsWith(".JPG")) return true;
						return false;
					}
				});
				if(images!=null)
				{
					for(File img:images) imageTeam.add(new ImageTeam(img,f.getName()));
				}
			}
			try
			{
				wb = new HSSFWorkbook();
				sheet = wb.createSheet("Sheet1");
				int i=0;
				row = sheet.createRow(i);
				row.createCell(0).setCellValue("Ref #");
				row.createCell(1).setCellValue("Img #");
				row.createCell(2).setCellValue("Name1");
				row.createCell(3).setCellValue("Name2");
				row.createCell(4).setCellValue("Team");
				row.createCell(5).setCellValue("Order");
				i++;
				row = sheet.createRow(i);
				for(ImageTeam imgTeam:imageTeam)
				{
					row.createCell(0).setCellValue(++lastRef);
					row.createCell(1).setCellValue(imgTeam.image.getName());
					row.createCell(4).setCellValue(imgTeam.team);
					row = sheet.createRow(++i);
				}
				sheet.setColumnWidth(1, 7680);
				FileOutputStream fileOut = new FileOutputStream(imageFolder+"\\_Images.xls");
				wb.write(fileOut);
				fileOut.close();
			}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Outputing Excel File: "+e);}
		}
	}
	private void prepExcel()
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
				row.createCell(2).setCellValue("Name1");
				row.createCell(3).setCellValue("Name2");
				row.createCell(4).setCellValue("Team");
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