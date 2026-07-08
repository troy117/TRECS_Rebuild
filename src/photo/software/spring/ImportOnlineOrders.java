package photo.software.spring;

import java.io.FileInputStream;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.ArrayList;

import javax.swing.JOptionPane;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

public class ImportOnlineOrders 
{
	private String[] rowValues;
	public static final int COLUMN = 12;
	private ArrayList<String[]> inputData;
	NumberFormat formatter = new DecimalFormat("############");
	public ImportOnlineOrders(String fileToLoad)
	{
		if(fileToLoad.substring(fileToLoad.lastIndexOf(".")+1).equals("xls")) XLSImport(fileToLoad);
		else if(fileToLoad.substring(fileToLoad.indexOf(".")+1).equals("xlsx")) XLSXImport(fileToLoad);
		else JOptionPane.showMessageDialog(null, "Error Importing Data, not xls or xlsx");
	}
	public void XLSImport(String fileToLoad)
	{
		inputData=new ArrayList<String[]>();
		try
		{
			HSSFWorkbook wb = new HSSFWorkbook(new FileInputStream(fileToLoad));
			HSSFSheet sheet = wb.getSheetAt(0);
			int rows = sheet.getPhysicalNumberOfRows();
			for (int r = 0; r < rows; r++) {
				HSSFRow row = sheet.getRow(r);
				if (row == null) {
					continue;
				}
				rowValues = new String[COLUMN];
				for (int c = 0; c < COLUMN; c++) {
					HSSFCell cell = row.getCell(c);
					
					String value = null;
					try{
						switch (cell.getCellType()) {
							case HSSFCell.CELL_TYPE_FORMULA:
								value = "" + cell.getCellFormula();
								break;
		
							case HSSFCell.CELL_TYPE_NUMERIC:
								value = "" + cell.getNumericCellValue();
								break;
		
							case HSSFCell.CELL_TYPE_STRING:
								value = "" + cell.getStringCellValue();
								break;
							
							default:
							}
						}
					catch(NullPointerException e){value="";}
					if(value==null)value="";
					rowValues[c]=value;
				}
				if((rowValues[0].equals(""))&&(rowValues[1].equals(""))
						&&(rowValues[2].equals(""))&&(rowValues[3].equals(""))
						&&(rowValues[4].equals(""))&&(rowValues[5].equals(""))
						&&(rowValues[6].equals(""))&&(rowValues[7].equals(""))) 
					{
						break;
					}
				else {
					rowValues[1] = ""+formatter.format(Double.parseDouble(rowValues[1]));
					inputData.add(rowValues);
				}
			}
			wb.close();
		}catch(Exception e){System.out.println("ERROR: "+e);}
	}
	public void XLSXImport(String fileToLoad)
	{
		inputData=new ArrayList<String[]>();
		try
		{
			XSSFWorkbook wb = new XSSFWorkbook(new FileInputStream(fileToLoad));
			XSSFSheet sheet = wb.getSheetAt(0);
			int rows = sheet.getPhysicalNumberOfRows();
			for (int r = 0; r < rows; r++) {
				XSSFRow row = sheet.getRow(r);
				if (row == null) {
					continue;
				}
				rowValues = new String[COLUMN];
				for (int c = 0; c < COLUMN; c++) {
					XSSFCell cell = row.getCell(c);
					
					String value = null;
					try{
						switch (cell.getCellType()) {
							case XSSFCell.CELL_TYPE_FORMULA:
								value = "" + cell.getCellFormula();
								break;
		
							case XSSFCell.CELL_TYPE_NUMERIC:
								value = "" + cell.getNumericCellValue();
								break;
		
							case XSSFCell.CELL_TYPE_STRING:
								value = "" + cell.getStringCellValue();
								break;
							
							default:
							}
						}
					catch(NullPointerException e){value="";}
					if(value==null)value="";
					rowValues[c]=value;
				}
				if((rowValues[0].equals(""))&&(rowValues[1].equals(""))
						&&(rowValues[2].equals(""))&&(rowValues[3].equals(""))
						&&(rowValues[4].equals(""))&&(rowValues[5].equals(""))
						&&(rowValues[6].equals(""))&&(rowValues[7].equals(""))) 
					{
						break;
					}
				else {
					rowValues[1] = ""+formatter.format(Double.parseDouble(rowValues[1]));
					inputData.add(rowValues);
				}
			}
			wb.close();
		}catch(Exception e){System.out.println("ERROR: "+e);}
	}

	public ArrayList<String[]> getData() {return inputData;}
}
