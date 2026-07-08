package photo.software.event.folder;

import java.io.File;
import java.io.FileInputStream;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.ArrayList;

import javax.swing.JFileChooser;
import javax.swing.JOptionPane;

import org.apache.commons.io.FileUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

import photo.software.event.EventGUI;
import photo.software.event.EventStudent;
import photo.software.login.JobData;

public class LoadImageFolder 
{
	File imageFolder,excelFile;
	String[] rowValues;
	private ArrayList<String[]> inputData;
	private String schoolPath;
	private EventGUI eventGUI;
	
	NumberFormat formatter = new DecimalFormat("############.#");
	
	public LoadImageFolder(JobData job,EventGUI eventGUI, String schoolPath)
	{
		this.eventGUI = eventGUI;
		this.schoolPath = schoolPath;
		JFileChooser fc = new JFileChooser();
		fc.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
		int returnVal = fc.showOpenDialog(null);
		if(returnVal ==JFileChooser.APPROVE_OPTION)
		{
			imageFolder = fc.getSelectedFile();
			excelFile = new File(imageFolder.getAbsolutePath()+"\\_Images.xls");
			if(excelFile.exists())
				if(copyDatabase()) 
					if(updateDatabase()) 
						copyImages();
		}
	}
	public boolean copyDatabase()
	{
		try
		{
			inputData = new ArrayList<String[]>();
			HSSFWorkbook wb = new HSSFWorkbook(new FileInputStream(excelFile));
			HSSFSheet sheet = wb.getSheetAt(0);
			HSSFCell cell;
			String temp;
			int rows = sheet.getPhysicalNumberOfRows();
			for (int r = 1; r < rows; r++) 
			{
				HSSFRow row = sheet.getRow(r);
				if (row == null) {
					continue;
				}
				rowValues = new String[6];
				for(int c=0; c<6;c++)
				{
					cell = row.getCell(c);
					temp = null;
					try{
						switch (cell.getCellType()) {
							case HSSFCell.CELL_TYPE_FORMULA:
								temp = "" + cell.getCellFormula();
								break;
		
							case HSSFCell.CELL_TYPE_NUMERIC:
								temp = formatter.format(cell.getNumericCellValue());
								break;
		
							case HSSFCell.CELL_TYPE_STRING:
								temp = "" + cell.getStringCellValue().toUpperCase();
								break;
							
							default:
							}
						}
					catch(NullPointerException e){temp="";}
					if(temp==null) temp = "";
					
					rowValues[c] = temp.toUpperCase().trim();
				}
				if((rowValues[0].equals(""))&&(rowValues[1].equals(""))
						&&(rowValues[2].equals(""))&&(rowValues[3].equals(""))
						&&(rowValues[4].equals(""))&&(rowValues[5].equals(""))) break;
				else inputData.add(rowValues);
			}
			wb.close();
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Somewhere reading Excel file: "+e);return false;}
		return true;
	}
	public boolean updateDatabase()
	{
		ArrayList<EventStudent> students = new ArrayList<EventStudent>();
		EventStudent temp;
		for(int i=0;i<inputData.size();i++)
		{
			temp = new EventStudent(inputData.get(i)[0],inputData.get(i)[1],inputData.get(i)[2],inputData.get(i)[3],
					inputData.get(i)[4],inputData.get(i)[5],"");
			students.add(temp);
		}
		return eventGUI.updateDatabase(students);
	}
	public void copyImages()
	{
		try
		{
			FileUtils.copyDirectory(imageFolder, new File(schoolPath+"\\Images"));
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Copying Images: "+e);}
		JOptionPane.showMessageDialog(null, "Complete!");
	}
}
